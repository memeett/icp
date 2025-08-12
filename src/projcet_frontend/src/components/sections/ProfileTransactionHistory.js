import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { getUserTransaction } from "../../controller/userController";
import { getUserById } from "../../controller/userController";
import { getJobById } from "../../controller/jobController";
import { formatDate } from "../../utils/dateUtils";
import { formatCurrency } from "../../utils/currecncyUtils";
export default function ProfileTransactionsSection({ userId, }) {
    const [transactions, setTransactions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getUserTransaction(userId);
            setTransactions(result);
        }
        catch (err) {
            setError("Failed to load transactions");
            console.error("Error fetching transactions:", err);
        }
        finally {
            setLoading(false);
        }
    }, [userId]);
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);
    return (_jsx("div", { className: "w-full bg-gradient-to-r", children: _jsx("div", { className: "max-w-5xl mx-auto", children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100", children: [_jsxs("div", { className: "relative overflow-hidden h-32 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100", children: [_jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cGF0aCBkPSJNMjAgMCBMMjAgNDAgTDAgMjAgTDQwIDIwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')] opacity-30" }), _jsx("div", { className: "absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t" }), _jsx("div", { className: "relative p-6 flex items-end h-full", children: _jsx("h1", { className: "text-3xl font-bold text-purple-700 drop-shadow-md", children: "Your Transactions" }) })] }), _jsx("div", { className: "p-6", children: loading ? (_jsx("div", { className: "flex justify-center items-center py-16", children: _jsx("div", { className: "w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" }) })) : error ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-red-500 mb-2", children: error }), _jsx("button", { onClick: () => fetchTransactions(), className: "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300", children: "Try Again" })] })) : transactions && transactions.length > 0 ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("p", { className: "text-gray-600", children: ["You have ", transactions.length, " transaction", transactions.length !== 1 ? "s" : ""] }), _jsx("div", { className: "flex space-x-2", children: _jsx("button", { onClick: () => fetchTransactions(), className: "p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }) }) })] }), transactions.map((transaction, index) => (_jsx(TransactionCard, { transaction: transaction, userId: userId }, `${transaction.fromId}-${transaction.transactionAt.toString()}-${index}`)))] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full inline-block mb-4", children: _jsx("svg", { className: "h-16 w-16 text-purple-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }) }), _jsx("p", { className: "mt-4 text-lg text-gray-600", children: "No transactions found" }), _jsx("p", { className: "text-gray-500", children: "Your payment history will appear here once you have transactions." }), _jsx("button", { onClick: () => fetchTransactions(), className: "mt-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300", children: "Refresh" })] })) })] }) }) }));
}
function TransactionCard({ transaction, userId, }) {
    const [fromName, setFromName] = useState("Loading...");
    const [toNames, setToNames] = useState([]);
    const [isCardLoading, setIsCardLoading] = useState(true);
    // Get transaction type as a string
    const getTransactionTypeString = (type) => {
        if ("topUp" in type)
            return "Top Up";
        if ("transfer" in type)
            return "Transfer";
        if ("transferToJob" in type)
            return "Transfer to Job";
        return "Unknown";
    };
    const isIncomingToUser = Array.isArray(transaction.toId) &&
        transaction.toId.some((id) => id === userId);
    const isTopUp = "topUp" in transaction.transactionType;
    const isTopUpByUser = isTopUp && transaction.fromId === userId;
    const isIncoming = isIncomingToUser || isTopUpByUser;
    useEffect(() => {
        const fetchNames = async () => {
            try {
                // Get from user name
                const fromResult = await getUserById(transaction.fromId);
                if (fromResult) {
                    setFromName(fromResult.username);
                }
                else {
                    const fromJob = await getJobById(transaction.fromId);
                    if (fromJob) {
                        setFromName(fromJob.jobName);
                    }
                }
                const toNamesResult = await Promise.all(transaction.toId.map(async (id) => {
                    const userResult = await getUserById(id);
                    if (userResult) {
                        return userResult.username;
                    }
                    try {
                        const jobResult = await getJobById(id);
                        const clientResult = await getUserById(jobResult?.userId || "");
                        if (jobResult) {
                            return (`${jobResult.jobName}` +
                                ` (created by ${clientResult?.username})`);
                        }
                    }
                    catch (jobError) {
                        console.error("Error fetching job:", jobError);
                    }
                    if (!isNaN(Number(id))) {
                        return `Job #${id}`;
                    }
                    return "Unknown Recipient";
                }));
                setToNames(toNamesResult);
                setIsCardLoading(false);
            }
            catch (error) {
                console.error("Failed to get user/job names:", error);
            }
        };
        fetchNames();
    }, [transaction.fromId, transaction.toId]);
    const getFromToText = () => {
        if ("topUp" in transaction.transactionType) {
            return "Bank Account";
        }
        return fromName || "Unknown User";
    };
    if (isCardLoading) {
        return (_jsx("div", { className: "bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all", children: _jsx("div", { className: "flex justify-center items-center py-8", children: _jsxs("div", { className: "animate-pulse flex space-x-4 w-full", children: [_jsx("div", { className: "rounded-full bg-slate-200 h-12 w-12" }), _jsxs("div", { className: "flex-1 space-y-4 py-1", children: [_jsx("div", { className: "h-4 bg-slate-200 rounded w-3/4" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-4 bg-slate-200 rounded w-5/6" }), _jsx("div", { className: "h-4 bg-slate-200 rounded w-1/2" })] })] })] }) }) }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 border border-purple-50 hover:border-purple-200 transition-all", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `p-3 rounded-full ${isIncoming ? "bg-green-100" : "bg-red-100"} mr-4`, children: _jsx("svg", { className: `h-6 w-6 ${isIncoming ? "text-green-600" : "text-red-600"}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: isIncoming ? (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 10l7-7m0 0l7 7m-7-7v18" })) : (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 14l-7 7m0 0l-7-7m7 7V3" })) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg text-gray-800", children: getTransactionTypeString(transaction.transactionType) }), _jsx("p", { className: "text-sm text-gray-500", children: formatDate(transaction.transactionAt) })] })] }), _jsxs("span", { className: `text-lg font-bold ${isIncoming ? "text-green-600" : "text-red-600"}`, children: [isIncoming ? "+" : "-", formatCurrency(transaction.amount)] })] }), _jsxs("div", { className: "mt-4 text-sm text-gray-600 border-t border-gray-100 pt-4", children: [_jsxs("p", { className: "mb-2 flex", children: [_jsx("span", { className: "font-medium w-10", children: "From:" }), _jsx("span", { className: "flex-1", children: getFromToText() })] }), transaction.toId.length > 0 && (_jsxs("p", { className: "mb-2 flex", children: [_jsx("span", { className: "font-medium w-10", children: "To:" }), _jsx("span", { className: "flex-1", children: toNames.length > 0
                                    ? toNames.join(", ")
                                    : "transferToJob" in transaction.transactionType &&
                                        transaction.toId.some((id) => !isNaN(Number(id)))
                                        ? transaction.toId.map((id) => `Job #${id}`).join(", ")
                                        : "Loading..." })] }))] }), _jsx("div", { className: "mt-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${isIncoming
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"}`, children: isIncoming ? "Received" : "Sent" }) })] }));
}
