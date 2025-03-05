import Submission "./model";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Error "mo:base/Error";
import User "../User/model";
actor submissionModel {
    private stable var nextId : Nat = 0;

    private stable var submissionsEntries : [(Text, Submission.Submission)] = [];

    private var submissions = HashMap.fromIter<Text, Submission.Submission>(
        submissionsEntries.vals(),
        0,
        Text.equal,
        Text.hash,
    );

    system func preupgrade() {
        submissionsEntries := Iter.toArray(submissions.entries());
    };

    system func postupgrade() {
        submissions := HashMap.fromIter<Text, Submission.Submission>(
            submissionsEntries.vals(),
            0,
            Text.equal,
            Text.hash,
        );
        submissionsEntries := [];
    };

    // Create a new submission
    public func createSubmission(jobId: Text, user: User.User, fileSubmission: Blob, message: Text): async Result.Result<Submission.Submission, Text> {
        try {
            let submissionId = Nat.toText(nextId);
            nextId += 1;

            let newSubmission : Submission.Submission = {
                id = submissionId;
                jobId = jobId;
                user = user;
                submissionMessage = message;
                submissionStatus = "Waiting"; 
                submissionFile = fileSubmission;
            };

            submissions.put(submissionId, newSubmission);
            return #ok(newSubmission);
        } catch (e) {
            // Handle any unexpected errors
            return #err("An unexpected error occurred: " # Error.message(e));
        };
    };

    public func updateSubmissionStatus(submissionId: Text, newStatus: Text, message: Text): async Result.Result<Submission.Submission, Text> {
        switch (submissions.get(submissionId)) {
            case (null) {
                return #err("Submission not found");
            };
            case (?submission) {
                let updatedSubmission : Submission.Submission = {
                    id = submission.id;
                    jobId = submission.jobId;
                    user = submission.user;
                    submissionMessage = message;
                    submissionStatus = newStatus; 
                    submissionFile = submission.submissionFile;
                };

                submissions.put(submissionId, updatedSubmission);
                return #ok(updatedSubmission);
            };
        };
    };

    // Get submissions by userId where status is "Accept"
    public func getSubmissionAcceptbyUserId(userId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(submissions.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.user.id == userId and submission.submissionStatus == "Accept";
        });
    };

    // public query func getJob (jobId : Text) : async Result.Result<Job.Job, Text> {
    //     switch (jobs.get(jobId)) {
    //         case (?job) { #ok(job) };
    //         case null { #err("Job not found") };
    //     }
    // };

// get all submission by job id using query function and return reuslt
    public query func getSubmissionByJobId(jobId: Text): async Result.Result<[Submission.Submission], Text> {
        let allSubmissions = Iter.toArray(submissions.vals());
        let filteredSubmissions = Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.jobId == jobId;
        });
        #ok(filteredSubmissions);
    };


    // Get submissions by userId where status is "Waiting"
    public func getSubmissionWaitingbyUserId(userId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(submissions.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.user.id == userId and submission.submissionStatus == "Waiting";
        });
    };
    // Get submissions by userId where status is "Reject"
    public func getSubmissionRejectbyUserId(userId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(submissions.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.user.id == userId and submission.submissionStatus == "Reject";
        });
    };
    // Get submissions by jobId where status is "Accept"
    public func getSubmissionAcceptbyJobId(jobId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(submissions.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.jobId == jobId and submission.submissionStatus == "Accept";
        });
    };
    // Get submissions by jobId where status is "Waiting"
    public func getSubmissionWaitingbyJobId(jobId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(submissions.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.jobId == jobId and submission.submissionStatus == "Waiting";
        });
    };
    // Get submissions by jobId where status is "Reject"
    public func getSubmissionRejectbyJobId(jobId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(submissions.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.jobId == jobId and submission.submissionStatus == "Reject";
        });
    };



};