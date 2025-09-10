<<<<<<< HEAD
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import { Job, User } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
import { ApplierPayload } from "../shared/types/Applier";
=======
import { AuthClient } from "@dfinity/auth-client";
import { applier } from "../../../declarations/applier";
import { ApplyPayload, UserApplyJobPayload } from "../../../declarations/applier/applier.did";
import { Job } from "../../../declarations/job/job.did";
import { User } from "../../../declarations/user/user.did";
import { ApplierPayload } from "../shared/types/Applier";
import { HttpAgent } from "@dfinity/agent";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import { agentService } from "../singleton/agentService";


export const applyJob = async (userId: string, jobId : string): Promise<boolean> => {
    const agent = await agentService.getAgent();
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.applyJob(userId, jobId);
=======
        const payload: ApplyPayload = { userId, jobId };
        const result = await applier.applyJob(payload, process.env.CANISTER_ID_JOB!);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        
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
<<<<<<< HEAD
    try {
        const result = await projcet_backend_single.acceptApplier(userId, jobId);
=======
    const payload: ApplyPayload = { userId, jobId };
    try {
        const result = await applier.acceptApplier(payload, process.env.CANISTER_ID_JOB_TRANSACTION!);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
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
    
<<<<<<< HEAD
    try {
        const result = await projcet_backend_single.rejectApplier(userId, jobId);
=======
    const payload: ApplyPayload = { userId, jobId };
    try {
        const result = await applier.rejectApplier(payload);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
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
<<<<<<< HEAD
        const result = await projcet_backend_single.getUserApply(userId);
        console.log("User applied jobs:", result);
        return result;
=======
        const result = await applier.getUserApply(userId, process.env.CANISTER_ID_JOB!);
        console.log("User applied jobs:", result);
        return result.map((job: any) => job.job);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    } catch (error) {
        console.error("Failed to get user applied jobs:", error);
        return null;
    }
}


export const hasUserApplied = async (userId: string, jobId: string): Promise<boolean> => {
<<<<<<< HEAD
    const result = await projcet_backend_single.hasUserApplied(userId, jobId);
=======
    const result = await applier.hasUserApplied(userId, jobId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    return result;
}
