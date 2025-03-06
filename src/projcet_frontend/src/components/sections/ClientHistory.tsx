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

export default function ClientHistoryModal() {
    const [transactionsData, setTransactionsData] = useState<EnhancedTransaction[]>([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [clientId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                <h2 className="text-xl font-semibold text-purple-700 mb-4">
                    Client History
                </h2>
                <div className="space-y-4">
                    {transactionsData.map(({ transaction, job, clientUser, freelancerUsers }) => (
                        <motion.div
                            key={`${transaction.client}-${transaction.jobId}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="font-bold text-purple-900">
                                {job.jobName || "Untitled Job"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Client: {clientUser?.username || "Unknown Client"}
                            </p>
                            <p className="text-sm text-gray-600">
                                Freelancers: {freelancerUsers.map(u => u?.username).filter(Boolean).join(", ") || "No freelancers"}
                            </p>
                            <p className="text-sm text-gray-600">
                                Job ID: {transaction.jobId}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};