import { motion } from "framer-motion";
import { ApplierPayload } from "../../interface/Applier";
import { useNavigate } from "react-router-dom";

export const ApplicantsModal = ({
  appliers,
  onClose,
  handleAccept,
  handleReject,
  isLoading
}: {
  appliers: ApplierPayload[];
  onClose: () => void;
  handleAccept: (userid: string) => void;
  handleReject: (userid: string) => void;
  isLoading: Boolean
}) => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Applicants</h3>
            <button
              className="text-white/80 hover:text-white transition-colors duration-200 bg-white/20 rounded-full p-2"
              onClick={onClose}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-white/70 text-sm mt-2">
            {appliers.length} people applied for this position
          </p>
        </div>

        {/* Empty state */}
        {appliers.length === 0 &&  !isLoading && (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h4 className="mt-4 text-lg font-medium text-gray-900">No applicants yet</h4>
            <p className="mt-2 text-gray-500">Check back later for new applications.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Applicants List */}
        {appliers.length > 0 &&  !isLoading &&(
          <motion.div
            className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {appliers.map((applier, index) => (
              <motion.div
                key={index}
                className="p-4 border-b border-gray-100 hover:bg-purple-50 transition-all duration-200"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => navigate(`/profile/${applier.user.id}`)}
                    whileHover={{ x: 5 }}
                  >
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(applier.user.profilePicture)}
                        alt={applier.user.username}
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-200"
                      />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-gray-900 block">
                        {applier.user.username}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Applied 2 days ago
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(applier.user.id);
                      }}
                      aria-label="Accept"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.button>
                    <motion.button
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(applier.user.id);
                      }}
                      aria-label="Reject"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* User Preferences */}
                {applier.user.preference && applier.user.preference.length > 0 && (
                  <div className="mt-3 pl-16">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {applier.user.preference.map((pref, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                          >
                            {pref.jobCategoryName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {applier.user.preference && applier.user.preference.length == 0 && (
                  <div className="mt-3 pl-16">
                    <div className="text-sm text-gray-600">
                      User has not yet set preference
                    </div>

                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-50">
          <button
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};