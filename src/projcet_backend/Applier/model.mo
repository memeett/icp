import Int "mo:base/Int";
import Job "../Job/model";

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
    };

    public type UserApplyJobPayload = {
        job : Job.Job;
        isAccepted: Bool;
        appliedAt: Int;
    }
    
}