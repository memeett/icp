import { ok } from "assert";
import { job_transaction } from "../../../declarations/job_transaction";
import { JobTransaction } from "../../../declarations/job_transaction/job_transaction.did";
import { List } from "../../../declarations/job_transaction/job_transaction.did";


export const createJobTransaction = async (ownerId: string, jobId: string ): Promise<boolean> => {
    try {
        const result = await job_transaction.createTransaction(ownerId, jobId);
        if ("ok" in result) {
            console.log("Created job transaction:", result.ok);
            return true;
        } else {
            console.error("Error creating job transaction:", result.err);
            return false;
        }
    } catch (error) {
        console.error("Failed to create job transaction:", error);
        return false;
    }
}

export const getJobTransactionByJobId = async (jobId: string): Promise<JobTransaction | null> => {
    try {
        const result = await job_transaction.getTransactionByJobId(jobId);
        console.log("Job transactions:", result);
        if ("ok" in result) {
            return result.ok;
        }
        return null;
    } catch (error) {
        console.error("Failed to get job transactions:", error);
        return null;
    }
}

export const getJobTransactionByTransactionId = async (transactionId: bigint): Promise<JobTransaction | null> => {
    try {
        const result = await job_transaction.getTransactionById(transactionId);
        console.log("Job transactions:", result);
        if ("ok" in result) {
            return result.ok;
        }
        return null;
    } catch (error) {
        console.error("Failed to get job transactions:", error);
        return null;
    }
}

const listToArray = (list: { [key: string]: any }[]): JobTransaction[] => {
    const result: JobTransaction[] = [];
    for (const item of list) {
        result.push(item as JobTransaction);
    }
    return result;
};

export const getJobTransactionByOwnerId = async (ownerId: string): Promise<JobTransaction[] | null> => {
    try {
        const result = await job_transaction.getTransactionByClientId(ownerId);
        console.log("Job transactions:", result);

        if ("ok" in result) {
            return result as JobTransaction[];
        } else {
            console.error("Failed to get job transactions:", result);
            return null;
        }
    } catch (error) {
        console.error("Failed to get job transactions:", error);
        return null;
    }
};

const ArrayToList = (list: { [key: string]: any }[]): String[] => {
    const result: String[] = [];
    for (const item of list) {
        result.push(item as String);
    }
    return result;
};

export const updateJobTransaction = async (transactionId: bigint, freelancers: string[]): Promise<boolean> => {
    try {
        const freelancersList: List = freelancers as List;

        const result = await job_transaction.updateTransaction(transactionId, freelancersList);
        console.log("Updated job transaction:", result);

        if ("ok" in result) {
            console.log("Transaction updated successfully:", result.ok);
            return true;
        } else {
            console.error("Failed to update transaction:", result.err);
            return false;
        }
    } catch (error) {
        console.error("Failed to update job transaction:", error);
        return false;
    }
};

export const getJobTransactionByFreelancerId = async (freelancerId: string): Promise<JobTransaction[] | null> => {
    try {
        const result = await job_transaction.getTransactionByFreelancerId(freelancerId);
        console.log("Job transactions:", result);

        if ("ok" in result) {
            return result as JobTransaction[];
        } else {
            console.error("Failed to get job transactions:", result);
            return null;
        }
    } catch (error) {
        console.error("Failed to get job transactions:", error);
        return null;
    }
};

export const getFreelancerHistory = async (freelancerId: string): Promise<JobTransaction[] | null> => {
    try {
        const result = await job_transaction.getFreelancerHistory(freelancerId);
        console.log("Job transactions:", result);

        if ("ok" in result) {
            return result as JobTransaction[];
        } else {
            console.error("Failed to get job transactions:", result);
            return null;
        }
    } catch (error) {
        console.error("Failed to get job transactions:", error);
        return null;
    }
}

export const getClientHistory = async (clientId: string): Promise<JobTransaction[] | null> => { 
    try {
        const result = await job_transaction.getClientHistory(clientId);
        console.log("Job transactions:", result);

        if ("ok" in result) {
            return result as JobTransaction[];
        } else {
            console.error("Failed to get job transactions:", result);
            return null;
        }
    } catch (error) {
        console.error("Failed to get job transactions:", error);
        return null;
    }
}