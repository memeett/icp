import { useEffect, useState } from "react";
import { Job } from "../../../../declarations/job/job.did";
import { getAcceptedFreelancer, getJobApplier, getUserJobs } from "../../controller/jobController";
import { motion } from "framer-motion";
import { hasUserApplied } from "../../controller/applyController";
import { createInvitation } from "../../controller/invitationController";
import { createInbox } from "../../controller/inboxController";

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    freelancerId: string;
    freelancerName: string;
}

export default function InviteModal({
    isOpen,
    onClose,
    freelancerId,
    freelancerName
}: InviteModalProps) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [inviteSuccess, setInviteSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUserJobs();
    }, []);

    const fetchUserJobs = async () => {
        setLoading(true);
        const userData = localStorage.getItem("current_user");

        if (userData) {
            const parsedData = JSON.parse(userData);
            try {
                const userJobs = await getUserJobs(parsedData.ok.id);
                if (userJobs) {
                    // Filter only active/open jobs
                    const activeJobs = userJobs.filter(job => job.jobStatus === "Start");

                    // Filter jobs based on available slots
                    const filteredJobs = [];
                    for (const job of activeJobs) {
                        const res = await getAcceptedFreelancer(job.id); 
                        console.log(res.length, Number(job.jobSlots))
                        if (res.length - Number(job.jobSlots) != 0) { 
                            filteredJobs.push(job); 
                        }
                    }

                    setJobs(filteredJobs); // Set the filtered jobs
                } else {
                    setError("No jobs found");
                }
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Failed to load jobs");
            }
        }
        setLoading(false);
    };

    const handleSelectJob = (jobId: string) => {
        setSelectedJobId(jobId);
    };

    const handleInvite = async () => {
        if (!selectedJobId) {
            setError("Please select a job");
            return;
        }

        setLoading(true);
        setError("");



        const userData = localStorage.getItem("current_user");

        if (userData) {
            const parsedData = JSON.parse(userData);
            const res = await createInvitation(parsedData.ok.id, selectedJobId, freelancerId);

            if (res) {
                await createInbox(parsedData.ok.id, freelancerId, "Invitation", "-")
                setInviteSuccess(true);
                setError("");
            } else {
                setError("This freelancer already applied to this job.");
            }
        }

        setLoading(false);
    };

    const handleClose = () => {
        // Reset states before closing
        if (inviteSuccess) {
            setSelectedJobId(null);
            setInviteSuccess(false);
            setError("");
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: .95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
            >
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-semibold text-indigo-900">Invite Freelancer</h2>
                    <p className="text-gray-600 mt-1">
                        Select a job to invite <span className="font-medium text-indigo-600">{freelancerName}</span>
                    </p>
                </div>

                <div className="overflow-y-auto max-h-[60vh] p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                        </div>
                    ) : inviteSuccess ? (
                        <div className="text-center py-8 px-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Invitation Sent!</h3>
                            <p className="text-gray-600">Your invitation has been sent successfully to {freelancerName}.</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No Active Jobs</h3>
                            <p className="text-gray-600">You don't have any active jobs to invite freelancers to.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    onClick={() => handleSelectJob(job.id)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedJobId === job.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded-full mt-0.5 flex-shrink-0 border ${selectedJobId === job.id
                                            ? 'bg-indigo-500 border-indigo-500'
                                            : 'border-gray-300'
                                            }`}>
                                            {selectedJobId === job.id && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800">{job.jobName}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Salary: ${job.jobSalary.toLocaleString()} • Slots: {job.jobSlots.toString()}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {job.jobTags.map((category, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 text-xs rounded-full text-indigo-700 bg-indigo-100"
                                                    >
                                                        {category.jobCategoryName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                    >
                        {inviteSuccess ? "Close" : "Cancel"}
                    </button>

                    {!inviteSuccess && (
                        <button
                            onClick={handleInvite}
                            disabled={!selectedJobId || loading}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${!selectedJobId || loading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {loading ? 'Sending...' : 'Send Invitation'}
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}