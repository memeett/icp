import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Star,
    Clock,
    MapPin,
    Users,
    CheckCircle,
    XCircle,
    Info,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getAcceptedFreelancer, getJobApplier, getJobById, startButtonClick } from "../../controller/jobController";
import { authUtils } from "../../utils/authUtils";
import { User } from "../../interface/User";
import { Job } from "../../interface/job/Job";
import { acceptApplier, applyJob, hasUserApplied, rejectApplier } from "../../controller/applyController";
import LoadingOverlay from "../../components/ui/loading-animation";
import { ApplierPayload } from "../../interface/Applier";

// Mock data for accepted users - replace with actual data fetching
const mockAcceptedUsers: User[] = [
    //   {
    //     id: "550e8400-e29b-41d4-a716-446655440000",
    //     profilePicture: new Blob(),
    //     username: "CloudExpertSarah",
    //     preference: [],
    //     dob: "1985-04-12",
    //     description:
    //       "AWS Certified Solutions Architect with 8+ years experience in cloud infrastructure design and implementation.",
    //     wallet: 24500,
    //     rating: 4.9,
    //     createdAt: BigInt(new Date("2018-03-15").getTime() * 1e6), // Convert to nanoseconds
    //     updatedAt: BigInt(new Date("2023-07-01").getTime() * 1e6),
    //     isFaceRecognitionOn: true,
    //   },
    //   {
    //     id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    //     profilePicture: new Blob(),
    //     preference: [],
    //     username: "FullStackDevMike",
    //     dob: "1992-11-30",
    //     description:
    //       "React/Node.js specialist focused on building scalable web applications with modern best practices.",
    //     wallet: 18250,
    //     rating: 4.7,
    //     createdAt: BigInt(new Date("2019-08-22").getTime() * 1e6),
    //     updatedAt: BigInt(new Date("2023-06-15").getTime() * 1e6),
    //     isFaceRecognitionOn: false,
    //   },
    //   {
    //     id: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
    //     profilePicture: new Blob(),
    //     preference: [],
    //     username: "DistributedSystemsJane",
    //     dob: "1988-07-17",
    //     description:
    //       "Microservices and Kubernetes expert with strong background in high-availability systems.",
    //     wallet: 31200,
    //     rating: 4.95,
    //     createdAt: BigInt(new Date("2017-05-10").getTime() * 1e6),
    //     updatedAt: BigInt(new Date("2023-07-10").getTime() * 1e6),
    //     isFaceRecognitionOn: true,
    //   },
];

