import { UserInvitationPayload } from "../../../declarations/invitation/invitation.did";
import { invitation } from "../../../declarations/invitation";

export const getInvitationByUserId = async (userId: string): Promise<UserInvitationPayload[]> => {

    const result = await invitation.getInvitationByUserID(userId)

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