import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getJobById } from "../../controller/jobController";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
export default function FreelancerJobCard({ jobId, isLoading }) {
    const [job, setJob] = useState(null);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const nav = useNavigate();
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await getJobById(jobId);
                if (res) {
                    setJob(res);
                    setDate(formatDate(res.createdAt));
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
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all", children: [_jsx("h3", { className: "font-semibold text-lg text-gray-800", children: job?.jobName }), _jsxs("div", { className: "mt-2 text-sm text-gray-600", children: [_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Created At:" }), " ", date] }), _jsxs("div", { className: "mt-3 flex items-center", children: [_jsx("span", { className: "font-medium mr-2", children: "Status:" }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${job?.jobStatus === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : job?.jobStatus === "In Progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"}`, children: job?.jobStatus })] })] }), _jsx("div", { className: "mt-4", children: _jsx("button", { className: "text-sm text-purple-600 hover:text-purple-800 font-medium", onClick: viewDetail, children: "View Details" }) })] }));
}
