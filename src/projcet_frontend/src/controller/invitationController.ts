import { UserInvitationPayload } from "../../../declarations/invitation/invitation.did";
import { invitation } from "../../../declarations/invitation";

export const createInvitation = async (
  job_id: string,
  freelancer_id: string,
  currentUserId: string
):  Promise<string[]> => {
    
      const checkInvitation = await invitation.getInvitationByUserIdAndJobId(currentUserId, job_id)
      if(checkInvitation == null) return ["Failed", "Error creating invitation."];

      const result = await invitation.createInvitation(
        String(currentUserId),
        job_id,
        freelancer_id,
        process.env.CANISTER_ID_JOB!
      );

      if ("err" in result) {
        console.error("Error creating invitation:", result.err);
        return ["Failed", result.err];
      }
  
      return ["Success", "Success creating invitaion"];
};

export const getInvitationByUserId = async (
  userId: string
): Promise<UserInvitationPayload[]> => {
  const result = await invitation.getInvitationByUserID(
    userId,
    process.env.CANISTER_ID_JOB!
  );

  return result;
};

export const acceptInvitation = async (
  userId: string,
  invitationId: bigint
): Promise<boolean> => {
  const result = await invitation.acceptInvitation(
    userId,
    invitationId,
    process.env.CANISTER_ID_JOB!,
    process.env.CANISTER_ID_JOB_TRANSACTION!,
    process.env.CANISTER_ID_USER!
  );

  return result;
};

export const rejectInvitation = async (
  userId: string,
  invitationId: bigint
): Promise<boolean> => {
  const result = await invitation.rejectInvitation(userId, invitationId);

  return result;
};
