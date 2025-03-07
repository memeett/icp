import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getClientHistory } from "../../controller/freelancerController";
import { JobTransaction } from "../../../../declarations/job_transaction/job_transaction.did";
import { getJobById } from "../../controller/jobController";
import { getUserById } from "../../controller/userController";

interface EnhancedTransaction {
    transaction: JobTransaction;
    job: any; 
    clientUser: any;
    freelancerUsers: any[]; 
}

export default function ProfileClientHistory() {
    const [transactionsData, setTransactionsData] = useState<EnhancedTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const user = localStorage.getItem("current_user");
    const userData = user ? JSON.parse(user).ok : null;
    const clientId = userData ? userData.id : "";

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            const transactions = (await getClientHistory(clientId)) || [];

            const newTransactions = await Promise.all(
                transactions.map(async (transaction) => {
                    const job = await getJobById(transaction.jobId);
                    const clientUser = await getUserById(transaction.client);
                    const freelancerUsers = await Promise.all(
                        transaction.freelancers.map(([userId, _]) => getUserById(userId))
                    );

                    return {
                        transaction,
                        job,
                        clientUser,
                        freelancerUsers
                    };
                })
            );

            setTransactionsData(newTransactions);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load client history");
        } finally {
            setLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return (
        <div className="w-full bg-gradient-to-r">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100"
                >
                    <div className="relative overflow-hidden h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cGF0aCBkPSJNMjAgMCBMMjAgNDAgTDAgMjAgTDQwIDIwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')] opacity-30"></div>
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t"></div>
                        <div className="relative p-6 flex items-end h-full">
                            <h1 className="text-3xl font-bold text-white drop-shadow-md">Client History</h1>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-500 mb-2">{error}</div>
                                <button
                                    onClick={() => fetchAllData()}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : transactionsData.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <p className="text-gray-600">You have {transactionsData.length} job{transactionsData.length !== 1 ? 's' : ''} in your history</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => fetchAllData()}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {transactionsData.map((data) => (
                                    <ClientHistoryCard key={`${data.transaction.client}-${data.transaction.jobId}`} data={data} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full inline-block mb-4">
                                    <svg className="h-16 w-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                </div>
                                <p className="mt-4 text-lg text-gray-600">No client history found</p>
                                <p className="text-gray-500">Your job history as a client will appear here.</p>
                                <button
                                    onClick={() => fetchAllData()}
                                    className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300"
                                >
                                    Refresh
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function ClientHistoryCard({ data }: { data: EnhancedTransaction }) {
    const { transaction, job, clientUser, freelancerUsers } = data;
    
    // Get job status for styling
    const getStatusDetails = () => {
        if (job && job.status) {
            const status = job.status.toLowerCase();
            if (status === "completed" || status === "success") {
                return {
                    color: "green",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )
                };
            }
            if (status === "in progress" || status === "active") {
                return {
                    color: "blue",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    )
                };
            }
            if (status === "cancelled" || status === "failed") {
                return {
                    color: "red",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )
                };
            }
            return {
                color: "purple",
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h6 w-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                )
            };
        }
        return {
            color: "purple",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
            )
        };
    };
    
    const statusDetails = getStatusDetails();
    
    return (
        <div className="bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all">
            <div className="flex items-start">
                <div className={`p-3 rounded-full bg-${statusDetails.color}-100 mr-4`}>
                    {statusDetails.icon}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start w-full">
                        <h3 className="font-semibold text-lg text-gray-800">
                            {job?.jobName || "Untitled Job"}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusDetails.color}-100 text-${statusDetails.color}-800`}>
                            {job?.status || "Unknown Status"}
                        </span>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                        <p className="mb-2 flex">
                            <span className="font-medium w-24">Client:</span> 
                            <span className="flex-1">{clientUser?.username || "Unknown Client"}</span>
                        </p>
                        <p className="mb-2 flex">
                            <span className="font-medium w-24">Freelancers:</span> 
                            <span className="flex-1">{freelancerUsers.map(u => u?.username).filter(Boolean).join(", ") || "No freelancers"}</span>
                        </p>
                        <p className="mb-2 flex">
                            <span className="font-medium w-24">Job ID:</span> 
                            <span className="flex-1 font-mono text-xs">{transaction.jobId}</span>
                        </p>
                    </div>
                    
                    {/* Add interaction buttons if needed */}
                    <div className="mt-4 flex space-x-2">
                        <button className="px-3 py-1 text-xs border border-purple-200 text-purple-600 rounded-md hover:bg-purple-50 transition-all">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}