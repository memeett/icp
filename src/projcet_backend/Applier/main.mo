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
import User "../User/model";
import JobTransaction "../JobTransaction/model";

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

    public func applyJob(payload : Applier.ApplyPayload, job_canister: Text) : async Result.Result<Applier.Applier, Text> {
        let jobActor = actor (job_canister) : actor {
            getJob : (Text) -> async Result.Result<Job.Job, Text>;
        };
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
                if (userAppliers.size() > 0 and userAppliers[0].status != "Rejected") {
                    return #err("You have already applied to this job");
                };  

                let currentId = nextId;
                nextId += 1;
                
                let newApplier : Applier.Applier = {
                    id = currentId;
                    userId = payload.userId;
                    jobId = payload.jobId;
                    appliedAt = Time.now();
                    status = "Pending"
                };

                appliers.put(currentId, newApplier);
                return #ok(newApplier);
            };
        };
    };

    public func getJobApplier(job_id : Text, user_canister: Text): async Result.Result<[Applier.ApplierPayload], Text> {
        let userActor = actor (user_canister): actor{
            getUserById : (Text) -> async Result.Result<User.User, Text>;
        };
        var payloads : [Applier.ApplierPayload] = [];
        
        let jobAppliers = Iter.toArray(appliers.vals());
        let filteredAppliers = Array.filter(jobAppliers, func(applier : Applier.Applier) : Bool {
            return applier.jobId == job_id and applier.status == "Pending";
        });
        
        if (filteredAppliers.size() == 0) {
            return #ok([]);
        };
        
        for (applier in filteredAppliers.vals()) {
            let userResult = await userActor.getUserById(applier.userId);
            switch (userResult) {
                case (#ok(user)) {
                    let payload : Applier.ApplierPayload = {
                        user = user;
                        appliedAt = applier.appliedAt;
                    };
                    payloads := Array.append(payloads, [payload]);
                };
                case (#err(_)) {
                    // Optionally, handle errors here (skip this applier)
                };
            };
        };
        
        return #ok(payloads);
    };

    public func acceptApplier(payload: Applier.ApplyPayload, job_transaction_canister: Text) : async Result.Result<(), Text> {
        let jobTransactionActor = actor(job_transaction_canister) : actor{
            appendFreelancers: (job_id : Text, newFreelancer : Text) -> async Result.Result<JobTransaction.JobTransaction, Text>
        };
        let allAppliers = Iter.toArray(appliers.vals());
        
        for (applier in allAppliers.vals()) {
            if (applier.userId == payload.userId and applier.jobId == payload.jobId) {
                // Update the applier's status to "Accepted"
                let updatedApplier : Applier.Applier = {
                    id = applier.id;
                    userId = applier.userId;
                    jobId = applier.jobId;
                    appliedAt = applier.appliedAt;
                    status = "Accepted";
                };
                appliers.put(applier.id, updatedApplier);

                // Append the freelancer to the job transaction
                let appendResult = await jobTransactionActor.appendFreelancers(payload.jobId, payload.userId);

                // Handle the result of appending the freelancer
                switch (appendResult) {
                    case (#err(errorMessage)) {
                        return #err("Failed to append freelancer: " # errorMessage);
                    };
                    case (#ok(_)) {
                        return #ok();
                    };
                };
            };
        };

        // If no matching applier is found, return an error
        return #err("No matching applier found for the given userId and jobId");
    };

    public func rejectApplier(payload: Applier.ApplyPayload) : async Result.Result<(), Text> {
        let allAppliers = Iter.toArray(appliers.vals());
        
        var applierFound = false; // Flag to track if a matching applier is found

        for (applier in allAppliers.vals()) {
            if (applier.userId == payload.userId and applier.jobId == payload.jobId) {
                // Update the applier's status to "Rejected"
                let updatedApplier : Applier.Applier = {
                    id = applier.id;
                    userId = applier.userId;
                    jobId = applier.jobId;
                    appliedAt = applier.appliedAt;
                    status = "Rejected";
                };
                appliers.put(applier.id, updatedApplier);

                applierFound := true; // Mark that a matching applier was found
            };
        };

        // Return success or error based on whether a matching applier was found
        if (applierFound) {
            return #ok(); // Success: Applier was found and updated
        } else {
            return #err("No matching applier found for the given userId and jobId"); // Error: No matching applier
        };
    };


    public func getUserApply(userId: Text, job_canister: Text): async [Applier.UserApplyJobPayload] {
        let jobActor = actor (job_canister) : actor {
            getJob : (Text) -> async Result.Result<Job.Job, Text>;
        };
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
                        status = applier.status;
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
            return applier.userId == userId and applier.jobId == jobId and applier.status != "Rejected";
        });
        
        userAppliers.size() > 0
    };

    // public func getAcceptedAppliers(jobId: Text): async [Applier.Applier] {
    //     let allAppliers = Iter.toArray(appliers.vals());
    //     let acceptedAppliers = Array.filter(allAppliers, func(applier : Applier.Applier) : Bool {
    //         return applier.jobId == jobId and applier.status == "Accepted";
    //     });
        
    //     acceptedAppliers
    // };

}
