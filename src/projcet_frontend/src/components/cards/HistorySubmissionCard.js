import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFileSubmissionbyId } from '../../controller/submissionController';
export default function HistorySubmissionCard({ submission }) {
    const [fileBlob, setFileBlob] = useState(null);
    useEffect(() => {
        getFileSubmissionbyId(submission.id).then((res) => {
            console.log(res);
            setFileBlob(res);
        });
    }, [submission.id]);
    const handleDownload = () => {
        console.log(fileBlob);
        if (fileBlob) {
            const url = window.URL.createObjectURL(fileBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `submission_${submission.id}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
        else {
            alert('File not available for download.');
        }
    };
    const getStatusStyles = () => {
        switch (submission.submissionStatus) {
            case "Accepted":
                return "bg-green-100 text-green-800 border-green-200";
            case "Rejected":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };
    return (_jsxs(motion.div, { className: "w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100 p-6 mb-4 overflow-hidden", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h3", { className: "text-xl font-bold text-indigo-800", children: ["Submission #", Number(submission.id) + 1] }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyles()}`, children: submission.submissionStatus })] }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsx("div", { className: "flex items-center", children: _jsx("p", { className: "text-gray-700 truncate", children: submission.submissionMessage }) }), _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "text-indigo-600 font-medium mr-2", children: "File:" }), _jsxs("p", { className: "text-gray-700", children: ["submission_", submission.id, ".bin"] })] })] }), _jsxs("button", { onClick: handleDownload, className: "w-full flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200 space-x-2", children: [_jsx(Download, { className: "w-5 h-5" }), _jsx("span", { children: "Download File" })] })] }));
}
