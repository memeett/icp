import { useState, useEffect } from "react";
import { JobRatingPayload, ratingUser } from "../../controller/ratingController";

interface RatingSectionProps {
  ratings: JobRatingPayload[];
  onFinish: () => void;
}

export default function RatingSection({ ratings, onFinish }: RatingSectionProps) {
  // Deduplicate ratings by user ID
  const [uniqueRatings, setUniqueRatings] = useState<JobRatingPayload[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentRatingIndex, setCurrentRatingIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right" | "">("");
  const [ratedUsers, setRatedUsers] = useState<{[key: string]: number}>({});

  // Deduplicate ratings on component mount
  useEffect(() => {
    if (ratings.length > 0) {
      // Use a Map to deduplicate by user ID
      const uniqueMap = new Map<string, JobRatingPayload>();
      
      ratings.forEach(rating => {
        const userId = String(rating.user.id);
        // Only add if not already in the map
        if (!uniqueMap.has(userId)) {
          uniqueMap.set(userId, rating);
        }
      });
      
      // Convert map values to array
      const deduplicatedRatings = Array.from(uniqueMap.values());
      console.log("Original ratings count:", ratings.length);
      console.log("Deduplicated ratings count:", deduplicatedRatings.length);
      
      setUniqueRatings(deduplicatedRatings);
    }
  }, [ratings]);

  // Initialize selectedRating with current rating value or from previously rated users
  useEffect(() => {
    if (uniqueRatings.length > 0) {
      const ratingId = String(uniqueRatings[currentRatingIndex].rating_id);
      if (ratedUsers[ratingId]) {
        setSelectedRating(ratedUsers[ratingId]);
      } else {
        setSelectedRating(uniqueRatings[currentRatingIndex].rating || 0);
      }
    }
  }, [currentRatingIndex, uniqueRatings, ratedUsers]);

  // Don't render anything if there are no ratings
  if (uniqueRatings.length === 0) return null;

  // Function to go to previous freelancer with data preservation
  const handlePrevious = () => {
    if (currentRatingIndex > 0) {
      setAnimationDirection("left");
      setTimeout(() => {
        setCurrentRatingIndex((prev) => prev - 1);
        setTimeout(() => setAnimationDirection(""), 50);
      }, 200);
    }
  };

  // Function to go to next freelancer with data preservation
  const handleNext = () => {
    if (currentRatingIndex < uniqueRatings.length - 1) {
      // Store current rating before moving
      const currentRatingId = String(uniqueRatings[currentRatingIndex].rating_id);
      setRatedUsers(prev => ({
        ...prev,
        [currentRatingId]: selectedRating
      }));
      
      setAnimationDirection("right");
      setTimeout(() => {
        setCurrentRatingIndex((prev) => prev + 1);
        setTimeout(() => setAnimationDirection(""), 50);
      }, 200);
    }
  };


  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      // alert("Please select a rating before proceeding.");
      return;
    }

    setIsSubmitting(true);
    const currentRatingId = String(uniqueRatings[currentRatingIndex].rating_id);

    try {
      const result = await ratingUser(
        currentRatingId,
        selectedRating
      );

      if (result === "Success") {
        setRatedUsers(prev => ({
          ...prev,
          [currentRatingId]: selectedRating
        }));
        
        if (currentRatingIndex < uniqueRatings.length - 1) {
          setAnimationDirection("right");
          setTimeout(() => {
            setCurrentRatingIndex((prev) => prev + 1);
            setTimeout(() => setAnimationDirection(""), 50);
          }, 200);
        } else {
          onFinish();
        }
      } 
    } catch (error) {
      console.error("Rating submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip to finish (optional)
  const handleFinish = () => {
    const unansweredRatings = uniqueRatings.filter((_, index) => 
      index > currentRatingIndex || 
      !ratedUsers[String(uniqueRatings[currentRatingIndex].rating_id)]
    );
    
    if (unansweredRatings.length > 0) {
      if (window.confirm(`You have ${unansweredRatings.length} unrated freelancers. Are you sure you want to finish?`)) {
        onFinish();
      }
    } else {
      onFinish();
    }
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Select Rating";
    }
  };

  const getCurrentFreelancer = () => {
    return uniqueRatings[currentRatingIndex]?.user?.username || "Freelancer";
  };

  const getUserProfilePicture = () => {
    const picture = uniqueRatings[currentRatingIndex]?.user?.profilePicture;
    if (picture) {
      try {
        return URL.createObjectURL(picture);
      } catch (error) {
        console.error("Error creating URL for profile picture:", error);
        return null;
      }
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mt-8 max-w-md mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Rate Your Freelancers</h2>
      
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="w-full bg-gray-200 h-1 absolute top-4"></div>
        <div className="flex justify-between relative">
          {Array.from({ length: uniqueRatings.length }).map((_, idx) => {
            const isRated = ratedUsers[String(uniqueRatings[idx].rating_id)];
            return (
              <div 
                key={idx} 
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors
                  ${isRated ? 'bg-green-600 text-white' : 
                    idx === currentRatingIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      <div 
        className={`transition-opacity duration-200 ${animationDirection ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-indigo-100 shadow-md">
            {getUserProfilePicture() ? (
              <img
                src={getUserProfilePicture()!}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-2xl font-bold">
                {getCurrentFreelancer().charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-center mb-2">
          {getCurrentFreelancer()}
        </h3>


        <div className="flex justify-center gap-3 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              aria-label={`Rate ${star} stars`}
              className={`text-4xl transition-all duration-200 hover:scale-125 focus:outline-none
                ${star <= selectedRating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
        
        <p className="text-center text-indigo-700 font-medium mb-8">
          {getRatingLabel(selectedRating)}
        </p>
      </div>

      <div className="flex justify-between items-center">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentRatingIndex === 0 || isSubmitting}
          className="px-4 py-2 rounded-lg transition-colors flex items-center 
                   disabled:opacity-50 text-indigo-700 hover:bg-indigo-50"
          aria-label="Go to previous freelancer"
        >
          ← Previous
        </button>

        <span className="text-gray-500 font-medium">
          {currentRatingIndex + 1} of {uniqueRatings.length}
        </span>

        <div className="flex gap-2">
          {/* Navigation between freelancers without submitting */}
          {currentRatingIndex < uniqueRatings.length - 1 && (
            <button
              onClick={handleNext}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                       transition-colors shadow-sm disabled:opacity-70"
              disabled={isSubmitting}
              aria-label="Skip to next freelancer without rating"
            >
              Skip
            </button>
          )}

          {/* Submit rating button */}
          <button
            onClick={handleSubmitRating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                     transition-colors shadow-md disabled:opacity-70"
            disabled={isSubmitting || selectedRating === 0}
            aria-label={currentRatingIndex === uniqueRatings.length - 1 ? "Submit rating and finish" : "Submit rating and go to next"}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting
              </span>
            ) : (
              currentRatingIndex === uniqueRatings.length - 1 ? 'Finish' : 'Submit'
            )}
          </button>
        </div>
      </div>

      {/* Optional: For long lists, add finish early option */}
      {uniqueRatings.length > 3 && currentRatingIndex < uniqueRatings.length - 1 && (
        <div className="mt-6 text-center">
          <button 
            onClick={handleFinish}
            className="text-gray-500 hover:text-indigo-600 text-sm"
            disabled={isSubmitting}
          >
            Skip all and finish
          </button>
        </div>
      )}
    </div>
  );
}