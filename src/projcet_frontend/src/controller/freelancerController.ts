import { AuthClient } from "@dfinity/auth-client";
import { job_transaction } from "../../../declarations/job_transaction";
import { JobTransaction, User } from "../../../declarations/job_transaction/job_transaction.did";
import { HttpAgent } from "@dfinity/agent";
  

export const createJobTransaction = async (ownerId: string, jobId: string): Promise<boolean> => {
    const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });
    
        if (process.env.DFX_NETWORK === "local") {
            await agent.fetchRootKey();
        }
    try {
        await job_transaction.createTransaction(ownerId, jobId);
        return true;
    } catch (error) {
        console.error("Failed to create job transaction:", error);
        return false;
    }
}

export const updateFreelancer = async (transactionId: string, freelancerId: string): Promise<boolean> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.appendFreelancers(transactionId, freelancerId);
        if ("ok" in res) {
            console.log("Freelancer updated successfully:", res.ok);
            return true;
        }
        console.error("Failed to update freelancer:", res.err);
        return false;
    }
    catch (error) {
        console.error("Failed to update freelancer:", error);
        return false;
    }
}

export const getAcceptedFreelancers = async (transactionId: string): Promise<User[] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.getAcceptedFreelancers(transactionId);
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

export const getAllTransactions = async (): Promise<JobTransaction[] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
      const result = await job_transaction.getAllTransactions();
      return result;
    } catch (error) {
      console.error("Failed to get all transactions:", error);
      return null;
    }
  };

export const getTransactionByJob = async (jobId: string): Promise<JobTransaction | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.getTransactionByJobId(jobId);
        if ("ok" in res) {
            console.log("Transaction:", res.ok);
            return res.ok;
        }
        console.error("Failed to get transaction:", res.err);
        return null;
    } catch (error) {
        console.error("Failed to get transaction:", error);
        return null;
    }
}

export const getTransactionByClient = async (clientId: string): Promise<JobTransaction [] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.getTransactionByClientId(clientId);
        return res;
    } catch (error) {
        console.error("Failed to get transaction:", error);
        return null;
    }
}

export const getTransactionByFreelancer = async (freelancerId: string): Promise<JobTransaction [] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.getTransactionByFreelancerId(freelancerId);
        return res;
    } catch (error) {
        console.error("Failed to get transaction:", error);
        return null;
    }
}

export const getClientHistory = async (clientId: string): Promise<JobTransaction [] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.getClientHistory(clientId);
        return res;
    } catch (error) {
        console.error("Failed to get client history:", error);
        return null;
    }
}

export const getFreelancerHistory = async (freelancerId: string): Promise<JobTransaction [] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const res = await job_transaction.getFreelancerHistory(freelancerId);
        return res;
    } catch (error) {
        console.error("Failed to get freelancer history:", error);
        return null;
    }
}