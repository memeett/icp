import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardCarouselProps {
  cards: React.ReactNode[];
  cardWidth: number;
  gap: number;
  visibleCards?: number;
}

const CardCarousel: React.FC<CardCarouselProps> = ({
  cards,
  cardWidth,
  gap,
  visibleCards = 4,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
  }, [cards, cardWidth, gap, visibleCards]);

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
      const itemWidth = cardWidth + gap;
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
      }, 500); // Match this to your transition duration
    }
  };

  // Scroll to the next set of cards
  const scrollNext = () => {
    if (carouselRef.current && !isAnimating) {
      setIsAnimating(true);

      // Calculate the scroll position to the next card
      const itemWidth = cardWidth + gap;
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
      }, 500); // Match this to your transition duration
    }
  };
  return (
    <div className="relative w-[90%] px-4">
      {/* Left navigation button */}
      <button
        onClick={scrollPrev}
        className={`absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-opacity ${
          scrollPosition <= 0
            ? "hidden"
            : "opacity-100 hover:bg-gray-100"
        }`}
        disabled={scrollPosition <= 0}
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
            gap: `${gap}px`,
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
          scrollPosition >= maxScroll - 1
            ? "hidden"
            : "opacity-100 hover:bg-gray-100"
        }`}
        disabled={scrollPosition >= maxScroll}
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default CardCarousel;
