// ApplicantsModal.tsx
import { motion } from "framer-motion";
import { ApplierPayload } from "../../interface/Applier";

export const ApplicantsModal = ({
  appliers,
  onClose,
  handleAccept,
  handleReject,
}: {
  appliers: ApplierPayload[];
  onClose: () => void;
  handleAccept: (userid: string) => void;
  handleReject: (userid: string) => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Applicants</h3>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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

      <div className="max-h-[400px] overflow-y-auto">
        {appliers.map((applier, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <img
                src={URL.createObjectURL(applier.user.profilePicture)}
                alt={applier.user.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              <div>
                <span className="text-gray-800 font-semibold block text-sm">
                  {applier.user.username}
                </span>
                <span className="text-xs text-gray-500">
                  Applied 2 days ago
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all duration-200"
                onClick={() => handleAccept(applier.user.id)}
              >
                Accept
              </button>
              <button
                className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200"
                onClick={() => handleReject(applier.user.id)}
              >
                Reject
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <button
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);