import Text "mo:base/Text";
import Float "mo:base/Float";
module{
    public type Job = {
        id: Text;
        jobName: Text;
        jobDescription: [Text];
        jobSalary: Float;
        jobRating: Float;
        jobTags: [JobCategory];
        jobSlots: Int;
        jobStatus: Text;
        userId: Text;
        createdAt: Int;
        updatedAt: Int;
        wallet: Float;
    };

    public type JobCategory = {
        id: Text;
        jobCategoryName: Text;
    };

    public type CreateJobPayload = {
        jobName: Text;
        jobDescription: [Text];
        jobSalary: Float;
        jobTags: [JobCategory];
        jobSlots: Int;
        userId: Text;
    };

    public type UpdateJobPayload = {
        jobName: ?Text;
        jobDescription: ?[Text];
        jobSalary: ?Float;
        jobTags: ?[JobCategory];
        jobSlots: ?Int;
        userId: ?Text;
    };
}