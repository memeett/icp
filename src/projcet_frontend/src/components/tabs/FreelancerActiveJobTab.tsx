import { useEffect, useState } from "react";
import { JobTransaction } from "../../../../declarations/job_transaction/job_transaction.did";
import { getActiveTransactionByFreelancer } from "../../controller/freelancerController";
import FreelancerJobCard from "./FreelancerJobCard";

export default function FreelancerActiveJobTab() {
    const [activeJob, setActiveJob] = useState<JobTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const userData = localStorage.getItem("current_user");
            if (!userData) {
                console.error("No user data found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const parsedData = JSON.parse(userData);
                const freelancerId = parsedData.ok?.id;
                if (!freelancerId) {
                    console.error("Freelancer ID not found in user data");
                    setLoading(false);
                    return;
                }

                const result = await getActiveTransactionByFreelancer(freelancerId);
                if (result) {
                    setActiveJob(result);
                } else {
                    setActiveJob([]);
                }
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
                setActiveJob([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            {activeJob.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Active Jobs</h3>
                    <p className="text-gray-600">You don't have any active jobs at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {activeJob.map((job, index) => (
                        <FreelancerJobCard key={job.jobId + index} jobId={job.jobId} isLoading={()=>setLoading(false)}/>
                    ))}
                </div>
            )}
        </div>
    );
}