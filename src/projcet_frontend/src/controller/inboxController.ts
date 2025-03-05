import { inbox } from "../../../declarations/inbox";
import { Inbox } from "../../../declarations/inbox/inbox.did";

export const createInbox = async (senderId : string, receiverId : string,submission_type:string, status:string): Promise<Inbox | null> => {
    try {
        const result = await inbox.createInbox(senderId, receiverId, submission_type, status);
        if ("ok" in result) {
            console.log("Created inbox:", result.ok);
            return result.ok;
        }
        console.error("Failed to create inbox:", result.err);
        return null;
    } catch (error) {
        console.error("Failed to create inbox:", error);
        return null;
    }
}

export const getInbox = async (inboxId: string): Promise<Inbox | null> => {
    try {
        const result = await inbox.getInbox(inboxId);
        if ("ok" in result) {
            console.log("Inbox:", result.ok);
            return result.ok;
        }
        console.error("Failed to get inbox:", result.err);
        return null;
    } catch (error) {
        console.error("Failed to get inbox:", error);
        return null;
    }
}

export const getAllInbox = async (): Promise<Inbox[] | null> => {
    try {
        const result = await inbox.getAllInbox();
        if ("ok" in result) {
            return result;
        }
        return null;
    } catch (error) {
        console.error("Failed to get inbox:", error);
        return null;
    }
}

export const getReceiverInbox = async (receiverId: string): Promise<Inbox[] | null> => {
    try {
        const result = await inbox.getReceiverInbox(receiverId);
        if ("ok" in result) {
            return result;
        }
        return null;
    } catch (error) {
        console.error("Failed to get inbox:", error);
        return null;
    }
}

export const getSenderInbox = async (senderId: string): Promise<Inbox[] | null> => {
    try {
        const result = await inbox.getSenderInbox(senderId);
        if ("ok" in result) {
            return result;
        }
        return null;
    } catch (error) {
        console.error("Failed to get inbox:", error);
        return null;
    }
}

export const updateInbox = async (inboxId: string, status: string): Promise<boolean> => {
    try {
        const result = await inbox.updateInboxStatus(inboxId, status);
        if ("ok" in result) {
            console.log("Updated inbox:", result.ok);
            return true;
        }
        console.error("Failed to update inbox:", result.err);
        return false;
    } catch (error) {
        console.error("Failed to update inbox:", error);
        return false;
    }
}

export const getAllInboxByStatus = async (status: string): Promise<Inbox[] | null> => {
    try {
        const result = await inbox.getAllInboxByStatus(status);
        if ("ok" in result) {
            return result;
        }
        return null;
    } catch (error) {
        console.error("Failed to get inbox:", error);
        return null;
    }
}

export const getAllInboxByUserId = async (userId: string): Promise<Inbox[] | null> => {
    try {
        const result = await inbox.getAllInboxByUserId(userId);
        if ("ok" in result) {
            return result;
        }
        return null;
    } catch (error) {
        console.error("Failed to get inbox:", error);
        return null;
    }
}

export const getAllInboxBySubmissionType = async (submissionType: string): Promise<Inbox[] | null> => {
    try {
        const result = await inbox.getAllInboxBySubmissionType(submissionType);
        if ("ok" in result) {
            return result;
        }
        return null;
    } catch (error) {
        console.error("Failed to get inbox:", error);
        return null;
    }
}

export const acceptInbox = async (inboxId: string): Promise<boolean> => {
    try {
        const result = await inbox.acceptInbox(inboxId);
        if ("ok" in result) {
            console.log("Accepted inbox:", result.ok);
            return true;
        }
        console.error("Failed to accept inbox:", result.err);
        return false;
    } catch (error) {
        console.error("Failed to accept inbox:", error);
        return false;
    }
}

export const rejectInbox = async (inboxId: string): Promise<boolean> => {
    try {
        const result = await inbox.rejectInbox(inboxId);
        if ("ok" in result) {
            console.log("Rejected inbox:", result.ok);
            return true;
        }
        console.error("Failed to reject inbox:", result.err);
        return false;
    } catch (error) {
        console.error("Failed to reject inbox:", error);
        return false;
    }
}





