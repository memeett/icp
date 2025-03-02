import { applier } from "../../../declarations/applier";
import { ApplyPayload, UserApplyJobPayload } from "../../../declarations/applier/applier.did";
import { Job } from "../../../declarations/job/job.did";
import { User } from "../../../declarations/user/user.did";


export const applyJob = async (userId: string, jobId : string): Promise<boolean> => {
    try {
        const payload: ApplyPayload = { userId, jobId };
        const result = await applier.applyJob(payload);
        if ("ok" in result) {
            console.log("Applied for job:", result.ok);
            return true;
        } else {
            console.error("Error applying for job:", result.err);
            return false;
        }
    } catch (error) {
        console.error("Failed to apply for job:", error);
        return false;
    }
};

export const acceptApplier = async (applierIds: string[]): Promise<boolean> => {
    try {
        const result = await applier.AcceptApplier(applierIds);
        console.log("Accepted appliers:", result);
        return true;
    } catch (error) {
        console.error("Failed to accept appliers:", error);
        return false;
    }
}

export const getUserApply = async (userId: string): Promise<Job[] | null> => {
    try {
        const result = await applier.GetUserApply(userId);
        console.log("User applied jobs:", result);
        return result.map((job) => job.job);
    } catch (error) {
        console.error("Failed to get user applied jobs:", error);
        return null;
    }
}

export const getJobApplier = async (jobId: string): Promise<User[] | null> => {
    try {
        const result = await applier.getJobApplier(jobId);

        if ("ok" in result) {
            console.log("Job appliers:", result.ok);
            return result.ok;
        } else {
            console.error("Error getting job appliers:", result.err);
            return null;
        }
    } catch (error) {
        console.error("Failed to get job appliers:", error);
        return null;
    }
};

export const hasUserApplied = async (userId: string, jobId: string): Promise<boolean> => {
    const result = await applier.hasUserApplied(userId, jobId);
    return result;
}
