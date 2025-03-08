import { useState, useEffect } from "react";
import { JobRatingPayload, ratingUser } from "../../controller/ratingController";

interface RatingSectionProps {
  ratings: JobRatingPayload[];
  onFinish: () => void; // Callback saat semua rating selesai
}

export default function RatingSection({ ratings, onFinish }: RatingSectionProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentRatingIndex, setCurrentRatingIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk menangani loading saat submit

  // Inisialisasi selectedRating dengan nilai rating saat ini
  useEffect(() => {
    if (ratings.length > 0) {
      setSelectedRating(ratings[currentRatingIndex].rating);
    }
  }, [currentRatingIndex, ratings]);

  // Jika tidak ada ratings, jangan render apa pun
  if (ratings.length === 0) return null;

  const handleNextRating = async () => {
    if (selectedRating === 0) {
      alert("Please select a rating before proceeding.");
      return;
    }

    console.log("Current Rating ID:", ratings[currentRatingIndex].rating_id);
    console.log("Selected Rating:", selectedRating);

    setIsSubmitting(true);

    try {
      const result = await ratingUser(
        String(ratings[currentRatingIndex].rating_id), // Convert BigInt to string
        selectedRating
      );

      if (result === "Success") {
        if (currentRatingIndex < ratings.length - 1) {
          setCurrentRatingIndex((prev) => prev + 1);
          // Set selectedRating ke nilai rating freelancer berikutnya
          setSelectedRating(ratings[currentRatingIndex + 1].rating);
        } else {
          onFinish();
        }
      } else {
        alert(`Error: ${result}`);
      }
    } catch (error) {
      alert("Failed to submit rating. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6">Rate Freelancers</h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          {ratings[currentRatingIndex].user.profilePicture && (
            <img
              src={URL.createObjectURL(ratings[currentRatingIndex].user.profilePicture)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          Rate {ratings[currentRatingIndex].user.username}
        </h3>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setSelectedRating(star)}
            className={`text-3xl transition-transform hover:scale-125 ${
              star <= selectedRating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-600">
          {currentRatingIndex + 1} of {ratings.length}
        </span>
        <div className="flex gap-3">
          <button
            onClick={handleNextRating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isSubmitting} // Nonaktifkan tombol saat loading
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              currentRatingIndex === ratings.length - 1 ? 'Finish' : 'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}