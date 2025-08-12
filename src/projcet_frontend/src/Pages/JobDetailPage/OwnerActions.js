import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// OwnerActions.tsx
import { motion } from "framer-motion";
export const OwnerActions = ({ job, appliersCount, onViewApplicants, onStartJob, onFinishJob, // Add a new prop for handling the finish job action
 }) => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm", children: [_jsx("h3", { className: "text-xl font-semibold text-indigo-800 mb-1", children: "Manage Applicants" }), _jsx("p", { className: "text-sm text-gray-600", children: "Review and manage applicants for your job posting." })] }), _jsxs(motion.button, { whileHover: { scale: 1.05 }, className: "w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-400 to-pink-300 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg", onClick: onViewApplicants, children: ["View Applicants (", appliersCount, ")"] }), job.jobStatus === "Finished" ? (
        // Disabled button for finished jobs
        _jsx(motion.button, { whileHover: { scale: 1 }, className: "w-full py-2 px-4 rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold text-sm cursor-not-allowed opacity-70", disabled: true, children: "Job Finished" })) : job.jobStatus === "Ongoing" ? (
        // Show "Finish Job" button if the job status is "Ongoing"
        _jsx(motion.button, { whileHover: { scale: 1.05 }, className: "w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-800 hover:to-pink-900 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg", onClick: onFinishJob, children: "Finish Job" })) : (
        // Show "Start Job" button if the job status is neither "Finished" nor "Ongoing"
        _jsx(motion.button, { whileHover: { scale: 1.05 }, className: "w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg", onClick: onStartJob, children: "Start Job" }))] }));
