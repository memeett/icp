import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import HistorySubmissionCard from "../cards/HistorySubmissionCard";
import { createSubmission, getAllSubmissionbyUserJobId } from "../../controller/submissionController";
import { createInbox } from "../../controller/inboxController";
export default function OngoingSection({ job }) {
    const [submission, setSubmission] = useState([]);
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [additionalMessage, setAdditionalMessage] = useState('');
    const fetchHistorySubmission = useCallback(async () => {
        if (!job) {
            return;
        }
        try {
            const userData = localStorage.getItem("current_user");
            const parsedData = JSON.parse(userData ? userData : "");
            getAllSubmissionbyUserJobId(parsedData.ok, job.id).then((res) => {
                console.log(res);
                setSubmission(res);
            }).catch((err) => {
                console.log(err);
            });
        }
        catch (err) {
            console.error("Error fetching submission:", err);
        }
    }, [job]);
    useEffect(() => {
        fetchHistorySubmission();
    }, [fetchHistorySubmission]);
    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
                setFile(selectedFile);
                setErrorMessage(null);
            }
            else {
                setFile(null);
                setErrorMessage('Please upload a valid ZIP file.');
            }
        }
    };
    const handleMessageChange = (event) => {
        setAdditionalMessage(event.target.value);
    };
    const makeSubmission = async () => {
        if (file == null) {
            setErrorMessage("Please submit your file!");
            return;
        }
        const fileBlob = new Blob([file], { type: file.type });
        const userData = localStorage.getItem("current_user");
        const parsedData = JSON.parse(userData ? userData : "");
        if (job) {
            try {
                await createSubmission(job.id, parsedData.ok, fileBlob, additionalMessage);
                console.log("Submission created successfully");
                await fetchHistorySubmission();
                setFile(null);
                setAdditionalMessage("");
                setErrorMessage(null);
                await createInbox(job.userId, job.id, parsedData.ok.id, "submission", "request");
            }
            catch (err) {
                console.error("Error creating submission:", err);
                setErrorMessage("Failed to create submission. Please try again.");
            }
        }
        else {
            console.log("no job id");
        }
    };
    // Determine if the right section should be displayed
    const showRightSection = job.jobStatus !== "Finished";
    return (_jsx("div", { className: "max-w-6xl mx-auto mb-5", children: _jsxs("div", { className: `${showRightSection ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : "flex justify-center"}`, children: [_jsx("div", { className: `bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 ${showRightSection ? "lg:col-span-2" : "w-full lg:w-2/3"}`, children: _jsxs("div", { className: "mb-8", children: [_jsx(motion.h1, { className: "text-3xl font-bold text-indigo-800 mb-4", initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 }, children: "History Submission" }), _jsx("div", { className: "mt-8 border-t pt-6", children: _jsx("div", { className: "flex flex-col items-center justify-between", children: submission.length === 0 ? (_jsxs(motion.div, { className: "w-full flex flex-col items-center justify-center py-16 text-center", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, children: [_jsx(Inbox, { className: "w-16 h-16 text-indigo-300 mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-indigo-800 mb-2", children: "No submissions yet" }), _jsx("p", { className: "text-gray-600 max-w-md", children: "Your submission history will appear here once you've made your first submission." })] })) : (submission.map((sub) => (_jsx(HistorySubmissionCard, { submission: sub }, sub.id)))) }) })] }) }), showRightSection && (_jsx("div", { className: "bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 h-fit sticky top-30 border border-indigo-100", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm", children: [_jsx("h3", { className: "text-3xl font-bold text-indigo-800 mb-2 tracking-tight", children: "Submit Your Task" }), _jsx("p", { className: "text-sm text-indigo-600 opacity-80", children: "Please upload your completed work as a ZIP file" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-2", children: "Additional Message" }), _jsx("textarea", { id: "message", rows: 4, onChange: handleMessageChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none", placeholder: "Add any additional notes or comments about your submission..." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-indigo-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsx("label", { htmlFor: "terms", className: "text-sm text-gray-700", children: "You must zip the files you want to submit" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative w-full", children: [_jsx("input", { type: "file", accept: ".zip", onChange: handleFileChange, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" }), _jsxs("div", { className: "flex items-center border-2 border-dashed border-indigo-200 rounded-lg p-3 hover:border-indigo-400 transition-all duration-300", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-indigo-600 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), _jsx("span", { className: "text-sm text-gray-600", children: file ? file.name : 'Select ZIP file' })] })] }), _jsx("button", { className: "bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", onClick: makeSubmission, children: "Submit" })] }), errorMessage && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg flex items-center space-x-2", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-red-500", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }), _jsx("p", { className: "text-sm", children: errorMessage })] })), file && (_jsxs("div", { className: "bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg flex items-center space-x-2", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-green-500", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }), _jsxs("p", { className: "text-sm", children: ["File selected: ", file.name] })] }))] })] }) }))] }) }));
}
