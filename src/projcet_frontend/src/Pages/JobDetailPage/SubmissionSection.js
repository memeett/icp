import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiDownload, FiX } from "react-icons/fi";
import { getJobDetail } from "../../controller/jobController";
import { getSubmissionByJobId, updateSubmissionStatus, } from "../../controller/submissionController";
import { createInbox } from "../../controller/inboxController";
export default function ManageJobDetailPage({ jobId }) {
    const [job, setJob] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectMessage, setRejectMessage] = useState("");
    // State untuk modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    useEffect(() => {
        const fetchData = async (jobId) => {
            try {
                const job = await getJobDetail(jobId);
                const submissions = await getSubmissionByJobId(jobId);
                setSubmissions(submissions);
                setJob(job);
            }
            catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        };
        jobId && fetchData(jobId);
    }, [jobId]);
    // Handle scroll dan overlay
    useEffect(() => {
        if (showDetailModal || showRejectModal) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
        else {
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
        }
    }, [showDetailModal, showRejectModal]);
    const handleAccept = async (submission) => {
        try {
            await updateSubmissionStatus(submission.id, "Accepted", "");
            setSubmissions(submissions.map(sub => sub.id === submission.id ? { ...sub, status: "Accepted" } : sub));
            job && await createInbox(submission.user.id, job.id, job.userId, "submission", "accepted");
            window.location.reload();
        }
        catch (error) {
            console.error("Error accepting application:", error);
        }
    };
    const handleRejectClick = (submission, e) => {
        e.stopPropagation();
        setSelectedApplication(submission);
        setShowRejectModal(true);
    };
    const confirmReject = async () => {
        if (!selectedApplication)
            return;
        try {
            await updateSubmissionStatus(selectedApplication.id, "Rejected", rejectMessage);
            setSubmissions(submissions.map(sub => sub.id === selectedApplication.id ? { ...sub, status: "Rejected" } : sub));
            job && await createInbox(selectedApplication.id, job.id, job.userId, "submission", "rejected");
            setShowRejectModal(false);
        }
        catch (error) {
            console.error("Error rejecting application:", error);
        }
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50", children: [showDetailModal && selectedSubmission && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40", children: _jsxs("div", { className: "max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-xl", children: [_jsxs("div", { className: "space-y-6 px-8 pt-8 pb-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-3xl font-bold text-gray-800", children: "Submission Details" }), _jsxs("p", { className: "mt-2 text-gray-600", children: ["Applicant: ", selectedSubmission.user.username] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "text-center", children: _jsx("span", { className: `px-4 py-2 text-sm font-semibold rounded-full ${selectedSubmission.submissionStatus.toLowerCase() === "accepted"
                                                    ? "bg-green-100 text-green-800"
                                                    : selectedSubmission.submissionStatus.toLowerCase() === "rejected"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"}`, children: selectedSubmission.submissionStatus }) }), selectedSubmission.submissionMessage && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Message" }), _jsx("p", { className: "text-gray-600 whitespace-pre-wrap", children: selectedSubmission.submissionMessage })] })), selectedSubmission.submissionFile && (_jsx(motion.div, { whileHover: { scale: 1.02 }, className: "flex justify-center", children: _jsxs("a", { href: URL.createObjectURL(new Blob([new Uint8Array(selectedSubmission.submissionFile)])), download: `submission-${selectedSubmission.id}.zip`, className: "w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all", children: [_jsx(FiDownload, { className: "w-5 h-5" }), "Download Submission"] }) }))] })] }), _jsx("div", { className: "border-t py-4 flex justify-center", children: _jsx("button", { onClick: () => setShowDetailModal(false), className: "text-red-600 hover:text-red-800 font-medium", children: "Close Details" }) })] }) })), showRejectModal && selectedApplication && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50", children: _jsxs("div", { className: "max-w-md w-full mx-4 bg-white rounded-xl shadow-lg p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "Reject Application" }), _jsx("textarea", { className: "w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500", rows: 4, placeholder: "Reason for rejection...", value: rejectMessage, onChange: (e) => setRejectMessage(e.target.value) }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: () => setShowRejectModal(false), className: "px-4 py-2 text-gray-600 hover:text-gray-800", children: "Cancel" }), _jsx("button", { onClick: confirmReject, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors", children: "Confirm Reject" })] })] }) })), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "container mx-auto px-4 py-8 flex-1", children: loading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" }) })) : (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8", children: "Job Submissions" }), _jsx("div", { className: "bg-white rounded-xl shadow-lg overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-sm font-medium text-gray-500", children: "Applicant" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-medium text-gray-500", children: "Username" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-medium text-gray-500", children: "Status" }), job?.jobStatus !== "Finished" && (_jsx("th", { className: "px-6 py-4 text-left text-sm font-medium text-gray-500", children: "Actions" }))] }) }), _jsx("tbody", { children: submissions.length === 0 ? (
                                        // Display this row if there are no submissions
                                        _jsx("tr", { children: _jsx("td", { colSpan: job?.jobStatus === "Finished" ? 3 : 4, className: "px-6 py-4 text-center text-gray-500", children: "No submissions have been made." }) })) : (
                                        // Display submissions if they exist
                                        submissions.map((application) => (_jsxs("tr", { onClick: () => {
                                                setSelectedSubmission(application);
                                                setShowDetailModal(true);
                                            }, className: "hover:bg-gray-50 cursor-pointer transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gray-200 overflow-hidden", children: application.user.profilePicture && (_jsx("img", { src: URL.createObjectURL(new Blob([new Uint8Array(application.user.profilePicture)])), alt: "Profile", className: "w-full h-full object-cover" })) }), _jsx("span", { className: "font-medium text-gray-900", children: application.user.username })] }) }), _jsx("td", { className: "px-6 py-4 text-gray-600", children: application.user.username }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${application.submissionStatus.toLowerCase() === "accepted"
                                                            ? "bg-green-100 text-green-800"
                                                            : application.submissionStatus.toLowerCase() === "rejected"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"}`, children: application.submissionStatus }) }), job?.jobStatus !== "Finished" && (_jsx("td", { className: "px-6 py-4", children: application.submissionStatus.toLowerCase() === "waiting" && (_jsxs("div", { className: "flex gap-2", onClick: (e) => e.stopPropagation(), children: [_jsx("button", { onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    handleAccept(application);
                                                                }, className: "text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50", children: _jsx(FiCheck, { className: "w-5 h-5" }) }), _jsx("button", { onClick: (e) => handleRejectClick(application, e), className: "text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50", children: _jsx(FiX, { className: "w-5 h-5" }) })] })) }))] }, application.id)))) })] }) })] })) })] }));
}
