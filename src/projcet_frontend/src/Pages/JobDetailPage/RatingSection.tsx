import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { Job } from "../../interface/job/Job";
import { User } from "../../interface/User";

interface FreelancerRating {
  freelancerId: string;
  rating: number;
  feedback: string;
}

export default function FinishedSection({ job, acceptedFreelancers }: { job: Job , acceptedFreelancers: User[]}) {
//   const [freelancers, setFreelancers] = useState<User[]>([]);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [submittedRatings, setSubmittedRatings] = useState<FreelancerRating[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const handleRatingChange = (freelancerId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [freelancerId]: rating
    }));
  };

  const handleFeedbackChange = (freelancerId: string, text: string) => {
    setFeedback(prev => ({
      ...prev,
      [freelancerId]: text
    }));
  };

  const submitRating = async (freelancerId: string) => {
    if (!ratings[freelancerId]) {
      setErrorMessage("Please provide a rating");
      return;
    }

    try {
      // You'll need to implement this API call
      // await submitFreelancerRating({
      //   jobId: job.id,
      //   freelancerId,
      //   rating: ratings[freelancerId],
      //   feedback: feedback[freelancerId] || ""
      // });

      setSubmittedRatings(prev => [...prev, {
        freelancerId,
        rating: ratings[freelancerId],
        feedback: feedback[freelancerId] || ""
      }]);

      // Clear the form
      setRatings(prev => {
        const newRatings = { ...prev };
        delete newRatings[freelancerId];
        return newRatings;
      });
      setFeedback(prev => {
        const newFeedback = { ...prev };
        delete newFeedback[freelancerId];
        return newFeedback;
      });
    } catch (err) {
      console.error("Error submitting rating:", err);
      setErrorMessage("Failed to submit rating");
    }
  };

  const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`focus:outline-none ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mb-5">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-indigo-800 mb-4">Rate Freelancers</h1>
          <p className="text-gray-600">Provide feedback for the freelancers who worked on this project</p>
        </motion.div>

        {acceptedFreelancers.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Users className="w-16 h-16 text-indigo-300 mb-4" />
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">No freelancers to rate</h3>
            <p className="text-gray-600 text-center">
              There are currently no freelancers assigned to this project.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {acceptedFreelancers.map((freelancer) => {
              const isRated = submittedRatings.some(r => r.freelancerId === freelancer.id);

              return (
                <motion.div
                  key={freelancer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-indigo-100 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden">
                      {/* Add profile picture handling here */}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-800">
                        {freelancer.username}
                      </h3>
                      <p className="text-sm text-gray-600">Overall Rating: {freelancer.rating}/5</p>
                    </div>
                  </div>

                  {!isRated ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <StarRating
                          value={ratings[freelancer.id] || 0}
                          onChange={(rating) => handleRatingChange(freelancer.id, rating)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Feedback
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                          rows={4}
                          value={feedback[freelancer.id] || ''}
                          onChange={(e) => handleFeedbackChange(freelancer.id, e.target.value)}
                          placeholder="Share your experience working with this freelancer..."
                        />
                      </div>

                      <button
                        onClick={() => submitRating(freelancer.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                      >
                        Submit Rating
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">Rating submitted successfully</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
