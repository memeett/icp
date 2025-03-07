import { UserInvitationPayload } from "../../../declarations/invitation/invitation.did";
import { invitation } from "../../../declarations/invitation";

export const createInvitation = async (
    owner_id: string,
    job_id: string,
    freelancer_id: string
): Promise<boolean> => {
    const result = await invitation.createInvitation(owner_id, job_id, freelancer_id, process.env.CANISTER_ID_JOB!);

    if ("err" in result) {
        console.error("Error creating invitation:", result.err);
        return false; 
    }

    console.log("Invitation created successfully:", result.ok);
    return true; 
};


export const getInvitationByUserId = async (userId: string): Promise<UserInvitationPayload[]> => {

    const result = await invitation.getInvitationByUserID(userId, process.env.CANISTER_ID_JOB!)

    return result;
}


export const acceptInvitation = async (userId : string, invitationId : bigint) : Promise<boolean> => {

    const result = await invitation.acceptInvitation(userId, invitationId)

    return result
}


export const rejectInvitation = async (userId : string, invitationId : bigint) : Promise<boolean> => {

    const result = await invitation.rejectInvitation(userId, invitationId)

    return result
}