import { submission } from "../../../declarations/submission";
import { User } from "../../../declarations/user/user.did";

export const createSubmission = async (
    jobId: string,
    user: User,
    submissionFile: Blob,
    submissionMessage: string
): Promise<string[]> => {
    try {
        // Convert Blob to Uint8Array
        const arrayBuffer = await submissionFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const result = await submission.createSubmission(jobId, user, uint8Array, submissionMessage);

        if ("ok" in result) {
            return ["Ok"];
        } else {
            throw new Error(result.err);
        }
    } catch (error) {
        throw new Error("Failed to create submission: " + error);
    }
};

// Update submission status by ID
export const updateSubmissionStatus = async (
    submissionId: string,
    newStatus: string
): Promise<string[]> => {
    try {
        const result = await submission.updateSubmissionStatus(submissionId, newStatus);

        // Handle the result
        if ("ok" in result) {
            return ["Ok"];
        } else {
            throw new Error(result.err);
        }
    } catch (error) {
        throw new Error("Failed to update submission status: " + error);
    }
};

// Get submissions by userId where status is "Accept"
export const getSubmissionAcceptbyUserId = async (userId: string): Promise<any[]> => {
    try {
        const result = await submission.getSubmissionAcceptbyUserId(userId);
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by userId where status is "Waiting"
export const getSubmissionWaitingbyUserId = async (userId: string): Promise<any[]> => {
    try {
        const result = await submission.getSubmissionWaitingbyUserId(userId);
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by userId where status is "Reject"
export const getSubmissionRejectbyUserId = async (userId: string): Promise<any[]> => {
    try {
        const result = await submission.getSubmissionRejectbyUserId(userId);
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by jobId where status is "Accept"
export const getSubmissionAcceptbyJobId = async (jobId: string): Promise<any[]> => {
    try {
        const result = await submission.getSubmissionAcceptbyJobId(jobId);
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by jobId where status is "Waiting"
export const getSubmissionWaitingbyJobId = async (jobId: string): Promise<any[]> => {
    try {
        const result = await submission.getSubmissionWaitingbyJobId(jobId);
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by jobId where status is "Reject"
export const getSubmissionRejectbyJobId = async (jobId: string): Promise<any[]> => {
    try {
        const result = await submission.getSubmissionRejectbyJobId(jobId);
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};