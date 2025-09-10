<<<<<<< HEAD
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import { Invitation } from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
=======
import { UserInvitationPayload } from "../../../declarations/invitation/invitation.did";
import { invitation } from "../../../declarations/invitation";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

export const createInvitation = async (
  job_id: string,
  freelancer_id: string,
  currentUserId: string
):  Promise<string[]> => {
    
<<<<<<< HEAD
      const checkInvitation = await projcet_backend_single.getInvitationByUserIdAndJobId(currentUserId, job_id)
      if(checkInvitation.length > 0) return ["Failed", "Invitation already exists."];

      const result = await projcet_backend_single.createInvitation(
        String(currentUserId),
        job_id,
        freelancer_id,
=======
      const checkInvitation = await invitation.getInvitationByUserIdAndJobId(currentUserId, job_id)
      if(checkInvitation == null) return ["Failed", "Error creating invitation."];

      const result = await invitation.createInvitation(
        String(currentUserId),
        job_id,
        freelancer_id,
        process.env.CANISTER_ID_JOB!
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      );

      if ("err" in result) {
        console.error("Error creating invitation:", result.err);
        return ["Failed", result.err];
      }
  
      return ["Success", "Success creating invitaion"];
};

export const getInvitationByUserId = async (
  userId: string
<<<<<<< HEAD
): Promise<Invitation[]> => {
  const result = await projcet_backend_single.getInvitationByUserID(
    userId,
=======
): Promise<UserInvitationPayload[]> => {
  const result = await invitation.getInvitationByUserID(
    userId,
    process.env.CANISTER_ID_JOB!
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
  );

  return result;
};

export const acceptInvitation = async (
  userId: string,
  invitationId: bigint
): Promise<boolean> => {
<<<<<<< HEAD
  const result = await projcet_backend_single.acceptInvitation(
    userId,
    invitationId,
=======
  const result = await invitation.acceptInvitation(
    userId,
    invitationId,
    process.env.CANISTER_ID_JOB!,
    process.env.CANISTER_ID_JOB_TRANSACTION!,
    process.env.CANISTER_ID_USER!
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
  );

  return result;
};

export const rejectInvitation = async (
  userId: string,
  invitationId: bigint
): Promise<boolean> => {
<<<<<<< HEAD
  const result = await projcet_backend_single.rejectInvitation(userId, invitationId);
=======
  const result = await invitation.rejectInvitation(userId, invitationId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

  return result;
};
