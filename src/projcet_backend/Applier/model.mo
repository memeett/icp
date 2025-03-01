import Int "mo:base/Int";
module{
    public type Applier = {
        id: Int;
        userId: Text;
        jobId: Text;
        appliedAt: Int;
        isAccepted: Bool;
    };

    public type ApplyPayload = {
        userId: Text;
        jobId: Text;
    }
}