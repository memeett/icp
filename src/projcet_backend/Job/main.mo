import Job "./model";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Option "mo:base/Option";

actor JobModel{
    private stable var nextId : Nat = 0;
    private stable var jobsEntries : [(Text, Job.Job)] = [];
    
    private var jobs = HashMap.fromIter<Text, Job.Job>(
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
        jobs := HashMap.fromIter<Text, Job.Job>(
            jobsEntries.vals(),
            0,
            Text.equal,
            Text.hash
        );
        jobsEntries := [];
    };

    public func createJob (payload : Job.CreateJobPayload) : async Result.Result<Job.Job, Text> {
        let jobId = Int.toText(nextId);
        let timestamp = Time.now();
        
        let newJob : Job.Job = {
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

    public query func getJob (jobId : Text) : async Result.Result<Job.Job, Text> {
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

    public query func getAllJobs() : async [Job.Job] {
        Iter.toArray(jobs.vals());
    };

    public func updateJob (jobId : Text, payload : Job.UpdateJobPayload) : async Result.Result<Job.Job, Text> {
        switch (jobs.get(jobId)) {
            case (?existingJob) {
                let updatedJob : Job.Job = {
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