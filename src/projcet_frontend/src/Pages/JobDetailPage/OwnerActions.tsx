// OwnerActions.tsx
import { motion } from "framer-motion";

export const OwnerActions = ({
  appliersCount,
  onViewApplicants,
  onStartJob,
}: {
  appliersCount: number;
  onViewApplicants: () => void;
  onStartJob: () => void;
}) => (
  <div className="space-y-4">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-indigo-800 mb-1">
        Manage Applicants
      </h3>
      <p className="text-sm text-gray-600">
        Review and manage applicants for your job posting.
      </p>
    </div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
      onClick={onViewApplicants}
    >
      View Applicants ({appliersCount})
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.05 }}
      className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
      onClick={onStartJob}
    >
      Start Job
    </motion.button>
  </div>
);