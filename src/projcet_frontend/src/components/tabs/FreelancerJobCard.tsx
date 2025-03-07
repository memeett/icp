import { useEffect, useState } from "react";
import { Job } from "../../interface/job/Job";
import { getJobById } from "../../controller/jobController";
import { useNavigate } from "react-router-dom";

export default function FreelancerJobCard({ jobId, isLoading }: { jobId: string; isLoading : () => void }) {
    const [job, setJob] = useState<Job | null>(null);
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const nav = useNavigate()
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await getJobById(jobId);
                if (res) {
                    setJob(res);
                    const createdAtMillis = Number(res.createdAt / 1_000_000n);
                    const jobDate = new Date(createdAtMillis);
                    setDate(jobDate.toLocaleDateString()); 
                } else {
                    setError("Job not found");
                }
            } catch (err) {
                console.error("Failed to fetch job:", err);
                setError("Failed to load job details");
            } finally {
                isLoading();
            }
        };

        fetchJob();
    }, [jobId]);

    const viewDetail = () => {
        nav("/jobs/" + jobId)

    }




    return (
        <div className="bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all">
            <h3 className="font-semibold text-lg text-gray-800">{job?.jobName}</h3>
            <div className="mt-2 text-sm text-gray-600">
                <p>
                    <span className="font-medium">Created At:</span> {date}
                </p>
                <div className="mt-3 flex items-center">
                    <span className="font-medium mr-2">Status:</span>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${job?.jobStatus === "Completed"
                                ? "bg-green-100 text-green-800"
                                : job?.jobStatus === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                        {job?.jobStatus}
                    </span>
                </div>
            </div>
            <div className="mt-4">
                <button className="text-sm text-purple-600 hover:text-purple-800 font-medium" onClick={viewDetail}>
                    View Details
                </button>
            </div>
        </div>
    );
}