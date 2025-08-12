import { invitation } from "../../../declarations/invitation";
export const createInvitation = async (owner_id, job_id, freelancer_id) => {
    const result = await invitation.createInvitation(owner_id, job_id, freelancer_id, process.env.CANISTER_ID_JOB);
    if ("err" in result) {
        console.error("Error creating invitation:", result.err);
        return false;
    }
    console.log("Invitation created successfully:", result.ok);
    return true;
};
export const getInvitationByUserId = async (userId) => {
    const result = await invitation.getInvitationByUserID(userId, process.env.CANISTER_ID_JOB);
    return result;
};
export const acceptInvitation = async (userId, invitationId) => {
    const result = await invitation.acceptInvitation(userId, invitationId, process.env.CANISTER_ID_JOB, process.env.CANISTER_ID_JOB_TRANSACTION, process.env.CANISTER_ID_USER);
    return result;
};
export const rejectInvitation = async (userId, invitationId) => {
    const result = await invitation.rejectInvitation(userId, invitationId);
    return result;
};
