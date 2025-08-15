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
import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Nat16 "mo:base/Nat16";
import Nat "mo:base/Nat";
import Error "mo:base/Error";
import User "../User/model";

persistent actor JobModel{ // Declared as persistent
    private stable var nextId : Nat = 0;
    private stable var nextCategoryId : Nat = 0;

  private stable var jobsEntries : [(Text, Job.Job)] = [];
  private stable var jobCategoriesEntries : [(Text, Job.JobCategory)] = [];

    private transient var jobs = HashMap.fromIter<Text, Job.Job>( // Marked as transient
        jobsEntries.vals(),
        0,
        Text.equal,
        Text.hash
    );

    private transient var jobCategories = HashMap.fromIter<Text, Job.JobCategory>( // Marked as transient
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
      Text.hash,
    );
    jobCategories := HashMap.fromIter<Text, Job.JobCategory>(
      jobCategoriesEntries.vals(),
      0,
      Text.equal,
      Text.hash,
    );
    jobsEntries := [];
    jobCategoriesEntries := [];
  };

  public func createJob(payload : Job.CreateJobPayload, job_transaction_canister : Text, job_canister : Text) : async Result.Result<Job.Job, Text> {
    let jobId = nextId;
    nextId += 1;

    let id = Int.toText(jobId);
    let now = Time.now();

    let job : Job.Job = {
      id = id;
      jobName = payload.jobName;
      jobDescription = payload.jobDescription;
      jobTags = payload.jobTags;
      jobProjectType = payload.jobProjectType;
      jobSalary = payload.jobSalary;
      jobSlots = payload.jobSlots;
      jobStatus = "Open";
      jobExperimentLevel = payload.jobExperimentLevel;
      jobRequirementSkills = payload.jobRequirementSkills;
      jobStartDate = payload.jobStartDate;
      jobDeadline = payload.jobDeadline;
      userId = payload.userId;
      createdAt = now;
      updatedAt = now;
      jobRating = 0;
      wallet = 0;
    };

    jobs.put(id, job);

    // create transaction
    try {
      // Create the job transaction
      let jobTransactionActor = actor (job_transaction_canister) : actor {
        createTransaction : (Text, Text, Text) -> async ();
      };
      await jobTransactionActor.createTransaction(payload.userId, id, job_canister);
      return #ok(job);
    } catch (error) {
      Debug.print("Error creating job: " # Error.message(error));
      return #err("Failed to create job transaction");
    };
  };

  // Existing functions

  // ----- HTTP Interface Implementation -----

  // Type definitions for HTTP handling
  type HeaderField = (Text, Text);

  type HttpRequest = {
    method : Text;
    url : Text;
    headers : [HeaderField];
    body : Blob;
    certificate_version : ?Nat16;
  };

  type HttpResponse = {
    status_code : Nat16;
    headers : [HeaderField];
    body : Blob;
    streaming_strategy : ?StreamingStrategy;
    upgrade : ?Bool;
  };

  type StreamingStrategy = {
    #Callback : {
      callback : StreamingCallback;
      token : StreamingCallbackToken;
    };
  };

  type StreamingCallback = query (StreamingCallbackToken) -> async (StreamingCallbackResponse);

  type StreamingCallbackToken = {
    key : Text;
    sha256 : ?[Nat8];
    index : Nat;
    content_encoding : Text;
  };

  type StreamingCallbackResponse = {
    body : Blob;
    token : ?StreamingCallbackToken;
  };

  private func makeJsonResponse(statusCode : Nat16, jsonContent : Text) : HttpResponse {
    {
      status_code = statusCode;
      headers = [
        ("Content-Type", "application/json"),
        ("Access-Control-Allow-Origin", "*"),
        ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
        ("Access-Control-Allow-Headers", "Content-Type"),
      ];
      body = Text.encodeUtf8(jsonContent);
      streaming_strategy = null;
      upgrade = null;
    };
  };

    private func jobToJsonString(job : Job.Job) : Text {
        // job.jobTags: [Job.JobCategory]
        let tagItems = Array.map<Job.JobCategory, Text>(
            job.jobTags,
            func (tag : Job.JobCategory) : Text {
                "{\"id\":\"" # tag.id # "\",\"jobCategoryName\":\"" # tag.jobCategoryName # "\"}"
            }
        );
        let tagsJson = "[" # Text.join(",", Iter.fromArray(tagItems)) # "]";
        // job.jobDescription: [Text]
        let descItems = Array.map<Text, Text>(
            job.jobDescription,
            func (d : Text) : Text { "\"" # d # "\"" }
        );
        let descriptionJson = "[" # Text.join(",", Iter.fromArray(descItems)) # "]";

    "{" #
    "\"id\":\"" # job.id # "\"," #
    "\"jobName\":\"" # job.jobName # "\"," #
    "\"jobDescription\":" # descriptionJson # "," #
    "\"jobTags\":" # tagsJson # "," #
    "\"jobSalary\":" # Float.toText(job.jobSalary) # "," #
    "\"jobSlots\":" # Int.toText(job.jobSlots) # "," #
    "\"jobStatus\":\"" # job.jobStatus # "\"," #
    "\"userId\":\"" # job.userId # "\"," #
    "\"createdAt\":" # Int.toText(job.createdAt) # "," #
    "\"updatedAt\":" # Int.toText(job.updatedAt) # "," #
    "\"jobRating\":" # Float.toText(job.jobRating) # "," #
    "\"wallet\":" # Float.toText(job.wallet) #
    "}";
  };

  private func jobsToJsonArray(jobList : [Job.Job]) : Text {
    let jobJsonArray = Array.map<Job.Job, Text>(
      jobList,
      func(job : Job.Job) : Text = jobToJsonString(job),
    );
    "[" # Text.join(",", Iter.fromArray(jobJsonArray)) # "]";
  };

  // HTTP request handler
  public query func http_request(req : HttpRequest) : async HttpResponse {
    let path = req.url;
    let method = req.method;

    if (method == "POST" and path == "/getAllJobs") {
      return {
        status_code = 200;
        headers = [
          ("Access-Control-Allow-Origin", "*"),
          ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
          ("Access-Control-Allow-Headers", "Content-Type"),
        ];
        body = Text.encodeUtf8("");
        streaming_strategy = null;
        upgrade = ?true;
      };
    };

    // Handle routes
    switch (method, path) {
      case ("GET", "/getAllJobs") {
        let allJobs = Iter.toArray(jobs.vals());
        let jsonResponse = jobsToJsonArray(allJobs);
        return makeJsonResponse(200, jsonResponse);
      };
      case ("OPTIONS", _) {
        return {
          status_code = 200;
          headers = [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
            ("Access-Control-Allow-Headers", "Content-Type"),
          ];
          body = Text.encodeUtf8("");
          streaming_strategy = null;
          upgrade = null;
        };
      };
      case _ {
        return makeJsonResponse(404, "{\"error\": \"Not Found\", \"path\": \"" # path # "\"}");
      };
    };
  };

  // HTTP update handler for routes that require update calls
  public func http_request_update(req : HttpRequest) : async HttpResponse {
    let path = req.url;
    let method = req.method;

    // Handle only specific paths that match our pattern
    if (method == "POST" and path == "/getAllJobs") {
      let allJobs = Iter.toArray(jobs.vals());
      let jsonResponse = jobsToJsonArray(allJobs);
      return makeJsonResponse(200, jsonResponse);
    };

    // Handle OPTIONS requests for CORS
    if (method == "OPTIONS") {
      return {
        status_code = 200;
        headers = [
          ("Access-Control-Allow-Origin", "*"),
          ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
          ("Access-Control-Allow-Headers", "Content-Type"),
        ];
        body = Text.encodeUtf8("");
        streaming_strategy = null;
        upgrade = null;
      };
    };

    // Default response for unhandled routes
    return makeJsonResponse(404, "{\"error\": \"Not Found\", \"path\": \"" # path # "\"}");
  };

  // Existing functions continue below...
  public func createJobCategory(categoryName : Text) : async Result.Result<Job.JobCategory, Text> {
    // Check if the category already exists
    for ((_, category) in jobCategories.entries()) {
      if (category.jobCategoryName == categoryName) {
        return #err("Category already exists");
      };
    };

    let categoryId = nextCategoryId;
    nextCategoryId += 1;

    let id = Int.toText(categoryId);

    let category : Job.JobCategory = {
      id = id;
      jobCategoryName = categoryName;
    };

    jobCategories.put(id, category);

    return #ok(category);
  };

  public query func findJobCategoryByName(categoryName : Text) : async Result.Result<Job.JobCategory, Text> {
    Debug.print(categoryName);
    for ((_, category) in jobCategories.entries()) {
      if (category.jobCategoryName == categoryName) {
        return #ok(category);
      };
    };

    return #err("Category not found");
  };

  public query func getJobCategory(categoryId : Text) : async Result.Result<Job.JobCategory, Text> {
    switch (jobCategories.get(categoryId)) {
      case (null) {
        return #err("Category not found");
      };
      case (?category) {
        return #ok(category);
      };
    };
  };

  public query func getAllJobCategories() : async [Job.JobCategory] {
    return Iter.toArray(jobCategories.vals());
  };

  public func updateJob(jobId : Text, payload : Job.UpdateJobPayload) : async Result.Result<Job.Job, Text> {
    switch (jobs.get(jobId)) {
      case (null) {
        return #err("Job not found");
      };
      case (?job) {
        let updatedJob : Job.Job = {
          id = job.id;
          jobName = payload.jobName;
          jobDescription = payload.jobDescription;
          jobTags = job.jobTags;
          jobProjectType = job.jobProjectType;
          jobSalary = job.jobSalary;
          jobSlots = job.jobSlots;
          jobStatus = job.jobStatus;
          jobExperimentLevel = job.jobExperimentLevel;
          jobRequirementSkills = job.jobRequirementSkills;
          jobStartDate = payload.jobStartDate;
          jobDeadline = payload.jobDeadline;
          userId = job.userId;
          createdAt = job.createdAt;
          updatedAt = Time.now();
          jobRating = job.jobRating;
          wallet = job.wallet;
        };

        jobs.put(jobId, updatedJob);
        return #ok(updatedJob);
      };
    };
  };

  public query func getJob(jobId : Text) : async Result.Result<Job.Job, Text> {
    switch (jobs.get(jobId)) {
      case (null) {
        return #err("Job not found");
      };
      case (?job) {
        Debug.print("Job found: " # job.jobName);
        return #ok(job);
      };
    };
  };

  public query func getAllJobs() : async [Job.Job] {
    return Iter.toArray(jobs.vals());
  };

  public func deleteJob(jobId : Text) : async Result.Result<(), Text> {
    switch (jobs.get(jobId)) {
      case (null) {
        return #err("Job not found");
      };
      case (_) {
        jobs.delete(jobId);
        return #ok(());
      };
    };
  };

  public func getUserJob(owner_id : Text) : async [Job.Job] {
    let userJobs = Array.filter<Job.Job>(
      Iter.toArray(jobs.vals()),
      func(job : Job.Job) : Bool {
        return job.userId == owner_id;
      },
    );

    return userJobs;
  };

  public func getUserJobByStatusFinished(owner_id : Text) : async [Job.Job] {
    let userJobs = Array.filter<Job.Job>(
      Iter.toArray(jobs.vals()),
      func(job : Job.Job) : Bool {
        return job.userId == owner_id and job.jobStatus == "Finished";
      },
    );

    return userJobs;
  };

  public func startJob(user_id : Text, job_id : Text) : async Result.Result<Bool, Text> {
    let jobResult = await getJob(job_id);
    switch (jobResult) {
      case (#err(error)) {
        Debug.print("Error fetching job: " # error);
        return #err(error);
      };
      case (#ok(job)) {
        if (job.jobStatus != "Open") {
          return #err("Job is not open for start");
        };

        let updatedJob : Job.Job = {
          id = job.id;
          jobName = job.jobName;
          jobDescription = job.jobDescription;
          jobTags = job.jobTags;
          jobProjectType = job.jobProjectType;
          jobSalary = job.jobSalary;
          jobSlots = job.jobSlots;
          jobStatus = "Ongoing";
          jobExperimentLevel = job.jobExperimentLevel;
          jobRequirementSkills = job.jobRequirementSkills;
          jobStartDate = job.jobStartDate;
          jobDeadline = job.jobDeadline;
          userId = job.userId;
          createdAt = job.createdAt;
          updatedAt = Time.now();
          jobRating = job.jobRating;
          wallet = job.wallet;
        };

        jobs.put(job_id, updatedJob);
        return #ok(true);
      };
    };
  };

  public func finishJob(job_id : Text, job_canister : Text, job_transaction_canister : Text, user_canister : Text, _ : Text) : async Result.Result<Bool, Text> {
    let jobResult = await getJob(job_id);

    switch (jobResult) {
      case (#err(error)) {
        return #err(error);
      };
      case (#ok(job)) {
        if (job.jobStatus != "Ongoing") {
          return #err("Job is not ongoing");
        };

        // Change job status to "Finished"
        let updatedJob : Job.Job = {
          id = job.id;
          jobName = job.jobName;
          jobDescription = job.jobDescription;
          jobTags = job.jobTags;
          jobProjectType = job.jobProjectType;
          jobSalary = job.jobSalary;
          jobSlots = job.jobSlots;
          jobStatus = "Finished";
          jobExperimentLevel = job.jobExperimentLevel;
          jobRequirementSkills = job.jobRequirementSkills;
          jobStartDate = job.jobStartDate;
          jobDeadline = job.jobDeadline;
          userId = job.userId;
          createdAt = job.createdAt;
          updatedAt = Time.now();
          jobRating = job.jobRating;
          wallet = job.wallet;
        };

        jobs.put(job_id, updatedJob);
        return #ok(true);
      };
    };
  };

  public func putJob(job_id : Text, job : Job.Job) {
    jobs.put(job_id, job);
  };
};
