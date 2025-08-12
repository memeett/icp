import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X, Calendar, DollarSign, Users, Tag, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "../../utils/dateUtils";
export default function JobDetailModal({ job, onClose }) {
    const modalVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };
    const contentVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { delay: 0.1, duration: 0.3 } }
    };
    // Get category color based on name
    const getCategoryColor = (name) => {
        const colors = {
            default: { bg: "bg-blue-100", text: "text-blue-700" },
            design: { bg: "bg-purple-100", text: "text-purple-700" },
            development: { bg: "bg-indigo-100", text: "text-indigo-700" },
            marketing: { bg: "bg-pink-100", text: "text-pink-700" },
            writing: { bg: "bg-orange-100", text: "text-orange-700" },
            finance: { bg: "bg-green-100", text: "text-green-700" },
            management: { bg: "bg-yellow-100", text: "text-yellow-700" },
            support: { bg: "bg-teal-100", text: "text-teal-700" },
        };
        const lowerName = name?.toLowerCase() || "";
        for (const [key, value] of Object.entries(colors)) {
            if (lowerName.includes(key)) {
                return value;
            }
        }
        return colors.default;
    };
    return (_jsx(motion.div, { initial: "hidden", animate: "visible", exit: "exit", variants: modalVariants, className: "fixed inset-0 z-50 bg-transparent backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4", children: _jsxs(motion.div, { variants: contentVariants, className: "bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-indigo-100", children: [_jsx("div", { className: "sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 z-10", children: _jsxs("div", { className: "px-6 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Job Details" }), _jsx("button", { onClick: onClose, className: "p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors", "aria-label": "Close modal", children: _jsx(X, { className: "w-6 h-6 text-white" }) })] }) }), _jsx("div", { className: "overflow-y-auto flex-grow", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800", children: job.jobName }), _jsx("div", { className: `px-4 py-2 rounded-full text-sm font-medium ${job.jobStatus === "Start"
                                                    ? "bg-green-100 text-green-700"
                                                    : job.jobStatus === "Ongoing"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-700"}`, children: job.jobStatus })] }), _jsxs("div", { className: "flex items-center text-gray-500", children: [_jsx(Clock, { className: "w-4 h-4 mr-1" }), _jsxs("span", { children: ["Posted ", formatDate(job.createdAt)] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-sm border border-green-200 p-4 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-green-200 p-2 rounded-lg mr-3", children: _jsx(DollarSign, { className: "w-6 h-6 text-green-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-green-600", children: "Salary" }), _jsxs("p", { className: "text-xl font-semibold text-gray-900", children: ["$", job.jobSalary.toString()] })] })] }) }), _jsx("div", { className: "bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl shadow-sm border border-purple-200 p-4 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-purple-200 p-2 rounded-lg mr-3", children: _jsx(Users, { className: "w-6 h-6 text-purple-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-purple-600", children: "Available Slots" }), _jsx("p", { className: "text-xl font-semibold text-gray-900", children: Number(job.jobSlots) })] })] }) })] }), _jsxs("div", { className: "mb-8 bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-100", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Tag, { className: "w-5 h-5 text-pink-500 mr-2" }), _jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Job Category" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: job.jobTags?.map((tag, index) => {
                                            const colorStyle = getCategoryColor(tag.jobCategoryName);
                                            return (_jsx("span", { className: `px-4 py-2 ${colorStyle.bg} ${colorStyle.text} text-sm rounded-full font-medium hover:shadow-sm transition-all`, children: tag.jobCategoryName }, index));
                                        }) })] }), _jsxs("div", { className: "bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-sm border border-amber-100 p-6 mb-8", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Calendar, { className: "w-5 h-5 text-amber-500 mr-2" }), _jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Job Description" })] }), _jsx("div", { className: "prose max-w-none text-gray-700", children: job.jobDescription.length != 0 ? (_jsx("p", { className: "whitespace-pre-wrap", children: job.jobDescription })) : (_jsx("p", { className: "italic text-gray-500", children: "No description provided" })) })] })] }) }), _jsx("div", { className: "sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-blue-100 p-4 flex justify-end gap-3", children: _jsx("button", { onClick: onClose, className: "px-5 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-lg transition-colors font-medium border border-gray-200", children: "Close" }) })] }) }));
}
