import Text "mo:base/Text";
module{
    public type Invitation = {
        id: Int;
        user_id: Text;
        job_id: Text;
        invitedAt: Int;
    }
}