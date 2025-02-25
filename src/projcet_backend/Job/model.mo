module{
    public type Job = {
        id: Text;
        jobName: Text;
        jobDescription: Text;
        jobSalary: Float;
        jobRating: Float;
        jobTags: JobTags;
        jobSlots: Int;
        createdAt: Int;
        updatedAt: Int;
    };

    public type JobTags = {
        #web;
        #mobile;
        #desktop;
        #game;
        #ai;
        #iot;
    };

    public type CreateJobPayload = {
        jobName: Text;
        jobDescription: Text;
        jobSalary: Float;
        jobTags: JobTags;
        jobSlots: Int;
    };

    public type UpdateJobPayload = {
        jobName: ?Text;
        jobDescription: ?Text;
        jobSalary: ?Float;
        jobTags: ?JobTags;
        jobSlots: ?Int;
    };
}