import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Job "model/Job";
import Iter "mo:base/Iter";
actor {
  public query func greet(name : Text) : async Text {
    Debug.print("asdasdsada");
    return "Hello, " # name # "!";
  };

  private stable var nextId : Nat = 0;
  private var jobs = HashMap.HashMap<Text, Job.Job>(0, Text.equal, Text.hash);

  //Create Job
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

  //Read Job
  public query func getJob (jobId : Text) : async Result.Result<Job.Job, Text> {
    switch (jobs.get(jobId)) {
      case (?job) { #ok(job) };
      case null { #err("Job not found") };
    }
  };

  //Update Job
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
    public query func getAllJobs() : async [Job.Job] {
        Iter.toArray(jobs.vals());
    };

};
