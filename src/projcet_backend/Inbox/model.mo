import Text "mo:base/Text";
import Time "mo:base/Time";
module{
    public type Inbox = {
        id: Text;
        receiverId: Text;
        senderId: Text;
        submission_type: Text;
        status: Text;
        read: Bool;
        createdAt: Time.Time;
    };
}