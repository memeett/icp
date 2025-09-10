import { AuthClient } from "@dfinity/auth-client";
<<<<<<< HEAD
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import { Job, User } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
import type { JobTransaction } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
import { HttpAgent } from "@dfinity/agent";
=======
import { job_transaction } from "../../../declarations/job_transaction";
import { Job } from "../../../declarations/job/job.did";
import { JobTransaction, User } from "../../../declarations/job_transaction/job_transaction.did";
import { HttpAgent } from "@dfinity/agent";
import { job } from "../../../declarations/job";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import { getJobById } from "./jobController";
import { agentService } from "../singleton/agentService";
  

export const createJobTransaction = async (ownerId: string, jobId: string): Promise<boolean> => {
    const agent = await agentService.getAgent();
    try {
<<<<<<< HEAD
        await projcet_backend_single.createTransaction(ownerId, jobId);
=======
        await job_transaction.createTransaction(ownerId, jobId, process.env.CANISTER_ID_JOB_TRANSACTION!);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        console.log("Job transaction created successfully");
        return true;
    } catch (error) {
        console.error("Failed to create job transaction:", error);
        return false;
    }
}

// export const updateFreelancer = async (transactionId: string, freelancerId: string): Promise<boolean> => {
//     const authClient = await AuthClient.create();
//     const identity = authClient.getIdentity();
//     const agent = new HttpAgent({ identity });

//     if (process.env.DFX_NETWORK === "local") {
//         await agent.fetchRootKey();
//     }
//     try {
//         const res = await job_transaction.appendFreelancers(transactionId, freelancerId);
//         if ("ok" in res) {
//             console.log("Freelancer updated successfully:", res.ok);
//             return true;
//         }
//         console.error("Failed to update freelancer:", res.err);
//         return false;
//     }
//     catch (error) {
//         console.error("Failed to update freelancer:", error);
//         return false;
//     }
// }

<<<<<<< HEAD
// This function is likely deprecated or needs to be re-implemented in the single canister.
// export const getAcceptedFreelancers = async (transactionId: string): Promise<User[] | null> => {
//     const agent = await agentService.getAgent();
//     try {
//         const res = await projcet_backend_single.getAcceptedFreelancers(transactionId);
//         if ("ok" in res) {
//             return res.ok;
//         }
//         return null;
//     } catch (error) {
//         console.error("Failed to get accepted freelancers:", error);
//         return null;
//     }
// }
=======
export const getAcceptedFreelancers = async (transactionId: string): Promise<User[] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.getAcceptedFreelancers(transactionId, process.env.CANISTER_ID_USER!);
        if ("ok" in res) {
            console.log("Accepted freelancers:", res.ok);
            return res.ok;
        }
        console.error("Failed to get accepted freelancers:", res.err);
        return null;
    } catch (error) {
        console.error("Failed to get accepted freelancers:", error);
        return null;
    }
}
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

// export const getAllTransactions = async (): Promise<JobTransaction[] | null> => {
//     const authClient = await AuthClient.create();
//     const identity = authClient.getIdentity();
//     const agent = new HttpAgent({ identity });

//     if (process.env.DFX_NETWORK === "local") {
//         await agent.fetchRootKey();
//     }
//     try {
//       const result = await job_transaction.getAllTransactions();
//       return result;
//     } catch (error) {
//       console.error("Failed to get all transactions:", error);
//       return null;
//     }
//   };

// export const getTransactionByJob = async (jobId: string): Promise<JobTransaction | null> => {
//     const authClient = await AuthClient.create();
//     const identity = authClient.getIdentity();
//     const agent = new HttpAgent({ identity });

//     if (process.env.DFX_NETWORK === "local") {
//         await agent.fetchRootKey();
//     }
//     try {
//         const res = await job_transaction.getTransactionByJobId(jobId);
//         if ("ok" in res) {
//             console.log("Transaction:", res.ok);
//             return res.ok;
//         }
//         console.error("Failed to get transaction:", res.err);
//         return null;
//     } catch (error) {
//         console.error("Failed to get transaction:", error);
//         return null;
//     }
// }

