import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Job, JobCategory } from "../../../../declarations/job/job.did";
import { getJobDetail } from "../../controller/jobController";

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                if (id) {
                    const jobData = await getJobDetail(id);
                    if (jobData) {
                        setJob(jobData);
                    } else {
                        setError("Job not found");
                    }
                }
            } catch (err) {
                console.error("Error fetching job:", err);
                setError("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

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
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {job.jobName}
                                </h1>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-lg font-semibold text-green-600">
                                        ${job.jobSalary.toLocaleString()}/year
                                    </span>
                                    <div className="flex items-center">
                                        <span className="text-yellow-500">★</span>
                                        <span className="ml-1 text-gray-600">
                                            {job.jobRating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                                {job.jobStatus}
                            </span>
                        </div>

                        {/* Job Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {job.jobTags.map((tag: JobCategory) => (
                                <span
                                    key={tag.id}
                                    className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
                                >
                                    {tag.jobCategoryName}
                                </span>
                            ))}
                        </div>

                        {/* Job Details */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                                <ul className="list-disc pl-6 space-y-2">
                                    {job.jobDescription.map((desc, index) => (
                                        <li key={index} className="text-gray-600">
                                            {desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Available Slots</h3>
                                    <p className="text-gray-600">{job.jobSlots.toString()} positions</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Posted</h3>
                                    <p className="text-gray-600">
                                        {new Date(Number(job.createdAt)).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-200">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}