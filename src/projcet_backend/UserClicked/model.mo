import Int "mo:base/Int";
module{
       public type UserClicked = {
        id: Nat;
        userId: Text;
        jobId: Text;
        counter: Int;
    };

    public type UserClickedPayload = {
        userId: ?Text;
        jobId: ?Text;
    
    };
}