import Applier "./model";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Job "../Job/model";
import Int "mo:base/Int";
import Hash "mo:base/Hash";

actor ApplierModel {
    private stable var nextId : Int = 0;

    private stable var appliersEntries : [(Int, Applier.Applier)] = [];
    
    // Custom hash function for Int
    private func intHash(n : Int) : Hash.Hash {
        let text = Int.toText(n);
        let hash = Text.hash(text);
        hash
    };

    private var appliers = HashMap.HashMap<Int, Applier.Applier>(
        0,
        Int.equal,
        intHash
    );

    // Save state before upgrade
    system func preupgrade() {
        appliersEntries := Iter.toArray(appliers.entries());
    };

    // Restore state after upgrade
    system func postupgrade() {
        appliers := HashMap.fromIter<Int, Applier.Applier>(
            appliersEntries.vals(),
            0,
            Int.equal,
            intHash
        );
        appliersEntries := [];
    };

    let jobActor = actor ("bd3sg-teaaa-aaaaa-qaaba-cai") : actor {
        getJob : (Text) -> async Result.Result<Job.Job, Text>;
    };

    public func applyJob(payload : Applier.ApplyPayload) : async Result.Result<Applier.Applier, Text> {
        let result = await jobActor.getJob(payload.jobId);
        
        switch(result) {
            case (#err(_)) {
                return #err("No Job Found");
            };
            case (#ok(_job)) {
                let currentId = nextId;
                nextId += 1;
                
                let newApplier : Applier.Applier = {
                    id = currentId;
                    userId = payload.userId;
                    jobId = payload.jobId;
                    appliedAt = Time.now();
                    isAccepted = false;
                };

                appliers.put(currentId, newApplier);
                return #ok(newApplier);
            };
        };
    };
}
