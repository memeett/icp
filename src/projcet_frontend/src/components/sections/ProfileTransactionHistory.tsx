import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { getUserTransaction } from "../../controller/userController";
import { CashFlowHistory, TransactionType } from "../../../../declarations/user/user.did";
import { getUserById } from "../../controller/userController";

export default function ProfileTransactionsSection({ userId }: { userId: string }) {
    const [transactions, setTransactions] = useState<CashFlowHistory[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const result = await getUserTransaction(userId);
                setTransactions(result);
            } catch (err) {
                setError("Failed to load transactions");
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [userId]);

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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Transactions</h2>

                        {/* Transactions Content */}
                        <div className="py-2">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500 flex justify-center items-center ">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-500">
                                    {error}
                                </div>
                            ) : transactions && transactions.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-1">
                                    {transactions.map((transaction, index) => (
                                        <TransactionCard
                                            key={`${transaction.fromId}-${transaction.transactionAt.toString()}-${index}`}
                                            transaction={transaction}
                                            userId={userId}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    No transactions to display
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function TransactionCard({ transaction, userId }: { transaction: CashFlowHistory; userId: string }) {
    const [fromName, setFromName] = useState<string>("Loading...");
    const [toNames, setToNames] = useState<string[]>([]);
    
    // Format date from bigint timestamp
    const formatDate = (timestamp: bigint) => {
        // Convert from nanoseconds to milliseconds
        const milliseconds = Number(timestamp / BigInt(1000000));
        const date = new Date(milliseconds);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Format amount with currency symbol
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(amount);
    };

    // Get transaction type as a string
    const getTransactionTypeString = (type: TransactionType): string => {
        if ('topUp' in type) return "Top Up";
        if ('transfer' in type) return "Transfer";
        if ('transferToJob' in type) return "Transfer to Job";
        return "Unknown";
    };

    const isIncomingToUser = Array.isArray(transaction.toId) && transaction.toId.some(id => id === userId);
    // Top-up is always incoming (positive) when it's the user's own top-up
    const isTopUp = 'topUp' in transaction.transactionType;
    const isTopUpByUser = isTopUp && transaction.fromId === userId;
    
    // If money is coming to the user OR it's a top-up by the user, it's incoming (positive)
    const isIncoming = isIncomingToUser || isTopUpByUser;
    
    useEffect(() => {
        const fetchNames = async () => {
            try {
                // Get from user name
                const fromResult = await getUserById(transaction.fromId);
                if (fromResult) {
                    setFromName(fromResult.username);
                }
                
                // Get to user names for each ID in the toId array
                const toNamesPromises = transaction.toId.map(id => getUserById(id));
                const toResults = await Promise.all(toNamesPromises);
                const validNames = toResults
                    .filter(result => result !== null)
                    .map(result => result!.username);
                setToNames(validNames);
            } catch (error) {
                console.error("Failed to get user names:", error);
            }
        };
        
        fetchNames();
    }, [transaction.fromId, transaction.toId]);

    const getFromToText = () => {
        if ('topUp' in transaction.transactionType) {
            return "Bank Account";
        }
        return fromName || "Unknown User";
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all">
            <div className="flex justify-between items-start">
                <h3 className={`font-semibold text-lg ${isIncoming ? "text-green-600" : "text-red-500"}`}>
                    {getTransactionTypeString(transaction.transactionType)}
                </h3>
                <span className={`text-lg font-bold ${isIncoming ? "text-green-600" : "text-red-500"}`}>
                    {isIncoming ? "+" : "-"}{formatAmount(transaction.amount)}
                </span>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p className="mb-2">
                    <span className="font-medium">From:</span> {getFromToText()}
                </p>
                {transaction.toId.length > 0 && (
                    <p className="mb-2">
                        <span className="font-medium">To:</span> {toNames.length > 0 ? toNames.join(", ") : "Loading..."}
                    </p>
                )}
                <p className="mb-2">
                    <span className="font-medium">Date:</span> {formatDate(transaction.transactionAt)}
                </p>
            </div>

            <div className="mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isIncoming
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                    {isIncoming ? "Received" : "Sent"}
                </span>
            </div>
        </div>
    );
}