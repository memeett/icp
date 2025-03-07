import { motion } from "framer-motion";
import { Job } from "../../interface/job/Job";

export default function ClientHistoryCard({job} : {job : Job}){




    const formatDate = (timestamp: bigint) => {
        const date = new Date(Number(timestamp / 1_000_000n));
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Format salary with currency symbol
    const formatSalary = (salary: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(salary);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{job.jobName}</h2>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {job.jobTags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                                >
                                    {tag.jobCategoryName}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${job.jobStatus === "FINISHED"
                                    ? "bg-green-100 text-green-800"
                                    : job.jobStatus === "ONGOING"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                        >
                            {job.jobStatus}
                        </span>
                        <span className="text-gray-500 text-sm mt-2">
                            Created on {formatDate(job.createdAt)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-sm">Salary</p>
                        <p className="font-bold text-gray-900">{formatSalary(job.jobSalary)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-sm">Slots</p>
                        <p className="font-bold text-gray-900">{job.jobSlots.toString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-sm">Wallet</p>
                        <p className="font-bold text-gray-900">{formatSalary(job.wallet)}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300">
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
};