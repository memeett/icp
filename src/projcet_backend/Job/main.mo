import Job "./model";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Float "mo:base/Float";
import List "mo:base/List";
import JobTransaction "../JobTransaction/model";
import Global "../global";

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

    let jobTransactionActor = actor (Global.canister_id.job_transaction) : actor {
        getTransactionByJobId(job_id : Text) : async Result.Result<JobTransaction.JobTransaction, Text>;
        createTransaction: (owner_id : Text, job_id : Text) -> async ()
    }; 

    let userActor = actor(Global.canister_id.user) : actor{
        transfer_icp_to_job:(user_id: Text, job_id: Text, amount: Float) -> async Result.Result<Text, Text>;
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
            wallet = 0;
        };

        jobs.put(jobId, newJob);
        nextId += 1;
        
        await jobTransactionActor.createTransaction(payload.userId, jobId);
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

    public shared func putJob(job_id: Text, job: Job.Job) : async () {
        jobs.put(job_id, job);
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
                wallet = existingJob.wallet;
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

    public shared func startJob(user_id: Text, job_id: Text, amount: Float): async Bool {
        switch (jobs.get(job_id)) {
            case (?existingJob) {
                // Validate if the current user is the owner of the job
                if (user_id != existingJob.userId) {
                    return false;
                };

                // Get job transaction to determine how many freelancers have been accepted.
                let transactionResult = await jobTransactionActor.getTransactionByJobId(job_id);
                switch (transactionResult) {
                    case (#ok(transaction)) {
                        // Count the number of accepted freelancers using a fold function.
                        let numAccepted : Nat = List.foldRight<Text, Nat>(
                            transaction.freelancers,
                            0,
                            func (_: Text, acc: Nat) { acc + 1 }
                        );
                        // Calculate the required amount as jobSalary * number of accepted freelancers.
                        let requiredAmount = existingJob.jobSalary * Float.fromInt(numAccepted);
                        if (amount < requiredAmount) {
                            return false;
                        };
                        
                        // Call transfer_icp_to_job and check its result.
                        let transferResult = await userActor.transfer_icp_to_job(user_id, job_id, amount);
                        switch (transferResult) {
                            case (#ok(_msg)) { return true; };
                            case (#err(_err)) { return false; };
                        }
                    };
                    case (#err(_err)) {
                        // If there's no transaction record, assume no accepted freelancers.
                        // Then requiredAmount is zero.
                        if (amount < 0.0) {
                            return false;
                        };
                        let transferResult = await userActor.transfer_icp_to_job(user_id, job_id, amount);
                        switch (transferResult) {
                            case (#ok(_msg)) { return true; };
                            case (#err(_err)) { return false; };
                        }
                    };
                }
            };
            case null { return false; };
        }
    };


}