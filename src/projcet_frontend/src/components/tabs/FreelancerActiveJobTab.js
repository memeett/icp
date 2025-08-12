import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getActiveTransactionByFreelancer } from "../../controller/freelancerController";
import FreelancerJobCard from "./FreelancerJobCard";
export default function FreelancerActiveJobTab() {
    const [activeJob, setActiveJob] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        setLoading(true);
        const userData = localStorage.getItem("current_user");
        if (!userData) {
            console.error("No user data found in localStorage");
            setLoading(false);
            return;
        }
        try {
            const parsedData = JSON.parse(userData);
            const freelancerId = parsedData.ok?.id;
            if (!freelancerId) {
                console.error("Freelancer ID not found in user data");
                setLoading(false);
                return;
            }
            const result = await getActiveTransactionByFreelancer(freelancerId);
            if (result) {
                setActiveJob(result);
            }
            else {
                setActiveJob([]);
            }
        }
        catch (error) {
            console.error("Failed to fetch transactions:", error);
            setActiveJob([]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center py-16", children: _jsx("div", { className: "w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" }) }));
    }
    return (_jsx("div", { className: "w-full", children: activeJob.length === 0 ? (_jsxs("div", { className: "text-center py-16 px-4", children: [_jsx("div", { className: "p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full inline-block mb-4", children: _jsx("svg", { className: "h-16 w-16 text-purple-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }) }) }), _jsx("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: "No Active Jobs" }), _jsx("p", { className: "text-gray-500", children: "You don't have any active jobs at the moment." }), _jsx("button", { onClick: () => fetchData(), className: "mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300", children: "Refresh" })] })) : (_jsx("div", { className: "", children: activeJob.map((job, index) => (_jsx(FreelancerJobCard, { jobId: job.jobId, isLoading: () => setLoading(false) }, job.jobId + index))) })) }));
}
