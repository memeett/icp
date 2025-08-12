import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRatingByUserIdJobId } from "../../controller/ratingController";
import { Star } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
export default function FreelancerJobHistoryCard({ jobId, isLoading }) {
    const [job, setJob] = useState(null);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const nav = useNavigate();
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const userData = localStorage.getItem("current_user");
                if (!userData) {
                    console.error("No user data found in localStorage");
                    setLoading(false);
                    return;
                }
                const parsedData = JSON.parse(userData);
                const freelancerId = parsedData.ok?.id;
                const res = await getRatingByUserIdJobId(jobId, freelancerId);
                if (typeof res !== "string") {
                    setJob(res.job);
                    setDate(formatDate(res.job.createdAt));
                    setRating(res.rating);
                    setIsEdit(res.isEdit);
                    console.log(res.isEdit);
                }
                else {
                    setError("Job not found");
                }
            }
            catch (err) {
                console.error("Failed to fetch job:", err);
                setError("Failed to load job details");
            }
            finally {
                isLoading();
            }
        };
        fetchJob();
    }, [jobId]);
    const viewDetail = () => {
        nav("/jobs/" + jobId);
    };
    // Function to render star rating
    const renderStars = (rating) => {
        const totalStars = 5; // Total number of stars to display
        const stars = [];
        if (rating) {
            // Round down the rating
            const roundedRating = Math.floor(rating);
            // Add filled stars based on the rounded down rating
            for (let i = 0; i < roundedRating; i++) {
                stars.push(_jsx(Star, { className: "fill-yellow-400 text-yellow-400 w-4 h-4" }, `filled-${i}`));
            }
            // Add empty stars for the remaining slots
            for (let i = roundedRating; i < totalStars; i++) {
                stars.push(_jsx(Star, { className: "text-gray-300 w-4 h-4" }, `empty-${i}`));
            }
            return (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex mr-2", children: stars }), _jsxs("span", { className: "text-sm text-gray-600", children: ["(", rating.toFixed(1), ")"] })] }));
        }
        else {
            // Show all empty stars if no rating
            for (let i = 0; i < totalStars; i++) {
                stars.push(_jsx(Star, { className: "text-gray-300 w-4 h-4" }, `empty-${i}`));
            }
            return (_jsx(_Fragment, { children: !isEdit ? (_jsx("div", { className: "flex items-center", children: _jsx("span", { className: "text-sm text-gray-600", children: "Has not been updated" }) })) : (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex mr-2", children: stars }), _jsx("span", { className: "text-sm text-gray-600", children: "(No rating)" })] })) }));
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all", children: [_jsx("h3", { className: "font-semibold text-lg text-gray-800", children: job?.jobName }), _jsxs("div", { className: "mt-2 text-sm text-gray-600", children: [_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Created At:" }), " ", date] }), _jsxs("div", { className: "mt-3 flex items-center", children: [_jsx("span", { className: "font-medium mr-2", children: "Status:" }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${job?.jobStatus === "Finished"
                                    ? "bg-green-100 text-green-800"
                                    : job?.jobStatus === "In Progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"}`, children: job?.jobStatus })] }), _jsxs("div", { className: "mt-3", children: [_jsx("span", { className: "font-medium mr-2", children: "Rating:" }), renderStars(rating)] })] }), _jsx("div", { className: "mt-4", children: _jsx("button", { className: "text-sm text-purple-600 hover:text-purple-800 font-medium", onClick: viewDetail, children: "View Details" }) })] }));
}