const AcceptedUsersModal: React.FC<{
    users: User[];
    onClose: () => void;
}> = ({ users, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-indigo-800">Accepted Users</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {users.map((user) => (
                        <motion.div
                            key={user.id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-indigo-800">
                                    {user?.username}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {new Date(Number(user?.createdAt) / 1_000_000).toLocaleDateString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function JobDetailPage() {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applied, setApplied] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [showAcceptedUsersModal, setShowAcceptedUsersModal] = useState(false);
    const { current_user } = authUtils();

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [responsibilityAccepted, setResponsibilityAccepted] = useState(false);
    const currentApplicants = BigInt(mockAcceptedUsers.length);
    const maxApplicants = BigInt(Number(job?.jobSlots || 0));
    const isApplicationClosed = currentApplicants >= maxApplicants;

    const [appliers, setAppliers] = useState<ApplierPayload[]>([])
    const [showApplicantsModal, setShowApplicantsModal] = useState(false);

    const [acceptedAppliers, setAccAppliers] = useState<User[]>([])

    useEffect(() => {
        if (jobId) {
            getJobApplier(jobId).then((users) => {
                setAppliers(users);
            });
            getAcceptedFreelancer(jobId).then((users) =>{
                setAccAppliers(users)
            })
        }
    }, [jobId]);

    useEffect(() => {
        setLoading(true);
        const userData = localStorage.getItem("current_user");
        const parsedData = JSON.parse(userData ? userData : "");
        if (userData) {
            // Check if current user is the job owner
            if (job && job.userId === parsedData.ok.id) {
                setIsOwner(true);

            }
        }

        const checkApplied = async () => {
            if (!current_user) return;
            // Check if user has already applied to this job
            // const hasApplied = await checkIfUserApplied(jobId, current_user.id);
            // setApplied(hasApplied);
            const result = await hasUserApplied(parsedData.ok.id, jobId!);
            setApplied(result);
        };
        checkApplied();
        setLoading(false);
    }, [job]);

    const fetchJob = useCallback(async () => {
        if (!jobId) {
            setError("Job ID is missing");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const jobData = await getJobById(jobId);
            console.log(jobData);
            if (jobData) {
                setJob(jobData);
            } else {
                setError("Job not found");
            }
        } catch (err) {
            console.error("Error fetching job:", err);
            setError("Failed to load job details");
        } finally {
            setError("");
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        fetchJob();
    }, [fetchJob]);

    const jobDetails = useMemo(() => {
        if (!job) return null;

        return {
            salary: job.jobSalary.toLocaleString(),
            rating: job.jobRating.toFixed(1),
            postedDate: new Date(Number(job.createdAt)).toLocaleDateString(),
        };
    }, [job]);

    // handle apply button click
    const handleApply = useCallback(async () => {
        setLoading(true);
        const userData = localStorage.getItem("current_user");
        if (!userData) {
            console.error("User data not found");
            setLoading(false);
            return;
        }

        try {
            const parsedData = JSON.parse(userData);
            const result = await applyJob(parsedData.ok.id, jobId!);
            if (result) {
                console.log("Applied for the job");
                setApplied(true);
            } else {
                console.error("Failed to apply for the job");
            }
        } catch (err) {
            console.error("Error applying for job:", err);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    const handleAccept = async (userid: string): Promise<void> => {
        if (jobId) {
            await acceptApplier(userid, jobId)
            getJobApplier(jobId).then((users) => {
                setAppliers(users);
            });
            getAcceptedFreelancer(jobId).then((users) =>{
                setAccAppliers(users)
            })
        }

    };

    const handleReject = async (userid: string): Promise<void> => {
        if (jobId) {
            await rejectApplier(userid, jobId)
            getJobApplier(jobId).then((users) => {
                setAppliers(users);
            });
            getAcceptedFreelancer(jobId).then((users) =>{
                setAccAppliers(users)
            })
        }

    };

    // const handleStart = async (): Promise<void> =>{
    //     const userData = localStorage.getItem("current_user");
    //     const parsedData = JSON.parse(userData ? userData : "");
    //     if (userData && jobId) {
    //         // Check if current user is the job owner
    //         if (job && job.userId === parsedData.ok.id) {
    //             startButtonClick(parsedData.ok.id, jobId, parsedData.ok.wallet)

    //         }
    //     }
    // }


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

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <Navbar />
                <div className="container mx-auto px-4 mt-6 text-center py-20">
                    <h1 className="text-2xl text-red-500">{error}</h1>
                </div>
                <Footer />
            </div>
        );
    }

    if (!job) return null;



    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {loading && <LoadingOverlay message="Loading Job..." />}
            <Navbar />

            {/* Accepted Users Modal */}
            {showAcceptedUsersModal && (
                <AcceptedUsersModal
                    users={acceptedAppliers}
                    onClose={() => setShowAcceptedUsersModal(false)}
                />
            )}

            {showApplicantsModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Applicants</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowApplicantsModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* List of Applicants */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {appliers.map((applier, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                                >
                                    {/* Profile Picture and Name */}
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={URL.createObjectURL(applier.user.profilePicture)}
                                            alt={applier.user.username}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                                        />
                                        <div>
                                            <span className="text-gray-800 font-semibold block text-sm">{applier.user.username}</span>
                                            <span className="text-xs text-gray-500">Applied 2 days ago</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all duration-200"
                                            onClick={() => handleAccept(applier.user.id)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200"
                                            onClick={() => handleReject(applier.user.id)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Close Button */}
                        <div className="mt-6">
                            <button
                                className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                                onClick={() => setShowApplicantsModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <motion.div
                className="container mx-auto px-4 mt-6 flex-grow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Section (2/3 width) */}
                    <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
                        {/* Job Header */}
                        <div className="mb-8">
                            <motion.h1
                                className="text-3xl font-bold text-indigo-800 mb-4"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                            >
                                {job.jobName}
                            </motion.h1>
                            <div className="mt-8 border-t pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                                            Current Applicants
                                        </h3>
                                        <p className="text-gray-600">
                                            {currentApplicants.toString()} /{" "}
                                            {maxApplicants.toString()} positions filled
                                        </p>
                                    </div>
                                    <motion.div
                                        className="flex -space-x-3 cursor-pointer"
                                        onClick={() => setShowAcceptedUsersModal(true)}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {acceptedAppliers.slice(0, 3).map((user, index) => (
                                            <div
                                                key={user.id}
                                                className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold"
                                                style={{ zIndex: 3 - index }}
                                            >
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                        {appliers.length > 3 && (
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-white text-sm">
                                                +{appliers.length - 3}
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <motion.div
                            className="mb-8 bg-blue-50/30 p-6 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-indigo-500" />
                                Job Description
                            </h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {job.jobDescription.map((desc, index) => (
                                    <li key={index}>{desc}</li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right Section (1/3 width) */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 h-fit sticky top-6">
                        {isOwner ? (
                            <div className="space-y-4">
                                {/* Reward Section */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm">
                                    <h3 className="text-xl font-semibold text-indigo-800 mb-1">
                                        Manage Applicants
                                    </h3>
                                    <p className="text-sm text-gray-600">Review and manage applicants for your job posting.</p>
                                </div>

                                {/* View Applicants Button */}
                                <button
                                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                                    onClick={() => setShowApplicantsModal(true)}
                                >
                                    View Applicants ({appliers.length})
                                </button>

                                {/* Start Job Button */}
                                <button
                                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                                    // onClick={handleStart}
                                >
                                    Start Job
                                </button>
                            </div>
                        ) : (
                            // UI for non-owners (applicants)
                            <div className="space-y-6">
                                {/* Reward Section */}
                                <div className="bg-blue-50/30 p-4 rounded-xl">
                                    <h3 className="text-3xl font-semibold text-indigo-800 mb-2">
                                        Job Reward
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-green-600">
                                            ${jobDetails?.salary}/person
                                        </span>
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="mt-1 w-5 h-5 accent-indigo-500"
                                        />
                                        <label htmlFor="terms" className="text-sm text-gray-700">
                                            I have fully understood and meet all job requirements
                                        </label>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="responsibility"
                                            checked={responsibilityAccepted}
                                            onChange={(e) => setResponsibilityAccepted(e.target.checked)}
                                            className="mt-1 w-5 h-5 accent-indigo-500"
                                        />
                                        <label htmlFor="responsibility" className="text-sm text-gray-700">
                                            I apply to this job voluntarily and take full responsibility
                                        </label>
                                    </div>
                                </div>

                                {/* Application Status */}
                                {isApplicationClosed ? (
                                    <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm">
                                        ❌ This job has reached the maximum number of applicants
                                    </div>
                                ) : (
                                    <div className="bg-green-50 p-4 rounded-xl text-green-600 text-sm">
                                        ✅ {(maxApplicants - currentApplicants).toString()} positions remaining
                                    </div>
                                )}

                                {/* Apply Button */}
                                <motion.button
                                    className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 ${applied || !termsAccepted || !responsibilityAccepted || isApplicationClosed
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                        }`}
                                    disabled={applied || !termsAccepted || !responsibilityAccepted || isApplicationClosed}
                                    whileHover={!applied ? { scale: 1.02 } : undefined}
                                    whileTap={!applied ? { scale: 0.98 } : undefined}
                                    onClick={() => handleApply()}
                                >
                                    {applied ? "Applied" : "Apply"}
                                </motion.button>

                                {/* Info Text */}
                                <p className="text-xs text-gray-500 text-center">
                                    By applying, you agree to our terms of service and privacy policy
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </motion.div>
            <Footer />
        </div>
    );
}