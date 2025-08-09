import { AuthClient } from "@dfinity/auth-client";
import { inbox } from "../../../declarations/inbox";
import { Inbox } from "../../../declarations/inbox/inbox.did";
import { HttpAgent } from "@dfinity/agent";
import { InboxResponse } from "../interface/Inbox";
import { user } from "../../../declarations/user";

export const createInbox = async (
  receiverId: string,
  senderId: string,
  submission_type: string,
  status: string
): Promise<Inbox | null> => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (process.env.DFX_NETWORK === "local") {
    await agent.fetchRootKey();
  }
  try {
    const result = await inbox.createInbox(
      receiverId,
      senderId,
      submission_type,
      status,
      "message"
    );
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
};

export const getInbox = async (inboxId: string): Promise<Inbox | null> => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (process.env.DFX_NETWORK === "local") {
    await agent.fetchRootKey();
  }
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
};

export const getAllInbox = async (): Promise<Inbox[] | null> => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (process.env.DFX_NETWORK === "local") {
    await agent.fetchRootKey();
  }
  try {
    const result = await inbox.getAllInbox();
    return result;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

export const getReceiverInbox = async (
  receiverId: string
): Promise<Inbox[] | null> => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (process.env.DFX_NETWORK === "local") {
    await agent.fetchRootKey();
  }
  try {
    const result = await inbox.getReceiverInbox(receiverId);
    return result;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

export const getSenderInbox = async (
  senderId: string
): Promise<Inbox[] | null> => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (process.env.DFX_NETWORK === "local") {
    await agent.fetchRootKey();
  }
  try {
    const result = await inbox.getSenderInbox(senderId);
    return result;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

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

export const getAllInboxByUserId = async (
  userId: string
): Promise<InboxResponse[] | null> => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (process.env.DFX_NETWORK === "local") {
    await agent.fetchRootKey();
  }
  try {
    const result = await inbox.getAllInboxByUserId(userId);
    const responses: InboxResponse[] = await Promise.all(
      result.map(async (i) => {
        const senderName = await user.getUsernameById(i.senderId);
        const receiverName = await user.getUsernameById(i.receiverId);
        // const submission_type = i.submission_type;
        // let message = "Invalid message";
        // console.log("lele" + submission_type);
        // if (
        //   submission_type.toLocaleLowerCase() ===
        //   "submission".toLocaleLowerCase()
        // ) {
        //   if (i.status === "request") {
        //     message = `You have a new submission request from ${senderName}`;
        //   } else if (i.status === "accepted") {
        //     message = `Your submission request has been accepted by ${senderName}`;
        //   } else if (i.status === "rejected") {
        //     message = `Your submission request has been rejected by ${senderName}`;
        //   }
        // } else if (
        //   submission_type.toLocaleLowerCase() ===
        //   "application".toLocaleLowerCase()
        // ) {
        //   if (i.status === "request") {
        //     message = `You have a new application request from ${senderName}`;
        //   } else if (i.status === "accepted") {
        //     message = `Your application request has been accepted by ${senderName}`;
        //   } else if (i.status === "rejected") {
        //     message = `Your application request has been rejected by ${senderName}`;
        //   }
        // } else if (
        //   submission_type.toLocaleLowerCase() ===
        //   "invitation".toLocaleLowerCase()
        // ) {
        //   if (i.status === "request") {
        //     message = `You have a new invitation request from ${senderName}`;
        //   } else if (i.status === "accepted") {
        //     message = `Your invitation request has been accepted by ${senderName}`;
        //   } else if (i.status === "rejected") {
        //     message = `Your invitation request has been rejected by ${senderName}`;
        //   }
        // }
        return {
          id: i.id,
          senderName: senderName,
          receiverName: receiverName,
          createdAt: new Date(
            Number(BigInt(i.createdAt) / BigInt(1_000_000))
          ).toLocaleString(),
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
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (process.env.DFX_NETWORK === "local") {
    await agent.fetchRootKey();
  }
  try {
    const result = await inbox.getAllInboxBySubmissionType(submissionType);
    return result;
  } catch (error) {
    console.error("Failed to get inbox:", error);
    return null;
  }
};

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
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  if (process.env.DFX_NETWORK === "local") {
    await agent.fetchRootKey();
  }
  try {
    const result = await inbox.markAsRead(inboxId);
    if ("ok" in result) {
      console.log("Marked inbox as read:", result.ok);
      return true;
    }
    console.error("Failed to mark inbox as read:", result.err);
    return false;
  } catch (error) {
    console.error("Failed to mark inbox as read:", error);
    return false;
  }
};

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
