import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Option "mo:base/Option";
actor JobModel{
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

    private stable var nextId : Nat = 0;
    private stable var jobsEntries : [(Text, Job)] = [];
    
    private var jobs = HashMap.fromIter<Text, Job>(
        jobsEntries.vals(),
        0,
        Text.equal,
        Text.hash
    );

    // Save state before upgrade
    system func preupgrade() {
        jobsEntries := Iter.toArray(jobs.entries());
    };

    // Restore state after upgrade
    system func postupgrade() {
        jobs := HashMap.fromIter<Text, Job>(
            jobsEntries.vals(),
            0,
            Text.equal,
            Text.hash
        );
        jobsEntries := [];
    };

    type CreateJobPayload = {
        jobName: Text;
        jobDescription: Text;
        jobSalary: Float;
        jobTags: JobTags;
        jobSlots: Int;
    };

    public func createJob (payload : CreateJobPayload) : async Result.Result<Job, Text> {
        let jobId = Int.toText(nextId);
        let timestamp = Time.now();
        
        let newJob : Job = {
            id = jobId;
            jobName = payload.jobName;
            jobDescription = payload.jobDescription;
            jobSalary = payload.jobSalary;
            jobRating = 0.0;
            jobTags = payload.jobTags;
            jobSlots = payload.jobSlots;
            createdAt = timestamp;
            updatedAt = timestamp;
        };

        jobs.put(jobId, newJob);
        nextId += 1;
        
        #ok(newJob);
    };

    public query func getJob (jobId : Text) : async Result.Result<Job, Text> {
        switch (jobs.get(jobId)) {
            case (?job) { #ok(job) };
            case null { #err("Job not found") };
        }
    };

    //Delete Job
     public func deleteJob (jobId : Text) : async Result.Result<(), Text> {
        switch (jobs.get(jobId)) {
        case (?_) { 
            jobs.delete(jobId);
            #ok(())
        };
        case null { #err("Job not found") };
        }
    };

  //Get All Jobs
    public query func getAllJobs() : async [Job] {
        Iter.toArray(jobs.vals());
    };

    public type UpdateJobPayload = {
        jobName: ?Text;
        jobDescription: ?Text;
        jobSalary: ?Float;
        jobTags: ?JobTags;
        jobSlots: ?Int;
    };

    public func updateJob (jobId : Text, payload : UpdateJobPayload) : async Result.Result<Job, Text> {
        switch (jobs.get(jobId)) {
            case (?existingJob) {
                let updatedJob : Job = {
                id = existingJob.id;
                jobName = Option.get(payload.jobName, existingJob.jobName);
                jobDescription = Option.get(payload.jobDescription, existingJob.jobDescription);
                jobSalary = Option.get(payload.jobSalary, existingJob.jobSalary);
                jobRating = existingJob.jobRating;
                jobTags = Option.get(payload.jobTags, existingJob.jobTags);
                jobSlots = Option.get(payload.jobSlots, existingJob.jobSlots);
                createdAt = existingJob.createdAt;
                updatedAt = Time.now();
                };
                
                jobs.put(jobId, updatedJob);
                #ok(updatedJob)
            };
            case null { #err("Job not found") };
        }
    };

}