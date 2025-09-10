import Text "mo:base/Text";
import User "../User/model";
module {
    public type Submission = {
        id: Text;
        jobId: Text;
        user: User.User;
        submissionMessage: Text;
        submissionStatus: Text;
        submissionFile: Text;
    };

    public type ResponseSubmission = {
        id: Text;
        jobId: Text;
        user: User.User;
        submissionMessage: Text;
        submissionStatus: Text;
    }

};