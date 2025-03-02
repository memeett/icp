import Job "./model";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Array "mo:base/Array";

actor JobModel{
    private stable var nextId : Nat = 0;
    private stable var nextCategoryId : Nat = 0;

    private stable var jobsEntries : [(Text, Job.Job)] = [];
    private stable var jobCategoriesEntries : [(Text, Job.JobCategory)] = [];

    private var jobs = HashMap.fromIter<Text, Job.Job>(
        jobsEntries.vals(),
        0,
        Text.equal,
        Text.hash
    );

    private var jobCategories = HashMap.fromIter<Text, Job.JobCategory>(
        jobCategoriesEntries.vals(),
        0,
        Text.equal,
        Text.hash
    );

    // Save state before upgrade
    system func preupgrade() {
        jobsEntries := Iter.toArray(jobs.entries());
        jobCategoriesEntries := Iter.toArray(jobCategories.entries());
    };

    // Restore state after upgrade
    system func postupgrade() {
        jobs := HashMap.fromIter<Text, Job.Job>(
            jobsEntries.vals(),
            0,
            Text.equal,
            Text.hash
        );
        
        jobCategories := HashMap.fromIter<Text, Job.JobCategory>(
            jobCategoriesEntries.vals(),
            0,
            Text.equal,
            Text.hash
        );

        jobsEntries := [];
        jobCategoriesEntries := [];
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
            jobStatus = "Ongoing";
            userId = payload.userId; 
            createdAt = timestamp;
            updatedAt = timestamp;
        };

        jobs.put(jobId, newJob);
        nextId += 1;
        
        #ok(newJob);
    };

    public func createJobCategory(categoryName : Text) : async Result.Result<Job.JobCategory, Text> {
        let categoryId = Int.toText(nextCategoryId);
        
        let newCategory : Job.JobCategory = {
            id = categoryId;
            jobCategoryName = categoryName;
        };

        jobCategories.put(categoryId, newCategory);
        nextCategoryId += 1;
        
        #ok(newCategory);
    };

    public query func getJob (jobId : Text) : async Result.Result<Job.Job, Text> {
        switch (jobs.get(jobId)) {
            case (?job) { #ok(job) };
            case null { #err("Job not found") };
        }
    };

    public query func getJobCategory(categoryId : Text) : async Result.Result<Job.JobCategory, Text> {
        switch (jobCategories.get(categoryId)) {
            case (?category) { #ok(category) };
            case null { #err("Category not found") };
        }
    };

    public query func findJobCategoryByName(categoryName: Text) : async Result.Result<Job.JobCategory, Text> {
        let filteredCategories = Iter.toArray(Iter.filter<Job.JobCategory>(
            jobCategories.vals(), 
            func(category) { category.jobCategoryName == categoryName }
        ));

        if (filteredCategories.size() > 0) {
            #ok(filteredCategories[0])  
        } else {
            #err("Category not found")
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

    public query func getAllJobCategories() : async [Job.JobCategory] {
        Iter.toArray(jobCategories.vals());
    };


    public func updateJob (jobId : Text, payload : Job.UpdateJobPayload, jobStatus : Text) : async Result.Result<Job.Job, Text> {
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
                jobStatus = jobStatus;
                userId = Option.get(payload.userId, existingJob.userId);
                createdAt = existingJob.createdAt;
                updatedAt = Time.now();
                };
                
                jobs.put(jobId, updatedJob);
                #ok(updatedJob)
            };
            case null { #err("Job not found") };
        }
    };

    public func getUserJob(owner_id : Text): async [Job.Job] {
        // Get all jobs and filter by owner_id
        let allJobs = Iter.toArray(jobs.vals());
        let userJobs = Array.filter(allJobs, func(job : Job.Job) : Bool {
            return job.userId == owner_id;
        });
        
        userJobs
    };

}