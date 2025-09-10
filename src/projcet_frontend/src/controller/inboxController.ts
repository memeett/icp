<<<<<<< HEAD
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import { Inbox } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
import { InboxResponse } from "../shared/types/Inbox";
=======
import { AuthClient } from "@dfinity/auth-client";
import { inbox } from "../../../declarations/inbox";
import { Inbox } from "../../../declarations/inbox/inbox.did";
import { HttpAgent } from "@dfinity/agent";
import { InboxResponse } from "../shared/types/Inbox";
import { user } from "../../../declarations/user";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import { agentService } from "../singleton/agentService";
import { formatDate } from "../utils/dateUtils";

export const createInbox = async (
  receiverId: string,
  jobId: string,
  senderId: string,
  inbox_type: string,
  message: string
): Promise<Inbox | null> => {
 const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.createInbox(
=======
    const result = await inbox.createInbox(
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      receiverId,
      jobId,
      senderId,
      inbox_type,
      message,
    );
    if ("ok" in result) {
      return result.ok;
    }
    console.error("Failed to create inbox:", result.err);
    return null;
  } catch (error) {
    console.error("Failed to create inbox:", error);
    return null;
  }
};

export const getInbox = async (inboxId: string): Promise<Inbox | null> => {
 const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getInbox(inboxId);
=======
    const result = await inbox.getInbox(inboxId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    if ("ok" in result) {
      return result.ok;
    }
    console.error("Failed to get inbox:", result.err);
    return null;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

export const getAllInbox = async (): Promise<Inbox[] | null> => {
 const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getAllInbox();
=======
    const result = await inbox.getAllInbox();
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    return result;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

export const getReceiverInbox = async (
  receiverId: string
): Promise<Inbox[] | null> => {
 const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getReceiverInbox(receiverId);
=======
    const result = await inbox.getReceiverInbox(receiverId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    return result;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

export const getSenderInbox = async (
  senderId: string
): Promise<Inbox[] | null> => {
 const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getSenderInbox(senderId);
=======
    const result = await inbox.getSenderInbox(senderId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    return result;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

<<<<<<< HEAD
=======
// export const updateInbox = async (
//   inboxId: string,
//   status: string
// ): Promise<boolean> => {
//   const authClient = await AuthClient.create();
//   const identity = authClient.getIdentity();
//   const agent = new HttpAgent({ identity });

//   if (process.env.DFX_NETWORK === "local") {
//     await agent.fetchRootKey();
//   }
//   try {
//     const result = await inbox.updateInboxStatus(inboxId, status);
//     if ("ok" in result) {
//       console.log("Updated inbox:", result.ok);
//       return true;
//     }
//     console.error("Failed to update inbox:", result.err);
//     return false;
//   } catch (error) {
//     console.error("Failed to update inbox:", error);
//     return false;
//   }
// };

// export const getAllInboxByStatus = async (
//   status: string
// ): Promise<Inbox[] | null> => {
//   const authClient = await AuthClient.create();
//   const identity = authClient.getIdentity();
//   const agent = new HttpAgent({ identity });

//   if (process.env.DFX_NETWORK === "local") {
//     await agent.fetchRootKey();
//   }
//   try {
//     const result = await inbox.getAllInboxByStatus(status);
//     return result;
//   } catch (error) {
//     console.error("Failed to get inbox:", error);
//     return null;
//   }
// };

>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
export const getAllInboxByUserId = async (
  userId: string
): Promise<InboxResponse[] | null> => {
  const agent = await agentService.getAgent();
  try {
    console.log("Fetching inbox for user:", userId);
<<<<<<< HEAD
    const result = await projcet_backend_single.getAllInboxByUserId(userId);
    console.log("Inbox Result:", result);
    const responses: InboxResponse[] = await Promise.all(
      result.map(async (i) => {
        const senderResult = await projcet_backend_single.getUserById(i.senderId);
        const receiverResult = await projcet_backend_single.getUserById(i.receiverId);
        
        const senderName = "ok" in senderResult ? senderResult.ok.username : "";
        const receiverName = "ok" in receiverResult ? receiverResult.ok.username : "";

=======
    const result = await inbox.getAllInboxByUserId(userId);
    console.log("Inbox Result:", result);
    const responses: InboxResponse[] = await Promise.all(
      result.map(async (i) => {
        const senderName = await user.getUsernameById(i.senderId);
        const receiverName = await user.getUsernameById(i.receiverId);
        
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return {
          id: i.id,
          jobId: i.jobId,
          senderId: i.senderId,
          receiverId: i.receiverId,
          senderName: senderName,
          receiverName: receiverName,
          createdAt: formatDate(i.createdAt),
          read: i.read,
          message: i.message,
        };
      })
    );
    return responses;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

export const getAllInboxBySubmissionType = async (
  submissionType: string
): Promise<Inbox[] | null> => {
 const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getAllInboxBySubmissionType(submissionType);
=======
    const result = await inbox.getAllInboxBySubmissionType(submissionType);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    return result;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

export const getInboxMessagesFromAppliers = async (
  jobId: string,
  userId: string
): Promise<any[]> => {
  const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getInboxMessagesFromAppliers(jobId, userId);
      const responses: InboxResponse[] = await Promise.all(
      result.map(async (i) => {
        const senderResult = await projcet_backend_single.getUserById(i.senderId);
        const receiverResult = await projcet_backend_single.getUserById(i.receiverId);
        
        const senderName = "ok" in senderResult ? senderResult.ok.username : "";
        const receiverName = "ok" in receiverResult ? receiverResult.ok.username : "";
=======
    const result = await inbox.getInboxMessagesFromAppliers(jobId, userId);
      const responses: InboxResponse[] = await Promise.all(
      result.map(async (i) => {
        const senderName = await user.getUsernameById(i.senderId);
        const receiverName = await user.getUsernameById(i.receiverId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        
        return {
          id: i.id,
          jobId: i.jobId,
          senderId: i.senderId,
          receiverId: i.receiverId,
          senderName: senderName,
          receiverName: receiverName,
          createdAt: formatDate(i.createdAt),
          read: i.read,
          message: i.message,
        };
      })
    );
    return responses;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return [] ;
  }
};

<<<<<<< HEAD
export const markInboxAsRead = async (inboxId: string): Promise<boolean> => {
 const agent = await agentService.getAgent();
  try {
    const result = await projcet_backend_single.markAsRead(inboxId);
=======
// export const acceptInbox = async (inboxId: string): Promise<boolean> => {
//   const authClient = await AuthClient.create();
//   const identity = authClient.getIdentity();
//   const agent = new HttpAgent({ identity });

//   if (process.env.DFX_NETWORK === "local") {
//     await agent.fetchRootKey();
//   }
//   try {
//     const result = await inbox.acceptInbox(inboxId);
//     if ("ok" in result) {
//       console.log("Accepted inbox:", result.ok);
//       return true;
//     }
//     console.error("Failed to accept inbox:", result.err);
//     return false;
//   } catch (error) {
//     console.error("Failed to accept inbox:", error);
//     return false;
//   }
// };

// export const rejectInbox = async (inboxId: string): Promise<boolean> => {
//   const authClient = await AuthClient.create();
//   const identity = authClient.getIdentity();
//   const agent = new HttpAgent({ identity });

//   if (process.env.DFX_NETWORK === "local") {
//     await agent.fetchRootKey();
//   }
//   try {
//     const result = await inbox.rejectInbox(inboxId);
//     if ("ok" in result) {
//       console.log("Rejected inbox:", result.ok);
//       return true;
//     }
//     console.error("Failed to reject inbox:", result.err);
//     return false;
//   } catch (error) {
//     console.error("Failed to reject inbox:", error);
//     return false;
//   }
// };

export const markInboxAsRead = async (inboxId: string): Promise<boolean> => {
 const agent = await agentService.getAgent();
  try {
    const result = await inbox.markAsRead(inboxId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    if ("ok" in result) {
      return true;
    }
    console.error("Failed to mark inbox as read:", result.err);
    return false;
  } catch (error) {
    console.error("Failed to mark inbox as read:", error);
    return false;
  }
};
<<<<<<< HEAD
=======

// export const updateInboxStatus = async (
//   inboxId: string,
//   status: string
// ): Promise<boolean> => {
//   const authClient = await AuthClient.create();
//   const identity = authClient.getIdentity();
//   const agent = new HttpAgent({ identity });

//   if (process.env.DFX_NETWORK === "local") {
//     await agent.fetchRootKey();
//   }
//   try {
//     const result = await inbox.updateInboxStatus(inboxId, status);
//     if ("ok" in result) {
//       console.log("Updated inbox status:", result.ok);
//       return true;
//     }
//     console.error("Failed to update inbox status:", result.err);
//     return false;
//   } catch (error) {
//     console.error("Failed to update inbox status:", error);
//     return false;
//   }
// };
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
