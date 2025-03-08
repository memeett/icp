import Text "mo:base/Text";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Job "../Job/model";
import User "../User/model";

module{
    //user_id itu freelance id
    //jika is edit true maka rating sudah tidak bisa di edit
    public type Rating = {
        id: Int;
        job_id: Text;
        user_id: Text;
        rating: Float;
        isEdit: Bool;
    };

    //payload pov client buat rating
    public type JobRatingPayload = {
        rating_id: Int;
        user : User.User;
        rating: Float;
        isEdit: Bool;
    };

    //payload buat nampilin di history
    public type HistoryRatingPayload = {
        job: Job.Job;
        user: User.User;
        rating: Float;
        isEdit: Bool;
    };

    public type RequestRatingPaylod = {
        rating_id: Int;
        rating: Float;
    }
}