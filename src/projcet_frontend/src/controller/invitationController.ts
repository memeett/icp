import { UserInvitationPayload } from "../../../declarations/invitation/invitation.did";
import { invitation } from "../../../declarations/invitation";

export const getInvitationByUserId = async (userId: string): Promise<UserInvitationPayload[]> => {

    const result = await invitation.getInvitationByUserID(userId)

    return result;
}