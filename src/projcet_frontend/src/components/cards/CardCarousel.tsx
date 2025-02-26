import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardCarouselProps {
  cards: React.ReactNode[];
  cardWidth: number;
  gap: number;
  containerWidth?: number; // Optional: if you want to explicitly set container width
}

const CardCarousel: React.FC<CardCarouselProps> = ({
  cards,
  cardWidth,
  gap,
  containerWidth,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);
  const [effectiveGap, setEffectiveGap] = useState(gap);

  // Calculate how many cards can fit in the container
  useEffect(() => {
    const calculateVisibleCards = () => {
      if (containerRef.current) {
        const availableWidth =
          containerWidth || containerRef.current.clientWidth;

        // Calculate how many cards can fit (including gaps)
        const cardsWithGap = availableWidth / (cardWidth + gap);

        // Floor the number to get whole cards only
        const wholeCards = Math.floor(cardsWithGap);

        // Calculate the remaining space
        const remainingSpace =
          availableWidth - (wholeCards * cardWidth + (wholeCards - 1) * gap);

        // Adjust gap if we have multiple cards
        if (wholeCards > 1) {
          // Recalculate gap to distribute remaining space evenly
          const newGap = gap + remainingSpace / (wholeCards - 1);
          setEffectiveGap(newGap);
        } else {
          setEffectiveGap(gap);
        }

        setVisibleCards(wholeCards);
      }
    };

    calculateVisibleCards();
    window.addEventListener("resize", calculateVisibleCards);
    return () => window.removeEventListener("resize", calculateVisibleCards);
  }, [cardWidth, gap, containerWidth, cards.length]);

  // Update maxScroll when component mounts or dependencies change
  useEffect(() => {
    if (carouselRef.current) {
      setMaxScroll(
        carouselRef.current.scrollWidth - carouselRef.current.clientWidth
      );
    }

    // Add resize event listener
    const handleResize = () => {
      if (carouselRef.current) {
        setMaxScroll(
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth
        );
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cards, cardWidth, effectiveGap, visibleCards]);

  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  // Scroll to the previous set of cards
  const scrollPrev = () => {
    if (carouselRef.current && !isAnimating) {
      setIsAnimating(true);

      // Calculate the scroll position to the previous card
      const itemWidth = cardWidth + effectiveGap;
      const currentIndex = Math.round(scrollPosition / itemWidth);
      const targetIndex = Math.max(currentIndex - 1, 0);
      const newPosition = targetIndex * itemWidth;

      carouselRef.current.style.scrollBehavior = "smooth";
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  // Scroll to the next set of cards
  const scrollNext = () => {
    if (carouselRef.current && !isAnimating) {
      setIsAnimating(true);

      // Calculate the scroll position to the next card
      const itemWidth = cardWidth + effectiveGap;
      const currentIndex = Math.round(scrollPosition / itemWidth);
      const maxIndex = Math.floor(maxScroll / itemWidth);
      const targetIndex = Math.min(currentIndex + 1, maxIndex);
      const newPosition = targetIndex * itemWidth;

      carouselRef.current.style.scrollBehavior = "smooth";
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <div className="relative w-[90%] px-4" ref={containerRef}>
      {/* Display calculated visible cards (for debugging) */}
      {/* <div className="text-sm text-gray-500 mb-2">
        Visible cards: {visibleCards}, Effective gap: {effectiveGap.toFixed(2)}px
      </div> */}

      {/* Left navigation button */}
      <button
        onClick={scrollPrev}
        className={`absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${
          scrollPosition <= 0
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 hover:bg-gray-100"
        }`}
        disabled={scrollPosition <= 0 || isAnimating}
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Carousel container */}
      <div
        className="relative overflow-hidden h-auto"
        style={{ padding: `0 ${gap}px` }}
      >
        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide py-4"
          style={{
            gap: `${effectiveGap}px`,
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onScroll={handleScroll}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 snap-start"
              style={{
                width: `${cardWidth}px`,
                scrollSnapAlign: "start",
              }}
            >
              {card}
            </div>
          ))}
        </div>
      </div>

      {/* Right navigation button */}
      <button
        onClick={scrollNext}
        className={`absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${
          scrollPosition >= maxScroll
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 hover:bg-gray-100"
        }`}
        disabled={scrollPosition >= maxScroll || isAnimating}
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

// Add CSS for hiding scrollbar
const globalStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default CardCarousel;
