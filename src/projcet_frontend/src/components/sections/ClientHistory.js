import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getUserJobByStatusFinished } from "../../controller/jobController";
import ClientHistoryCard from "../cards/ClientHistoryCard";
export default function ProfileClientHistory() {
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = localStorage.getItem("current_user");
    const userData = user ? JSON.parse(user).ok : null;
    const clientId = userData ? userData.id : "";
    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            const jobs = await getUserJobByStatusFinished(clientId);
            if (jobs == null) {
                setJobsData([]);
            }
            else {
                setJobsData(jobs);
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load client history");
        }
        finally {
            setLoading(false);
        }
    }, [clientId]);
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);
    return (_jsx("div", { className: "w-full bg-gradient-to-r", children: _jsx("div", { className: "max-w-5xl mx-auto px-4", children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100", children: [_jsxs("div", { className: "relative overflow-hidden h-32 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100", children: [_jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cGF0aCBkPSJNMjAgMCBMMjAgNDAgTDAgMjAgTDQwIDIwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')] opacity-30" }), _jsx("div", { className: "absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t" }), _jsx("div", { className: "relative p-6 flex items-end h-full", children: _jsx("h1", { className: "text-3xl font-bold text-purple-700 drop-shadow-md", children: "Client History" }) })] }), _jsx("div", { className: "p-6", children: loading ? (_jsx("div", { className: "flex justify-center items-center py-16", children: _jsx("div", { className: "w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" }) })) : error ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-red-500 mb-2", children: error }), _jsx("button", { onClick: () => fetchAllData(), className: "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300", children: "Try Again" })] })) : jobsData.length > 0 ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("p", { className: "text-gray-600", children: ["You have ", jobsData.length, " job", jobsData.length !== 1 ? "s" : "", " in your history"] }), _jsx("div", { className: "flex space-x-2", children: _jsx("button", { onClick: () => fetchAllData(), className: "p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }) }) })] }), jobsData.map((data) => (_jsx(ClientHistoryCard, { job: data })))] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full inline-block mb-4", children: _jsx("svg", { className: "h-16 w-16 text-purple-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }), _jsx("p", { className: "mt-4 text-lg text-gray-600", children: "No client history found" }), _jsx("p", { className: "text-gray-500", children: "Your job history as a client will appear here." }), _jsx("button", { onClick: () => fetchAllData(), className: "mt-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300", children: "Refresh" })] })) })] }) }) }));
}
