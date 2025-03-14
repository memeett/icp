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
import Debug "mo:base/Debug";

import JobTransaction "../JobTransaction/model";

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
        seedJobCategories();
    };

    
    
private func seedJobCategories() {
    let defaultCategories = [
        "Software Development",
        "Graphic Design",
        "Marketing",
        "Customer Support",
        "Data Analysis",
        "Web Development",
        "Mobile App Development",
        "UI/UX Design",
        "Project Management",
        "Content Writing",
        "Social Media Management",
        "SEO Optimization",
        "Cybersecurity",
        "Cloud Computing",
        "DevOps",
        "Artificial Intelligence",
        "Blockchain Development",
        "Game Development",
        "Technical Writing",
        "IT Support",
    ];

    for (categoryName in defaultCategories.vals()) {
        var categoryExists = false;
        for (category in jobCategories.vals()) {
            if (category.jobCategoryName == categoryName) {
                categoryExists := true;
                return;
            };
        };

        // If the category does not exist, add it
        if (not categoryExists) {
            let categoryId = Int.toText(nextCategoryId);
            let newCategory : Job.JobCategory = {
                id = categoryId;
                jobCategoryName = categoryName;
            };
            jobCategories.put(categoryId, newCategory);
            nextCategoryId += 1;
        };
    };
};
    

    public func createJob (payload : Job.CreateJobPayload, job_transaction_canister: Text, job_canister: Text) : async Result.Result<Job.Job, Text> {
        let jobTransactionActor = actor (job_transaction_canister) : actor {
            createTransaction: (owner_id : Text, job_id : Text, job_canister: Text) -> async ()
        };

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
            jobStatus = "Start";
            userId = payload.userId; 
            createdAt = timestamp;
            updatedAt = timestamp;
            wallet = 0;
        };

        jobs.put(jobId, newJob);
        nextId += 1;
        
        await jobTransactionActor.createTransaction(payload.userId, jobId, job_canister);
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
        let allJobs = Iter.toArray(jobs.vals());
        let userJobs = Array.filter(allJobs, func(job : Job.Job) : Bool {
            return job.userId == owner_id;
        });
        
        userJobs
    };

    public func getUserJobByStatusFinished(owner_id : Text): async [Job.Job] {
        let allJobs = Iter.toArray(jobs.vals());
        let userJobs = Array.filter(allJobs, func(job : Job.Job) : Bool {
            return job.userId == owner_id and job.jobStatus == "Finished";
        });
        
        userJobs
    };

    public shared func startJob(user_id: Text, job_id: Text, job_canister: Text, job_transaction_canister: Text, user_canister: Text): async Result.Result<Bool, Text> {
        let jobTransactionActor = actor (job_transaction_canister) : actor {
            getTransactionByJobId(job_id : Text) : async Result.Result<JobTransaction.JobTransaction, Text>;
        };
        let userActor = actor(user_canister) : actor {
            transfer_icp_to_job:(user_id: Text, job_id: Text, amount: Float, job_canister: Text) -> async Result.Result<Text, Text>;
        };

        switch (jobs.get(job_id)) {
            case (?existingJob) {
                if (existingJob.jobStatus == "Ongoing") {
                    return #err("Job is already ongoing");
                };
                // Validate if the current user is the owner of the job
                if (user_id != existingJob.userId) {
                    return #err("User is not the owner of the job");
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

                        // Check if no freelancers have been accepted
                        if (numAccepted == 0) {
                            return #err("No freelancers have been accepted for this job");
                        };

                        // Calculate the required amount as jobSalary * number of accepted freelancers.
                        let requiredAmount = existingJob.jobSalary * Float.fromInt(numAccepted);
                
                        // Call transfer_icp_to_job and check its result.
                        let transferResult = await userActor.transfer_icp_to_job(user_id, job_id, requiredAmount, job_canister);
                        switch (transferResult) {
                            case (#ok(_msg)) { 
                                return #ok(true); 
                            };
                            case (#err(errMsg)) { 
                                return #err("Transfer failed: " # errMsg); 
                            };
                        }
                    };
                    case (#err(_err)) {
                        // If there's no transaction record, assume no accepted freelancers.
                        return #err("No transaction found for the job");
                    };
                }
            };
            case null { 
                return #err("Job not found"); 
            };
        }
    };

    public shared func finishJob(
        job_id: Text,
        job_canister: Text,
        job_transaction_canister: Text,
        user_canister: Text,
        rating_canister: Text
    ): async Result.Result<Bool, Text> {
        // Step 1: Retrieve the job from the jobs HashMap
        switch (jobs.get(job_id)) {
            case (?existingJob) {
                // Step 2: Retrieve the job transaction
                let jobTransactionActor = actor (job_transaction_canister) : actor {
                    getTransactionByJobId(job_id : Text) : async Result.Result<JobTransaction.JobTransaction, Text>;
                };

                let transactionResult = await jobTransactionActor.getTransactionByJobId(job_id);
                switch (transactionResult) {
                    case (#ok(transaction)) {
                        // Step 3: Calculate payment per freelancer
                        let numFreelancers = Float.fromInt(List.size(transaction.freelancers));
                        if (numFreelancers == 0) {
                            return #err("No freelancers have been accepted for this job");
                        };

                        let paymentPerFreelancer = existingJob.wallet / numFreelancers;

                        // Step 4: Transfer payments to freelancers
                        var remainingWallet = existingJob.wallet; // Track remaining wallet balance
                        for (freelancerId in Iter.fromList(transaction.freelancers)) {
                            let userActor = actor(user_canister) : actor {
                                transfer_icp_to_user: (from_job_id: Text, to_user_id: Text, amount: Float, job_canister: Text) -> async Result.Result<Text, Text>;
                            };

                            let transferResult = await userActor.transfer_icp_to_user(
                                job_id, // From: job owner
                                freelancerId, // To: freelancer
                                paymentPerFreelancer, // Amount
                                job_canister
                            );
                            switch (transferResult) {
                                case (#err(errMsg)) {
                                    return #err("Failed to transfer payment to freelancer " # freelancerId # ": " # errMsg);
                                };
                                case (#ok(_)) {
                                    remainingWallet -= paymentPerFreelancer; // Deduct payment from wallet
                                };
                            };
                        };

                        // Step 5: Update the job status and wallet balance
                        let updatedJob : Job.Job = {
                            id = existingJob.id;
                            jobName = existingJob.jobName;
                            jobDescription = existingJob.jobDescription;
                            jobSalary = existingJob.jobSalary;
                            jobRating = existingJob.jobRating;
                            jobTags = existingJob.jobTags;
                            jobSlots = existingJob.jobSlots;
                            jobStatus = "Finished"; // Update status
                            userId = existingJob.userId;
                            createdAt = existingJob.createdAt;
                            updatedAt = Time.now();
                            wallet = remainingWallet; // Update wallet balance
                        };
                        jobs.put(job_id, updatedJob);

                        // Step 6: Create ratings for freelancers
let ratingActor = actor(rating_canister) : actor {
    createRating: (job_id : Text, user_ids : List.List<Text>) -> async Result.Result<Text, Text>;
};

Debug.print("Calling createRating with rating_canister: " # rating_canister);

let ratingResult = await ratingActor.createRating(job_id, transaction.freelancers);
Debug.print("Rating result received");
                        

                        switch (ratingResult) {
                            // Debug.print("Rating result: ", ratingResult);
                            // Debug.print("Rating result: ", ratingResult);
                            case (#err(errMsg)) {
                                // D
                                return #err("Failed to create ratings: " # errMsg);
                            };
                            case (#ok(_)) {
                                // Step 7: Return success
                                return #ok(true);
                            };
                        };
                    };
                    case (#err(errMsg)) {
                        return #err("Failed to fetch job transaction: " # errMsg);
                    };
                };
            };
            case null {
                return #err("Job not found");
            };
        };
    };
}