import List "mo:base/List";
import Int "mo:base/Int";
module {
    public type JobTransaction = {
        transactionId: Int;
        jobId: Text;
        freelancers: List.List<Text>;
        client: Text;
    };
};