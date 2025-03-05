import Blob "mo:base/Blob";
import Job "../Job/model";

module{
    public type User = {
        id: Text;
        profilePicture: Blob;
        username: Text;
        dob: Text;
        preference: [Job.JobCategory];
        description: Text;
        wallet: Float;
        rating: Float;
        createdAt: Int;
        updatedAt: Int;
        isFaceRecognitionOn: Bool;
    };

    public type UpdateUserPayload = {
        username: ?Text;
        profilePicture: ?Blob;
        description: ?Text;
        dob : ?Text;
        preference: ?[Job.JobCategory];
    };

    public type TransactionType = {
        #topUp;
        #transfer;
    };

    public type CashFlowHistory = {
        userId: Text;
        transactionAt: Int;
        amount: Float;
        transactionType: TransactionType;
        toUserId: ?Text; // `null` for top-ups, recipient's ID for transfers
    };


}