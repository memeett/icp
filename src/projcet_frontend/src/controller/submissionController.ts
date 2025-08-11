import { AuthClient } from "@dfinity/auth-client";
import { submission } from "../../../declarations/submission";
import { ResponseSubmission, Submission } from "../../../declarations/submission/submission.did";
import { User } from "../../../declarations/user/user.did";
import { HttpAgent } from "@dfinity/agent";
import { agentService } from "../singleton/agentService";

export const createSubmission = async (
    jobId: string,
    user: User,
    submissionFile: Blob,
    submissionMessage: string
): Promise<string[]> => {
    try {

        const arrayBuffer = await submissionFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        
        // Ensure createdAt and updatedAt are bigint
        if (typeof user.createdAt === 'string' && typeof user.updatedAt === 'string') {
            user.createdAt = BigInt(user.createdAt);
            user.updatedAt = BigInt(user.updatedAt);
        }

        if (user.profilePicture && !(user.profilePicture instanceof Uint8Array)) {
            if (Array.isArray(user.profilePicture)) {
                user.profilePicture = new Uint8Array(user.profilePicture as number[]);
            } else if (typeof user.profilePicture === 'object') {
                const values = Object.values(user.profilePicture) as number[]; 
                user.profilePicture = new Uint8Array(values);
            } else {
                throw new Error("Invalid profilePicture format");
            }
        }


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


export const getAllSubmissionbyUserJobId = async (user: User, jobId: string): Promise<ResponseSubmission[]> => {
    const result = await submission.getAllSubmissions();

    const filteredSubmissions = result.filter(sub => 
        sub.user.id === user.id && sub.jobId === jobId
    );

    return filteredSubmissions;
};



export const getFileSubmissionbyId = async (id: string): Promise<Blob | null> => {
    try {
        const res = await submission.getFileSubmissionbyId(id);
        
        if (res && res.length > 0 && res[0] instanceof Uint8Array) {
            return new Blob([res[0]], { type: 'application/octet-stream' });
        } else if (res && res.length > 0 && Array.isArray(res[0])) {
            const uint8Array = new Uint8Array(res[0]);
            return new Blob([uint8Array], { type: 'application/octet-stream' });
        } else {
            return null;
        }
    } catch (err) {
        console.error('Error fetching file:', err);
        return null;
    }
};

// Update submission status by ID
export const getSubmissionByJobId =  async (jobId: string): Promise<Submission[]> => {
    const agent = await agentService.getAgent();

    try {
        console.log("Submissions:");
        const result = await submission.getSubmissionByJobId(jobId);
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
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });
    
        if (process.env.DFX_NETWORK === "local") {
            await agent.fetchRootKey();
        }
    try {
        const result = await submission.updateSubmissionStatus(submissionId, newStatus, message);

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