// export const getTransactionByClient = async (clientId: string): Promise<JobTransaction [] | null> => {
//     const authClient = await AuthClient.create();
//     const identity = authClient.getIdentity();
//     const agent = new HttpAgent({ identity });

//     if (process.env.DFX_NETWORK === "local") {
//         await agent.fetchRootKey();
//     }
//     try {
//         const res = await job_transaction.getTransactionByClientId(clientId);
//         return res;
//     } catch (error) {
//         console.error("Failed to get transaction:", error);
//         return null;
//     }
// }

export const getActiveTransactionByFreelancer = async (freelancerId: string): Promise<JobTransaction[] | null> => {
<<<<<<< HEAD
    const agent = await agentService.getAgent();
    try {
        const res = await projcet_backend_single.getTransactionByFreelancerId(freelancerId);
        const jobTransactions = await Promise.all(
            res.map(async (jt: JobTransaction) => {
=======
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }

    try {
        const res = await job_transaction.getTransactionByFreelancerId(freelancerId);
        const jobTransactions = await Promise.all(
            res.map(async (jt) => {
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
                try {
                    const jobDetail = await getJobById(jt.jobId);
                    if (jobDetail && jobDetail.jobStatus !== "Finished") {
                        return jt; 
                    }
                } catch (error) {
                    console.error("Failed to fetch job details for job ID:", jt.jobId, error);
                }
                return null; 
            })
        );

<<<<<<< HEAD
        const filteredTransactions = jobTransactions.filter((jt): jt is JobTransaction => jt !== null);
=======
        const filteredTransactions = jobTransactions.filter((jt) => jt !== null) as JobTransaction[];
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

        return filteredTransactions;
    } catch (error) {
        console.error("Failed to get transaction:", error);
        return null;
    }
};

export const getClientHistory = async (clientId: string): Promise<JobTransaction [] | null> => {
<<<<<<< HEAD
    const agent = await agentService.getAgent();
    try {
        const res = await projcet_backend_single.getClientHistory(clientId);
=======
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.getClientHistory(clientId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return res;
    } catch (error) {
        console.error("Failed to get client history:", error);
        return null;
    }
}

export const getFreelancerHistory = async (freelancerId: string): Promise<JobTransaction[] | null> => {
<<<<<<< HEAD
    const agent = await agentService.getAgent();
    try {
        const res = await projcet_backend_single.getFreelancerHistory(freelancerId);

        // Use Promise.all to handle asynchronous operations
        const jobTransactions = await Promise.all(
            res.map(async (jt: JobTransaction) => {
=======
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }

    try {
        // Fetch the freelancer's transaction history
        const res = await job_transaction.getFreelancerHistory(freelancerId);

        // Use Promise.all to handle asynchronous operations
        const jobTransactions = await Promise.all(
            res.map(async (jt) => {
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
                try {
                    // Fetch job details for each transaction
                    const jobDetail = await getJobById(jt.jobId);
                    if (jobDetail && jobDetail.jobStatus === "Finished") {
                        return jt; // Include the transaction if the job is finished
                    }
                } catch (error) {
                    console.error("Failed to fetch job details for job ID:", jt.jobId, error);
                }
                return null; // Exclude the transaction if the job is not finished or an error occurs
            })
        );

        // Filter out null values (transactions that were excluded)
<<<<<<< HEAD
        const filteredTransactions = jobTransactions.filter((jt): jt is JobTransaction => jt !== null);
=======
        const filteredTransactions = jobTransactions.filter((jt) => jt !== null) as JobTransaction[];
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

        return filteredTransactions;
    } catch (error) {
        console.error("Failed to get freelancer history:", error);
        return null;
    }
};