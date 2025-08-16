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
        jobProjectType: Text;
        jobSlots: Int;
        jobStatus: Text;
        jobExperimentLevel: Text;
        jobRequirementSkills: [Text];
        jobStartDate: Int;
        jobDeadline: Int;
        userId: Text;
        createdAt: Int;
        updatedAt: Int;
        wallet: Float;
    };

    public type Job_V2 = {
        id: Text;
        jobName: Text;
        jobDescription: [Text];
        jobSalary: Float;
        jobRating: Float;
        jobTags: [JobCategory];
        jobProjectType: Text;
        jobSlots: Int;
        jobStatus: Text;
        jobExperimentLevel: Text;
        jobRequirementSkills: [Text];
        jobStartDate: Int;
        jobDeadline: Int;
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
        jobProjectType: Text;
        jobSlots: Int;
        userId: Text;
        jobRequirementSkills: [Text];
        jobExperimentLevel: Text;
        jobStartDate: Int;
        jobDeadline: Int;
    };

    public type UpdateJobPayload = {
        jobName: Text;
        jobDescription: [Text];
        jobStartDate: Int;
        jobDeadline: Int;
    };
}