<<<<<<< HEAD
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import { Submission, User } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
=======
import { AuthClient } from "@dfinity/auth-client";
import { submission } from "../../../declarations/submission";
import { ResponseSubmission, Submission } from "../../../declarations/submission/submission.did";
import { User } from "../../../declarations/user/user.did";
import { HttpAgent } from "@dfinity/agent";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import { agentService } from "../singleton/agentService";

export const createSubmission = async (
    jobId: string,
    user: any,
    submissionFilePath: string,
    submissionMessage: string
): Promise<string[]> => {
    try {

        if (typeof user.createdAt === 'string' && typeof user.updatedAt === 'string') {
            user.createdAt = BigInt(user.createdAt);
            user.updatedAt = BigInt(user.updatedAt);
        }

<<<<<<< HEAD
=======
        // Normalize profilePicture to Uint8Array as required by candid types
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        if (user.profilePicture instanceof Blob) {
            const ab = await user.profilePicture.arrayBuffer();
            user.profilePicture = new Uint8Array(ab);
        } else if (!user.profilePicture) {
            user.profilePicture = new Uint8Array([]);
        } else if (!(user.profilePicture instanceof Uint8Array)) {
            if (Array.isArray(user.profilePicture)) {
                user.profilePicture = new Uint8Array(user.profilePicture as number[]);
            } else if (typeof user.profilePicture === 'object') {
                const values = Object.values(user.profilePicture) as number[];
                user.profilePicture = new Uint8Array(values);
            } else if (typeof user.profilePicture === 'string') {
                user.profilePicture = new Uint8Array([]);
            } else {
                user.profilePicture = new Uint8Array([]);
            }
        }

<<<<<<< HEAD
        const result = await projcet_backend_single.createSubmission(jobId, user.id, submissionFilePath, submissionMessage);
=======
        // Cast to any to avoid stale TS type errors if editor hasn't reloaded generated declarations
        const result = await (submission as any).createSubmission(jobId, user, submissionFilePath, submissionMessage);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

        if ("ok" in result) {
            return ["Ok"];
        } else {
            throw new Error(result.err);
        }
    } catch (error) {
        throw new Error("Failed to create submission: " + error);
    }
};


<<<<<<< HEAD
export const getAllSubmissionbyUserJobId = async (user: User, jobId: string): Promise<Submission[]> => {
    const result = await projcet_backend_single.getAllSubmissions();

    const filteredSubmissions = result.filter(sub => 
        sub.userId === user.id && sub.jobId === jobId
=======
export const getAllSubmissionbyUserJobId = async (user: User, jobId: string): Promise<ResponseSubmission[]> => {
    const result = await submission.getAllSubmissions();

    const filteredSubmissions = result.filter(sub => 
        sub.user.id === user.id && sub.jobId === jobId
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    );

    return filteredSubmissions;
};

export const getFileSubmissionbyId = async (id: string): Promise<string | null> => {
    try {
<<<<<<< HEAD
        const res = await projcet_backend_single.getFileSubmissionbyId(id);
=======
        const res = await submission.getFileSubmissionbyId(id);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        if (res && res.length > 0 && typeof res[0] === 'string') {
            return res[0] as string;
        } else {
            return null;
        }
    } catch (err) {
        console.error('Error fetching file path:', err);
        return null;
    }
};

export const getSubmissionByJobId =  async (jobId: string): Promise<Submission[]> => {
    const agent = await agentService.getAgent();

    try {
        console.log("Submissions:");
<<<<<<< HEAD
        const result = await projcet_backend_single.getSubmissionByJobId(jobId);
=======
        const result = await submission.getSubmissionByJobId(jobId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        if ("ok" in result) {
            return result.ok;
        } else {
            throw new Error(result.err);
        }
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
}

export const updateSubmissionStatus = async (
    submissionId: string,
    newStatus: string,
    message: string
): Promise<string[]> => {
<<<<<<< HEAD
    const agent = await agentService.getAgent();
    try {
        const result = await projcet_backend_single.updateSubmissionStatus(submissionId, newStatus, message);
=======
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });
    
        if (process.env.DFX_NETWORK === "local") {
            await agent.fetchRootKey();
        }
    try {
        const result = await submission.updateSubmissionStatus(submissionId, newStatus, message);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

        if ("ok" in result) {
            return ["Ok"];
        } else {
            throw new Error(result.err);
        }
    } catch (error) {
        throw new Error("Failed to update submission status: " + error);
    }
};

export const getSubmissionAcceptbyUserId = async (userId: string): Promise<any[]> => {
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.getSubmissionAcceptbyUserId(userId);
=======
        const result = await submission.getSubmissionAcceptbyUserId(userId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by userId where status is "Waiting"
export const getSubmissionWaitingbyUserId = async (userId: string): Promise<any[]> => {
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.getSubmissionWaitingbyUserId(userId);
=======
        const result = await submission.getSubmissionWaitingbyUserId(userId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by userId where status is "Reject"
export const getSubmissionRejectbyUserId = async (userId: string): Promise<any[]> => {
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.getSubmissionRejectbyUserId(userId);
=======
        const result = await submission.getSubmissionRejectbyUserId(userId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by jobId where status is "Accept"
export const getSubmissionAcceptbyJobId = async (jobId: string): Promise<any[]> => {
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.getSubmissionAcceptbyJobId(jobId);
=======
        const result = await submission.getSubmissionAcceptbyJobId(jobId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by jobId where status is "Waiting"
export const getSubmissionWaitingbyJobId = async (jobId: string): Promise<any[]> => {
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.getSubmissionWaitingbyJobId(jobId);
=======
        const result = await submission.getSubmissionWaitingbyJobId(jobId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

// Get submissions by jobId where status is "Reject"
export const getSubmissionRejectbyJobId = async (jobId: string): Promise<any[]> => {
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.getSubmissionRejectbyJobId(jobId);
=======
        const result = await submission.getSubmissionRejectbyJobId(jobId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return result;
    } catch (error) {
        throw new Error("Failed to fetch submissions: " + error);
    }
};

export const getUserSubmissionsByJobId = async (jobId: string, userId: string): Promise<Submission[]> => {
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.getUserSubmissionsByJobId(jobId, userId);
=======
        const result = await submission.getUserSubmissionsByJobId(jobId, userId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return result;
    } catch (error) {
        throw new Error("Failed to fetch user submissions by job: " + error);
    }
};