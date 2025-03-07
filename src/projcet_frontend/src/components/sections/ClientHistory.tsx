import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        const fetchAllData = async () => {
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
        };

        fetchAllData();
    }, [clientId]);

    return (
        <div className="w-full bg-gradient-to-r">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100"
                >
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Client History</h2>

                        {/* Transactions Content */}
                        <div className="py-2">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500 flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-500">
                                    {error}
                                </div>
                            ) : transactionsData.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-1">
                                    {transactionsData.map((data) => (
                                        <ClientHistoryCard key={`${data.transaction.client}-${data.transaction.jobId}`} data={data} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    No client history to display
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function ClientHistoryCard({ data }: { data: EnhancedTransaction }) {
    const { transaction, job, clientUser, freelancerUsers } = data;
    
    // Determine job status for styling
    const getStatusColor = () => {
        if (job && job.status) {
            const status = job.status.toLowerCase();
            if (status === "completed" || status === "success") return "green";
            if (status === "in progress" || status === "active") return "blue";
            if (status === "cancelled" || status === "failed") return "red";
            return "purple"; // default color
        }
        return "purple";
    };
    
    const statusColor = getStatusColor();
    const textColorClass = `text-${statusColor}-600`;
    const bgColorClass = `bg-${statusColor}-100`;
    const textColorClassForBg = `text-${statusColor}-800`;

    return (
        <div className="bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all">
            <div className="flex justify-between items-start">
                <h3 className={`font-semibold text-lg ${textColorClass}`}>
                    {job?.jobName || "Untitled Job"}
                </h3>
                {/* {transaction.amount !== undefined && (
                    <span className={`text-lg font-bold ${textColorClass}`}>
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD"
                        }).format(transaction.amount)}
                    </span>
                )} */}
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p className="mb-2">
                    <span className="font-medium">Client:</span> {clientUser?.username || "Unknown Client"}
                </p>
                <p className="mb-2">
                    <span className="font-medium">Freelancers:</span> {freelancerUsers.map(u => u?.username).filter(Boolean).join(", ") || "No freelancers"}
                </p>
                <p className="mb-2">
                    <span className="font-medium">Job ID:</span> {transaction.jobId}
                </p>
            </div>

            <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColorClass} ${textColorClassForBg}`}>
                    {job?.status || "Unknown Status"}
                </span>
            </div>
        </div>
    );
}