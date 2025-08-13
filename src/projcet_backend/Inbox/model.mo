import Text "mo:base/Text";
import Time "mo:base/Time";
module{
    public type Inbox = {
        id: Text;
        receiverId: Text;
        senderId: Text;
        jobId: Text;
        inbox_type: Text;
        message: Text;
        read: Bool;
        createdAt: Time.Time;
    };
}