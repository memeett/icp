import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Edit, Trash2, Plus, Filter, Briefcase, CheckCircle, } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getUserJobs, deleteJob } from "../../controller/jobController";
import { useModal } from "../../contexts/modal-context";
import { fetchUserBySession } from "../../controller/userController";
import EditJobForm from "../../components/modals/EditJobModal";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "../../components/ui/loading-animation";
export default function ManageJobPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [jobStatus] = useState([
        "Start",
        "Ongoing",
        "Finished",
        "All",
    ]);
    const [selectedStatus, setSelectedStatus] = useState("Start");
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { openModal, closeModal, setOpen } = useModal();
    const navigate = useNavigate();
    const handleEditJob = (job) => {
        setSelectedJob(job);
        setOpen(true);
        const modalIndex = openModal();
    };
    const handleCloseModal = () => {
        setOpen(false);
        closeModal(0);
        setSelectedJob(null);
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            const jobs = await getUserJobs(currentUser?.id || "");
            if (jobs) {
                const convertedJobs = jobs.map((job) => ({
                    ...job,
                    createdAt: BigInt(job.createdAt),
                    updatedAt: BigInt(job.updatedAt),
                }));
                setMyJobs(convertedJobs);
            }
        }
        catch (err) {
            console.error("Error fetching jobs:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchUser = async () => {
            const user = await fetchUserBySession();
            if (user)
                setCurrentUser(user);
        };
        fetchUser();
    }, []);
    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser, refreshKey]);
    const handleRowClick = (jobId, e) => {
        const actionsCell = e.target.closest("td:last-child");
        if (!actionsCell) {
            navigate(`/jobs/${jobId}`);
        }
    };
    const handleEditClick = (e, job) => {
        e.stopPropagation();
        setSelectedJob(job);
        setOpen(true);
        const modalIndex = openModal();
    };
    const handleSaveJob = (updatedJob) => {
        const updatedJobs = myJobs.map((job) => job.id === updatedJob.id ? updatedJob : job);
        setMyJobs(updatedJobs);
    };
    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await deleteJob(jobId);
                setRefreshKey((prev) => prev + 1);
            }
            catch (err) {
                console.error("Error deleting job:", err);
            }
        }
    };
    const filteredJobs = myJobs?.filter((job) => {
        const matchesSearch = job.jobName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "All" || job.jobStatus === selectedStatus;
        return matchesSearch && matchesStatus;
    });
    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case "Start":
                return "bg-green-100 text-green-800 border-green-200";
            case "Ongoing":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Finished":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "All":
                return "bg-purple-100 text-purple-800 border-purple-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white", children: [loading && _jsx(LoadingOverlay, {}), _jsx(Navbar, {}), _jsxs("div", { className: "flex-grow container mx-auto px-4 py-8 max-w-6xl", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center justify-between mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Manage Your Jobs" }), _jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Link, { to: "/post", className: "bg-purple-600 text-white px-6 py-3 rounded-xl \n                flex items-center gap-2 transition shadow-md hover:bg-purple-700", children: [_jsx(Plus, { size: 20 }), " Create New Job"] }) })] }), _jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "relative mb-8", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex-grow relative", children: [_jsx("input", { type: "text", placeholder: "Search your jobs...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-12 pr-10 py-3 rounded-xl \n                  bg-white/70 backdrop-blur-sm \n                  border border-purple-100/50 \n                  focus:ring-2 focus:ring-purple-300 \n                  transition duration-300 \n                  text-gray-700 placeholder-gray-400\n                  shadow-sm" }), _jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 \n                  text-purple-400" }), searchQuery && (_jsx(X, { onClick: () => setSearchQuery(""), className: "absolute right-4 top-1/2 -translate-y-1/2 \n                    text-gray-400 cursor-pointer \n                    hover:text-purple-500 transition" }))] }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setIsFilterOpen(!isFilterOpen), className: `p-3 rounded-xl transition shadow-sm ${isFilterOpen
                                        ? "bg-purple-200 text-purple-700"
                                        : "bg-purple-100 text-purple-600 hover:bg-purple-200"}`, children: _jsx(Filter, {}) })] }) }), _jsx(AnimatePresence, { children: isFilterOpen && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "mb-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm overflow-hidden", children: [_jsxs("h3", { className: "text-xl font-semibold text-gray-700 mb-4 flex items-center", children: [_jsx("span", { className: "bg-purple-100 text-purple-600 p-2 rounded-lg mr-3", children: _jsx(Filter, { size: 16 }) }), "Filter by Status"] }), _jsx("div", { className: "flex flex-wrap gap-3", children: jobStatus.map((status) => (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setSelectedStatus(status), className: `px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-200 ${selectedStatus === status
                                            ? `${getStatusColor(status)} font-medium`
                                            : "bg-white/50 text-gray-600 border-gray-200 hover:border-purple-200"}`, children: [selectedStatus === status && _jsx(CheckCircle, { size: 16 }), status] }, status))) })] })) }), _jsxs("section", { className: "bg-white/50 rounded-xl shadow-sm p-6 mb-8", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-6 flex items-center", children: [_jsx("span", { className: "bg-purple-100 text-purple-600 p-2 rounded-lg mr-3", children: _jsx(Briefcase, { size: 20 }) }), "Your Jobs"] }), _jsx(AnimatePresence, { children: filteredJobs && filteredJobs.length > 0 ? (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-600", children: "Job Title" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-600", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-600", children: "Salary" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-600", children: "Slots" }), _jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-600", children: "Actions" })] }) }), _jsx("tbody", { children: filteredJobs.map((job) => (_jsxs(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "border-b border-gray-100 hover:bg-white/50 transition-colors duration-200 cursor-pointer", onClick: (e) => handleRowClick(job.id, e), children: [_jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: job.jobName }), _jsx("div", { className: "text-sm text-gray-500", children: job.jobTags
                                                                            .map((tag) => tag.jobCategoryName)
                                                                            .join(", ") })] }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${job.jobStatus === "Start"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : job.jobStatus === "Ongoing"
                                                                            ? "bg-yellow-100 text-yellow-800"
                                                                            : "bg-blue-100 text-blue-800"}`, children: job.jobStatus }) }), _jsxs("td", { className: "px-6 py-4 text-sm text-gray-700", children: ["$", job.jobSalary.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-700", children: job.jobSlots.toString() }), _jsx("td", { className: "px-6 py-4", children: job.jobStatus === "Start" && (_jsxs("div", { className: "flex space-x-3", children: [_jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: (e) => handleEditClick(e, job), className: "text-purple-500 hover:text-purple-700 transition-colors", children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: () => handleDeleteJob(job.id), className: "text-red-500 hover:text-red-700 transition-colors", children: _jsx(Trash2, { className: "h-5 w-5" }) })] })) })] }, job.id))) })] }) }) })) : (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-center py-12 bg-white/70 rounded-xl", children: [_jsx("p", { className: "text-gray-500 mb-6", children: "You haven't created any jobs yet" }), _jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Link, { to: "/post", className: "inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl transition shadow-md hover:bg-purple-700", children: [_jsx(Plus, { size: 20 }), " Create Your First Job"] }) })] })) })] })] }), _jsx(Footer, {}), _jsx(EditJobForm, { job: selectedJob || null, onSave: handleSaveJob, onCancel: handleCloseModal })] }));
}
