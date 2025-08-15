import { AuthClient } from "@dfinity/auth-client";
import { applier } from "../../../declarations/applier";
import { ApplyPayload, UserApplyJobPayload } from "../../../declarations/applier/applier.did";
import { Job } from "../../../declarations/job/job.did";
import { User } from "../../../declarations/user/user.did";
import { ApplierPayload } from "../shared/types/Applier";
import { HttpAgent } from "@dfinity/agent";
import { agentService } from "../singleton/agentService";


export const applyJob = async (userId: string, jobId : string): Promise<boolean> => {
    const agent = await agentService.getAgent();
    try {
        const payload: ApplyPayload = { userId, jobId };
        const result = await applier.applyJob(payload, process.env.CANISTER_ID_JOB!);
        
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

export const acceptApplier = async (userId: string, jobId: string): Promise<boolean> => {
    const agent = await agentService.getAgent();
    const payload: ApplyPayload = { userId, jobId };
    try {
        const result = await applier.acceptApplier(payload, process.env.CANISTER_ID_JOB_TRANSACTION!);
        if ("ok" in result) {
            return true; // Success: Applier was accepted
        } else {
            console.error("Failed to accept applier:", result.err);
            return false; // Failure: Handle the error
        }
    } catch (error) {
        console.error("Unexpected error while accepting applier:", error);
        return false; // Failure: Handle unexpected errors
    }
};

export const rejectApplier = async (userId: string, jobId: string): Promise<boolean> => {
    const agent = await agentService.getAgent();
    
    const payload: ApplyPayload = { userId, jobId };
    try {
        const result = await applier.rejectApplier(payload);
        if ("ok" in result) {
            return true; // Success: Applier was rejected
        } else {
            console.error("Failed to reject applier:", result.err);
            return false; // Failure: Handle the error
        }
    } catch (error) {
        console.error("Unexpected error while rejecting applier:", error);
        return false; // Failure: Handle unexpected errors
    }
};

export const getUserApply = async (userId: string): Promise<Job[] | null> => {
    const agent = await agentService.getAgent();
    try {
        const result = await applier.getUserApply(userId, process.env.CANISTER_ID_JOB!);
        console.log("User applied jobs:", result);
        return result.map((job: any) => job.job);
    } catch (error) {
        console.error("Failed to get user applied jobs:", error);
        return null;
    }
}


export const hasUserApplied = async (userId: string, jobId: string): Promise<boolean> => {
    const result = await applier.hasUserApplied(userId, jobId);
    return result;
}
