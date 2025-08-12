import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { formatDate } from "../../utils/dateUtils";
import { formatCurrency } from "../../utils/currecncyUtils";
import { addIncrementUserClicked } from "../../controller/userClickedController";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
export default function ClientHistoryCard({ job }) {
    const nav = useNavigate();
    const viewDetails = useCallback(() => {
        addIncrementUserClicked(job.id);
        nav("/jobs/" + job.id);
    }, [nav, job.id]);
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-800", children: job.jobName }), _jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: job.jobTags.map((tag) => (_jsx("span", { className: "px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full", children: tag.jobCategoryName }, tag.id))) })] }), _jsxs("div", { className: "flex flex-col items-end", children: [_jsx("span", { className: `px-3 py-1 text-sm font-medium rounded-full ${job.jobStatus === "Finished"
                                        ? "bg-green-100 text-green-800"
                                        : job.jobStatus === "Ongoing"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"}`, children: job.jobStatus }), _jsxs("span", { className: "text-gray-500 text-sm mt-2", children: ["Created on ", formatDate(job.createdAt)] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4", children: [_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Salary" }), _jsx("p", { className: "font-bold text-gray-900", children: formatCurrency(job.jobSalary) })] }), _jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Slots" }), _jsx("p", { className: "font-bold text-gray-900", children: job.jobSlots.toString() })] }), _jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Wallet" }), _jsx("p", { className: "font-bold text-gray-900", children: formatCurrency(job.wallet) })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: viewDetails, className: "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300", children: "View Details" }) })] }) }));
}
;
