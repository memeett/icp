import UserClicked "./model";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Option "mo:base/Option";
actor UserClickedModel{
    private stable var nextId : Nat = 0;
    private stable var userClickedEntries : [(Nat, UserClicked.UserClicked)] = [];
    private var userClickeds = HashMap.fromIter<Nat, UserClicked.UserClicked>(
        userClickedEntries.vals(),
        0,
        Int.equal,
        Int.hash
    );

    system func preupgrade() {
        userClickedEntries := Iter.toArray(userClickeds.entries());
    };

    system func postupgrade() {
        userClickeds := HashMap.fromIter<Nat, UserClicked.UserClicked>(
            userClickedEntries.vals(),
            0,
            Int.equal,
            Int.hash
        );
        userClickedEntries := [];
    };

    public shared func createUserClicked(userId : Text, jobId : Text) : async Result.Result<UserClicked.UserClicked, Text>  {
        let id = nextId;
        nextId += 1;

        let newUserClicked : UserClicked.UserClicked = {
            id = id;
            userId = userId;
            jobId = jobId;
            counter = 1; 
        };

        userClickeds.put(id, newUserClicked);
        #ok(newUserClicked); 
    };

    public query func getUserClickedByUserIdJobId(userId : Text, jobId : Text) : async ?UserClicked.UserClicked {
        for ((id, userClicked) in userClickeds.entries()) {
            if (userClicked.userId == userId and userClicked.jobId == jobId) {
                return ?userClicked; 
            }
        };
        return null; 
    };

     public shared func incrementCounter(userClickedPayload: UserClicked.UserClickedPayload) : async Result.Result<UserClicked.UserClicked, Text> {
        let userId = Option.get(userClickedPayload.userId, "");
        let jobId = Option.get(userClickedPayload.jobId, "");

        if (userId == "" or jobId == "") {
            return #err("userId and jobId must be provided");
        };

        let res = await getUserClickedByUserIdJobId(userId, jobId);

        switch (res) {
            case (?userClicked) {
                let newUserClicked : UserClicked.UserClicked = {
                    id = userClicked.id;
                    userId = userClicked.userId;
                    jobId = userClicked.jobId;
                    counter = userClicked.counter + 1; 
                };

                userClickeds.put(userClicked.id, newUserClicked);

                return #ok(newUserClicked);
            };
            case (null) {
                return #err("No UserClicked record found for userId: " # userId # " and jobId: " # jobId);
            };
        };
    };




}