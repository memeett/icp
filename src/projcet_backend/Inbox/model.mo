import Text "mo:base/Text";
module{
    public type Inbox = {
        id: Text;
        receiverId: Text;
        senderId: Text;
        submission_type: Text;
        status: Text;
    };
}