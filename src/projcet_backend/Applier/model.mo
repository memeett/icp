import Int "mo:base/Int";
import Job "../Job/model";
import User "../User/model";

module{
    public type Applier = {
        id: Int;
        userId: Text;
        jobId: Text;
        appliedAt: Int;
        status: Text;
    };

    public type ApplyPayload = {
        userId: Text;
        jobId: Text;
    };

    public type UserApplyJobPayload = {
        job : Job.Job;
        status: Text;
        appliedAt: Int;
    };
    
    public type ApplierPayload = {
        user: User.User;
        appliedAt: Int;
    };
}