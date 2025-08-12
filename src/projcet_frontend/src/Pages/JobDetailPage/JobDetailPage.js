import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { finishJob, getAcceptedFreelancer, getJobApplier, getJobById, startJob, } from "../../controller/jobController";
import { authUtils } from "../../utils/authUtils";
import { acceptApplier, applyJob, hasUserApplied, rejectApplier, } from "../../controller/applyController";
import OngoingSection from "../../components/sections/OngoingSection";
import { JobDetailContent } from "./JobDetailContent";
import { ApplicantActions } from "./ApplicationActions";
import { OwnerActions } from "./OwnerActions";
import { ApplicantsModal } from "./ApplicationModal";
import ManageJobDetailPage from "./SubmissionSection";
import Modal from "./startModal";
import { createInbox } from "../../controller/inboxController";
import { ModalProvider } from "../../contexts/modal-context";
import FinishJobModal from "./JobWarningModal";
import { useBoolean } from "../../components/context/Context";
import { getFreelancerForRating } from "../../controller/ratingController";
import RatingSection from "./RatingSection";
import { formatDate } from "../../utils/dateUtils";
const AcceptedUsersModal = ({ users, onClose }) => {
    return (_jsx(motion.div, { className: "fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsxs(motion.div, { className: "bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full", initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-indigo-800", children: "Accepted Users" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-800 transition-colors", children: _jsx(XCircle, { size: 24 }) })] }), _jsx("div", { className: "space-y-4", children: users.map((user) => (_jsxs(motion.div, { className: "flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl", whileHover: { scale: 1.02 }, children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold", children: user.username.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-indigo-800", children: user?.username }), _jsx("p", { className: "text-sm text-gray-600", children: formatDate(user?.createdAt) })] })] }, user.id))) })] }) }));
};
export default function JobDetailPage() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applied, setApplied] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [showAcceptedUsersModal, setShowAcceptedUsersModal] = useState(false);
    const { current_user } = authUtils();
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [responsibilityAccepted, setResponsibilityAccepted] = useState(false);
    const [appliers, setAppliers] = useState([]);
    const [showApplicantsModal, setShowApplicantsModal] = useState(false);
    const [acceptedAppliers, setAccAppliers] = useState([]);
    const currentApplicants = BigInt(acceptedAppliers.length);
    const maxApplicants = BigInt(Number(job?.jobSlots || 0));
    const isApplicationClosed = currentApplicants >= maxApplicants;
    // ka
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requiredAmount, setRequiredAmount] = useState(0);
    const [applicationLoading, setApplicationLoading] = useState(false);
    const [showFinishJobModal, setShowFinishJobModal] = useState(false);
    const handleClose = () => {
        setIsModalOpen(false); // Close the modal
    };
    const { setIsActive } = useBoolean();
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userData = localStorage.getItem("current_user");
                const parsedData = userData ? JSON.parse(userData) : null;
                if (!parsedData || !parsedData.ok) {
                    setLoading(false);
                    return;
                }
                const userId = parsedData.ok.id;
                if (job && job.userId === userId) {
                    setIsOwner(true);
                }
                if (jobId) {
                    const [acceptedFreelancers, jobAppliers] = await Promise.all([
                        getAcceptedFreelancer(jobId),
                        getJobApplier(jobId),
                    ]);
                    setAccAppliers(acceptedFreelancers);
                    setAppliers(jobAppliers);
                    const hasApplied = await hasUserApplied(userId, jobId);
                    const isUserAcceptedOrApplied = await acceptedFreelancers.some((user) => user.id === userId) || hasApplied;
                    if (isUserAcceptedOrApplied) {
                        setApplied(true);
                        setIsActive(true);
                    }
                }
            }
            catch (error) {
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [job, jobId]);
    useEffect(() => {
        setIsActive(true);
    }, [applied]);
    const fetchJob = useCallback(async () => {
        if (!jobId) {
            setError("Job ID is missing");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const jobData = await getJobById(jobId);
            if (jobData) {
                setJob(jobData);
            }
            else {
                setError("Job not found");
            }
        }
        catch (err) {
            setError("Failed to load job details");
        }
        finally {
            setError("");
            setLoading(false);
        }
    }, [jobId]);
    useEffect(() => {
        fetchJob();
    }, [fetchJob]);
    const [userR, setUserR] = useState([]);
    const getUserRating = async () => {
        if (jobId) {
            const ratings = await getFreelancerForRating(jobId);
            setUserR(ratings);
        }
    };
    useEffect(() => {
        getUserRating();
    }, [jobId]);
    const handleFinishRating = () => {
        setUserR([]); // Reset ratings setelah selesai
    };
    const jobDetails = useMemo(() => {
        if (!job)
            return null;
        return {
            salary: job.jobSalary.toLocaleString(),
            rating: job.jobRating.toFixed(1),
            postedDate: formatDate(job.createdAt),
        };
    }, [job]);
    // handle apply button click
    const handleApply = useCallback(async () => {
        setLoading(true);
        const userData = localStorage.getItem("current_user");
        if (!userData) {
            setLoading(false);
            return;
        }
        try {
            const parsedData = JSON.parse(userData);
            const result = await applyJob(parsedData.ok.id, jobId);
            console.log(job);
            const inbox = await createInbox(job.userId, jobId, parsedData.ok.id, "application", "request");
            if (!inbox) {
                console.error("Failed to create inbox message");
            }
            console.log("Inbox message created:", inbox);
            if (result) {
                setApplied(true);
            }
            else {
            }
        }
        catch (err) {
        }
        finally {
            setLoading(false);
        }
        window.location.reload();
    }, [jobId]);
    //   if (loading) {
    //     return (
    //       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    //         <motion.div
    //           className="w-16 h-16 border-4 border-transparent border-b-indigo-500 rounded-full"
    //           animate={{ rotate: 360 }}
    //           transition={{
    //             duration: 1,
    //             repeat: Infinity,
    //             ease: "linear",
    //           }}
    //         />
    //       </div>
    //     );
    //   }
    const handleAccept = async (userid) => {
        setApplicationLoading(true);
        if (jobId) {
            const result = await acceptApplier(userid, jobId);
            if (result) {
                await createInbox(userid, jobId, job.userId, "application", "accepted");
            }
            getJobApplier(jobId).then((users) => {
                setAppliers(users);
            });
            getAcceptedFreelancer(jobId).then((users) => {
                setAccAppliers(users);
            });
        }
        setApplicationLoading(false);
    };
    useEffect(() => {
        const fetchAcceptedFreelancers = async () => {
            setApplicationLoading(true);
            if (jobId) {
                const users = await getAcceptedFreelancer(jobId);
                setAccAppliers(users);
                getJobApplier(jobId).then((users) => {
                    setAppliers(users);
                });
            }
            setApplicationLoading(false);
        };
        fetchAcceptedFreelancers();
    }, [jobId]);
    const handleReject = async (userid) => {
        setApplicationLoading(true);
        if (jobId) {
            const result = await rejectApplier(userid, jobId);
            if (result) {
                await createInbox(userid, jobId, job.userId, "application", "rejected");
            }
            getJobApplier(jobId).then((users) => {
                setAppliers(users);
            });
            getAcceptedFreelancer(jobId).then((users) => {
                setAccAppliers(users);
            });
        }
        setApplicationLoading(false);
    };
    const handleStart = () => {
        // Start the job
        setIsModalOpen(true);
        const length = acceptedAppliers.length;
        const amount = Number.parseFloat(jobDetails.salary) * length;
        setRequiredAmount(amount);
    };
    if (!job)
        return null;
    const handlePay = async () => {
        setLoading(true);
        // Close the modal first
        setIsModalOpen(false);
        if (!jobId) {
            return;
        }
        // Retrieve user data from local storage
        const userData = localStorage.getItem("current_user");
        if (!userData) {
            return;
        }
        const parsedData = JSON.parse(userData);
        if (!jobDetails) {
            return;
        }
        // Calculate the required amount: job salary * number of accepted appliers
        const numAppliers = acceptedAppliers.length;
        const salary = Number.parseFloat(jobDetails.salary);
        const amount = salary * numAppliers;
        // Call the startJob function and handle the result
        const result = await startJob(parsedData.ok.id, jobId, amount);
        if (result.jobStarted) {
            fetchJob();
            // Optionally, show a success toast/notification here
        }
        else {
            console.log("cek");
            setError(result.message);
        }
        setLoading(false);
    };
    const handleFinish = async () => {
        setShowFinishJobModal(true);
        setLoading(true);
        if (jobId) {
            const result = await finishJob(jobId);
            if (result.jobFinished) {
                fetchJob();
                setShowFinishJobModal(false);
            }
            else {
                setError(result.message);
            }
        }
        fetchJob();
        setShowFinishJobModal(false);
        setLoading(false);
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50", children: [_jsx(Navbar, {}), showFinishJobModal && (_jsx(FinishJobModal, { isOpen: showFinishJobModal, onClose: () => setShowFinishJobModal(false), onConfirm: handleFinish, isLoading: loading })), showAcceptedUsersModal && (_jsx(AcceptedUsersModal, { users: acceptedAppliers, onClose: () => setShowAcceptedUsersModal(false) })), showApplicantsModal && (_jsx(ApplicantsModal, { appliers: appliers, onClose: () => setShowApplicantsModal(false), handleAccept: handleAccept, handleReject: handleReject, isLoading: applicationLoading })), _jsx(Modal, { isOpen: isModalOpen, onClose: handleClose, onPay: handlePay, amount: requiredAmount }), _jsxs(motion.div, { className: "container mx-auto px-4 mt-6 flex-grow", children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 ", children: "Job Detail" }), _jsxs("div", { className: "max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8", children: [_jsx(JobDetailContent, { onOpen: () => setShowAcceptedUsersModal(true), job: job, currentApplicants: currentApplicants, maxApplicants: maxApplicants, acceptedAppliers: acceptedAppliers }), _jsx("div", { className: "bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 h-fit sticky top-6", children: isOwner ? (_jsx(OwnerActions, { job: job, appliersCount: appliers.length, onViewApplicants: () => setShowApplicantsModal(true), onStartJob: handleStart, onFinishJob: handleFinish })) : (_jsx(ApplicantActions, { salary: jobDetails?.salary || "", termsAccepted: termsAccepted, responsibilityAccepted: responsibilityAccepted, isApplicationClosed: isApplicationClosed, remainingPositions: (maxApplicants - currentApplicants).toString(), applied: applied, onApply: handleApply, onTermsChange: setTermsAccepted, onResponsibilityChange: setResponsibilityAccepted, jobStatus: job.jobStatus })) })] }), (job.jobStatus === "Ongoing") && !isOwner && applied && (_jsx(OngoingSection, { job: job })), isOwner && job.jobStatus === "Finished" && (_jsx(RatingSection, { ratings: userR, onFinish: handleFinishRating })), isOwner && job.jobStatus === "Ongoing" && (_jsx(ModalProvider, { children: _jsx(ManageJobDetailPage, { jobId: job.id }) }))] }), _jsx(Footer, {})] }));
}
