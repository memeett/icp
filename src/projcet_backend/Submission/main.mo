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

    private stable var usersEntries : [(Text, Submission.Submission)] = [];

    private var users = HashMap.fromIter<Text, Submission.Submission>(
        usersEntries.vals(),
        0,
        Text.equal,
        Text.hash,
    );

    // Save state before upgrade
    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
    };

    // Restore state after upgrade
    system func postupgrade() {
        users := HashMap.fromIter<Text, Submission.Submission>(
            usersEntries.vals(),
            0,
            Text.equal,
            Text.hash,
        );
        usersEntries := [];
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

            users.put(submissionId, newSubmission);
            return #ok(newSubmission);
        } catch (e) {
            // Handle any unexpected errors
            return #err("An unexpected error occurred: " # Error.message(e));
        };
    };

    public func updateSubmissionStatus(submissionId: Text, newStatus: Text): async Result.Result<Submission.Submission, Text> {
        switch (users.get(submissionId)) {
            case (null) {
                return #err("Submission not found");
            };
            case (?submission) {
                let updatedSubmission : Submission.Submission = {
                    id = submission.id;
                    jobId = submission.jobId;
                    user = submission.user;
                    submissionMessage = submission.submissionMessage;
                    submissionStatus = newStatus; 
                    submissionFile = submission.submissionFile;
                };

                users.put(submissionId, updatedSubmission);
                return #ok(updatedSubmission);
            };
        };
    };

    // Get submissions by userId where status is "Accept"
    public func getSubmissionAcceptbyUserId(userId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(users.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.user.id == userId and submission.submissionStatus == "Accept";
        });
    };
    // Get submissions by userId where status is "Waiting"
    public func getSubmissionWaitingbyUserId(userId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(users.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.user.id == userId and submission.submissionStatus == "Waiting";
        });
    };
    // Get submissions by userId where status is "Reject"
    public func getSubmissionRejectbyUserId(userId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(users.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.user.id == userId and submission.submissionStatus == "Reject";
        });
    };
    // Get submissions by jobId where status is "Accept"
    public func getSubmissionAcceptbyJobId(jobId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(users.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.jobId == jobId and submission.submissionStatus == "Accept";
        });
    };
    // Get submissions by jobId where status is "Waiting"
    public func getSubmissionWaitingbyJobId(jobId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(users.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.jobId == jobId and submission.submissionStatus == "Waiting";
        });
    };
    // Get submissions by jobId where status is "Reject"
    public func getSubmissionRejectbyJobId(jobId: Text): async [Submission.Submission] {
        let allSubmissions = Iter.toArray(users.vals());
        return Array.filter<Submission.Submission>(allSubmissions, func (submission) {
            submission.jobId == jobId and submission.submissionStatus == "Reject";
        });
    };



};