import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Job, JobCategory } from "../../../../declarations/job/job.did";
import { getJobApplier, getJobById } from "../../controller/jobController";
import { applyJob, hasUserApplied } from "../../controller/applyController";
import { User } from "../../interface/User";

// Reusable JobTag Component
const JobTag = ({ tag }: { tag: JobCategory }) => (
    <span className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
        {tag.jobCategoryName}
    </span>
);

// Reusable JobDetailSection Component
const JobDetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
    </div>
);

export default function JobDetailPage() {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applied, setApplied] = useState(false);
    const [appliers, setAppliers] = useState<User[]>([])

    // Get current user's principal from localStorage
    const currentUserPrincipal = useMemo(() => {
        const userData = localStorage.getItem("current_user");
        if (userData) {
            const parsedData = JSON.parse(userData);
            return parsedData.ok.id;
        }
        return "";
    }, []);

    const checkApplied = useCallback(async () => {
        if (!currentUserPrincipal) {
            console.error("User data not found");
            return false;
        }
        try {
            const result = await hasUserApplied(currentUserPrincipal, jobId!);
            return result;
        } catch (err) {
            console.error("Error checking application status:", err);
            return false;
        }
    }, [jobId, currentUserPrincipal]);

    const fetchJobAndCheckApplied = useCallback(async () => {
        if (!jobId) {
            setError("Job ID is missing");
            setLoading(false);
            return;
        }
        try {
            // Fetch job details
            const jobData = await getJobById(jobId);
            if (!jobData) {
                setError("Job not found");
                setLoading(false);
                return;
            }
            setJob(jobData);

            // Get current user's principal from localStorage
            const currentUserString = localStorage.getItem("current_user");
            let currentUserPrincipal = "";
            if (currentUserString) {
                const parsedData = JSON.parse(currentUserString);
                currentUserPrincipal = parsedData.ok.id;
            } else {
                console.error("Current user not found in localStorage");
            }

            // If the current user is the job poster, fetch job appliers.
            if (currentUserPrincipal === jobData.userId) {
                const appliers = await getJobApplier(jobId)
                console.log("Job Appliers:", appliers);
                // Optionally, set state for appliers to render them
                // setAppliers(appliers);
            } else {
                // Otherwise, check if the current user has applied.
                const hasApplied = await checkApplied();
                setApplied(hasApplied);
            }
        } catch (err) {
            console.error("Error fetching job or checking application status:", err);
            setError("Failed to load job details");
        } finally {
            setLoading(false);
        }
    }, [jobId, checkApplied]);

    useEffect(() => {
        fetchJobAndCheckApplied();
    }, [fetchJobAndCheckApplied]);

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

    const jobDetails = useMemo(() => {
        if (!job) return null;
        return {
            salary: job.jobSalary.toLocaleString(),
            rating: job.jobRating.toFixed(1),
            postedDate: new Date(Number(job.createdAt) / 1_000_000).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        };
    }, [job]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
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
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 mt-6 flex-grow">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-8">
                        {/* Job Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.jobName}</h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-lg font-semibold text-green-600">${jobDetails?.salary}</span>
                                    <div className="flex items-center">
                                        <span className="text-yellow-500">★</span>
                                        <span className="ml-1 text-gray-600">{jobDetails?.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                                {job.jobStatus}
                            </span>
                        </div>

                        {/* Job Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {job.jobTags.map((tag) => (
                                <JobTag key={tag.id} tag={tag} />
                            ))}
                        </div>

                        {/* Job Details */}
                        <div className="space-y-6">
                            <JobDetailSection title="Job Description">
                                <ul className="list-disc pl-6 space-y-2">
                                    {job.jobDescription.map((desc, index) => (
                                        <li key={index} className="text-gray-600">{desc}</li>
                                    ))}
                                </ul>
                            </JobDetailSection>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Available Slots</h3>
                                    <p className="text-gray-600">{job.jobSlots.toString()} positions</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Posted</h3>
                                    <p className="text-gray-600">{jobDetails?.postedDate}</p>
                                </div>
                            </div>

                            {/* Conditional content: if current user is the job poster, show different content */}
                            {currentUserPrincipal === job.userId ? (
                                <div className="flex justify-center items-center py-4">
                                    <p className="text-gray-800 font-semibold">
                                        This is your job posting. You can manage it in your dashboard.
                                    </p>
                                </div>
                            ) : (
                                <button
                                    className={`w-full text-white py-3 px-6 rounded-lg transition duration-200 ${applied ? "bg-red-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                                        }`}
                                    onClick={handleApply}
                                    disabled={applied || loading}
                                >
                                    {applied ? "Applied" : "Apply Now"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
