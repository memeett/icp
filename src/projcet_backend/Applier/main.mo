import Applier "./model";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Job "../Job/model";
import Int "mo:base/Int";
import Hash "mo:base/Hash";
import Array "mo:base/Array";
import User "../User/model"

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

    let userActor = actor ("b77ix-eeaaa-aaaaa-qaada-cai"): actor{
        getUserById : (Text) -> async Result.Result<User.User, Text>;
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

    public func getJobApplier(job_id : Text): async Result.Result<[User.User], Text> {
        var applicants : [User.User] = [];
        
        // First, find all appliers for this job
        let jobAppliers = Iter.toArray(appliers.vals());
        let filteredAppliers = Array.filter(jobAppliers, func(applier : Applier.Applier) : Bool {
            return applier.jobId == job_id;
        });
        
        // If no appliers found, return empty array
        if (filteredAppliers.size() == 0) {
            return #ok([]);
        };
        
        // Get user details for each applier
        for (applier in filteredAppliers.vals()) {
            let userResult = await userActor.getUserById(applier.userId);
            
            switch(userResult) {
                case (#ok(user)) {
                    applicants := Array.append(applicants, [user]);
                };
                case (#err(_)) {
                };
            };
        };
        
        #ok(applicants)
    };


    public func AcceptApplier(userIds : [Text]): async () {
        // Convert HashMap to Array to make it mutable
        let allAppliers = Iter.toArray(appliers.vals());
        
        // Update each applier that matches any userId in the input array
        for (applier in allAppliers.vals()) {
            if (Array.find<Text>(userIds, func(userId: Text) : Bool { 
                return userId == applier.userId 
            }) != null) {
                // Create updated applier with isAccepted = true
                let updatedApplier : Applier.Applier = {
                    id = applier.id;
                    userId = applier.userId;
                    jobId = applier.jobId;
                    appliedAt = applier.appliedAt;
                    isAccepted = true;
                };
                
                // Update in HashMap
                appliers.put(applier.id, updatedApplier);
            };
        };
    };

    public func GetUserApply(userId: Text): async [Applier.UserApplyJobPayload] {
        var userApplications : [Applier.UserApplyJobPayload] = [];
        
        // Get all appliers for this user
        let allAppliers = Iter.toArray(appliers.vals());
        let userAppliers = Array.filter(allAppliers, func(applier : Applier.Applier) : Bool {
            return applier.userId == userId;
        });
        
        // For each application, get the job details and create the payload
        for (applier in userAppliers.vals()) {
            let jobResult = await jobActor.getJob(applier.jobId);
            
            switch(jobResult) {
                case (#ok(job)) {
                    let payload : Applier.UserApplyJobPayload = {
                        job = job;
                        isAccepted = applier.isAccepted;
                        appliedAt = applier.appliedAt;
                    };
                    userApplications := Array.append(userApplications, [payload]);
                };
                case (#err(_)) {
                };
            };
        };
        
        userApplications
    };

}
