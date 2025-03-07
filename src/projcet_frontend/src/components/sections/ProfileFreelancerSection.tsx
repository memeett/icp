import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FreelancerActiveJobTab from "../tabs/FreelancerActiveJobTab";
import FreelancerJobHistoryTab from "../tabs/FreelancerJobHistoryTab";

export default function ProfileFreelancerSection() {
    const [activeTab, setActiveTab] = useState("active");

    useEffect(() => {
        
    }, [])

    // // Mock data for demonstration - replace with your actual data source
    // const activeJobs = [
    //     { id: 1, title: "Website Redesign", client: "ABC Company", deadline: "2025-04-15", status: "In Progress" },
    //     { id: 2, title: "Mobile App Development", client: "XYZ Corp", deadline: "2025-05-20", status: "Just Started" }
    // ];

    // const historyJobs = [
    //     { id: 3, title: "E-commerce Platform", client: "123 Retail", deadline: "2025-02-28", status: "Completed" },
    //     { id: 4, title: "Logo Design", client: "Creative Studios", deadline: "2025-01-10", status: "Completed" },
    //     { id: 5, title: "SEO Optimization", client: "Global Marketing", deadline: "2024-12-15", status: "Completed" }
    // ];

    // const renderJobList = (jobs) => {
    //     if (jobs.length === 0) {
    //         return (
    //             <div className="text-center py-10 text-gray-500">
    //                 No jobs to display
    //             </div>
    //         );
    //     }

    //     return (
    //         <div className="grid gap-4 md:grid-cols-2">
    //             {jobs.map(job => (
    //                 <div key={job.id} className="bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all">
    //                     <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
    //                     <div className="mt-2 text-sm text-gray-600">
    //                         <p><span className="font-medium">Client:</span> {job.client}</p>
    //                         <p><span className="font-medium">Deadline:</span> {job.deadline}</p>
    //                         <div className="mt-3 flex items-center">
    //                             <span className="font-medium mr-2">Status:</span>
    //                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === "Completed"
    //                                 ? "bg-green-100 text-green-800"
    //                                 : job.status === "In Progress"
    //                                     ? "bg-blue-100 text-blue-800"
    //                                     : "bg-yellow-100 text-yellow-800"
    //                                 }`}>
    //                                 {job.status}
    //                             </span>
    //                         </div>
    //                     </div>
    //                     <div className="mt-4">
    //                         <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
    //                             View Details
    //                         </button>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // };

    return (
        <div className="w-full bg-gradient-to-r">
            <div className="max-w-5xl mx-auto px-4 ">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100"
                >
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Freelance Jobs</h2>

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === "active"
                                    ? "border-b-2 border-purple-500 text-purple-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("active")}
                            >
                                Active Jobs
                            </button>
                            <button
                                className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === "history"
                                    ? "border-b-2 border-purple-500 text-purple-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("history")}
                            >
                                Job History
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="py-2">
                            {activeTab === "active" ? (
                                <FreelancerActiveJobTab/>
                            ) : (
                                <FreelancerJobHistoryTab/>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}