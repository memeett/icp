import Text "mo:base/Text";
import Bool "mo:base/Bool";
import Job "../Job/model";
import User "../User/model";

module{
    public type Invitation = {
        id: Int;
        user_id: Text;
        job_id: Text;
        invitedAt: Int;
        isAccepted : Bool;
    };

    public type UserInvitationPayload = {
        job : Job.Job;
        invitedAt: Int;
    };

    public type JobInvitationPayload = {
        user : User.User;
        isAccepted : Bool;
    }
}