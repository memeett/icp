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

    system func preupgrade() {
        appliersEntries := Iter.toArray(appliers.entries());
    };

    system func postupgrade() {
        appliers := HashMap.fromIter<Int, Applier.Applier>(
            appliersEntries.vals(),
            0,
            Int.equal,
            intHash
        );
        appliersEntries := [];
    };

    let jobActor = actor ("br5f7-7uaaa-aaaaa-qaaca-cai") : actor {
        getJob : (Text) -> async Result.Result<Job.Job, Text>;
    };

    let userActor = actor ("avqkn-guaaa-aaaaa-qaaea-cai"): actor{
        getUserById : (Text) -> async Result.Result<User.User, Text>;
    };

    public func applyJob(payload : Applier.ApplyPayload) : async Result.Result<Applier.Applier, Text> {
        let result = await jobActor.getJob(payload.jobId);
        
        switch(result) {
            case (#err(_)) {
                return #err("No Job Found");
            };
            case (#ok(_job)) {
                if (_job.userId == payload.userId) {
                    return #err("You can't apply to your own job");
                };
                let allAppliers = Iter.toArray(appliers.vals());
                let userAppliers = Array.filter(allAppliers, func(applier : Applier.Applier) : Bool {
                    return applier.userId == payload.userId and applier.jobId == payload.jobId;
                });
                if (userAppliers.size() > 0) {
                    return #err("You have already applied to this job");
                };  

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
        
        let jobAppliers = Iter.toArray(appliers.vals());
        let filteredAppliers = Array.filter(jobAppliers, func(applier : Applier.Applier) : Bool {
            return applier.jobId == job_id;
        });
        
        if (filteredAppliers.size() == 0) {
            return #ok([]);
        };
        
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
        let allAppliers = Iter.toArray(appliers.vals());
        
        for (applier in allAppliers.vals()) {
            if (Array.find<Text>(userIds, func(userId: Text) : Bool { 
                return userId == applier.userId 
            }) != null) {
                let updatedApplier : Applier.Applier = {
                    id = applier.id;
                    userId = applier.userId;
                    jobId = applier.jobId;
                    appliedAt = applier.appliedAt;
                    isAccepted = true;
                };
                
                appliers.put(applier.id, updatedApplier);
            };
        };
    };

    public func GetUserApply(userId: Text): async [Applier.UserApplyJobPayload] {
        var userApplications : [Applier.UserApplyJobPayload] = [];
        
        let allAppliers = Iter.toArray(appliers.vals());
        let userAppliers = Array.filter(allAppliers, func(applier : Applier.Applier) : Bool {
            return applier.userId == userId;
        });
        
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

    public func hasUserApplied(userId: Text, jobId: Text): async Bool {
        let allAppliers = Iter.toArray(appliers.vals());
        let userAppliers = Array.filter(allAppliers, func(applier : Applier.Applier) : Bool {
            return applier.userId == userId and applier.jobId == jobId;
        });
        
        userAppliers.size() > 0
    };

    public func getAcceptedAppliers(jobId: Text): async [Applier.Applier] {
        let allAppliers = Iter.toArray(appliers.vals());
        let acceptedAppliers = Array.filter(allAppliers, func(applier : Applier.Applier) : Bool {
            return applier.jobId == jobId and applier.isAccepted;
        });
        
        acceptedAppliers
    };

}
