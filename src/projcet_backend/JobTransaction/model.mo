import List "mo:base/List";
module {
    public type JobTransaction = {
        jobId: Text;
        freelancers: List.List<Text>;
        client: Text;
    };
};