import JobTransaction "../JobTransaction/model";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Job "../Job/model";
import User "../User/model";
import Global "../global";

actor JobTransactionModel {

    private stable var jobTransactionsEntries : [(Text, JobTransaction.JobTransaction)] = [];

    private var jobTransactions = HashMap.fromIter<Text, JobTransaction.JobTransaction>(
        jobTransactionsEntries.vals(),
        0,
        Text.equal,
        Text.hash,
    );

    // Save state before upgrade
    system func preupgrade() {
        jobTransactionsEntries := Iter.toArray(jobTransactions.entries());
    };

    // Restore state after upgrade
    system func postupgrade() {
        jobTransactions := HashMap.fromIter<Text, JobTransaction.JobTransaction>(
            jobTransactionsEntries.vals(),
            0,
            Text.equal,
            Text.hash,
        );
        jobTransactionsEntries := [];
    };

    let jobActor = actor (Global.canister_id.job) : actor {
        getJob : (Text) -> async Result.Result<Job.Job, Text>;
    };

    let userActor = actor (Global.canister_id.user): actor {
        getUserById : (userId : Text) -> async Result.Result<User.User, Text>;
    };


    public func createTransaction(owner_id : Text, job_id : Text) : async () {
        try {
            // Fetch the job details
            let jobResult = await jobActor.getJob(job_id);

            switch (jobResult) {
                case (#err(_error)) {
                };
                case (#ok(job)) {
                    // Check if the caller is the job owner
                    if (job.userId != owner_id) {
                    };

                    // Create the transaction
                    let transaction : JobTransaction.JobTransaction = {
                        jobId = job_id;
                        freelancers = List.nil<Text>(); // Use the freelancer IDs from getFreelancers
                        client = owner_id;
                    };

                    jobTransactions.put(transaction.jobId, transaction);
                };
            };
        } catch (_) {
        };
    };

    public func appendFreelancers(job_id : Text, newFreelancer : Text) : async Result.Result<JobTransaction.JobTransaction, Text> {
        switch (jobTransactions.get(job_id)) {
            case (null) {
                return #err("No transaction found for this id");
            };
            case (?transaction) {
                // Assuming transaction.freelancers is of type List.List<Text>
                let updatedFreelancers = List.push(newFreelancer, transaction.freelancers);

                let updatedTransaction : JobTransaction.JobTransaction = {
                    jobId = transaction.jobId;
                    freelancers = updatedFreelancers;
                    client = transaction.client;
                };

                jobTransactions.put(job_id, updatedTransaction);
                return #ok(updatedTransaction);
            };
        };
    };

    public func getAcceptedFreelancers(job_id: Text) : async Result.Result<[User.User], Text> {
    // Step 1: Retrieve the job transaction for the given job_id
        switch (jobTransactions.get(job_id)) {
            case (null) {
                return #err("No job transaction found for the given job ID");
            };
            case (?transaction) {
                // Step 2: Extract the list of freelancer IDs from the job transaction
                let freelancerIds = transaction.freelancers;

                // Step 3: Fetch the User.User details for each freelancer
                var acceptedFreelancers : [User.User] = [];
                for (freelancerId in Iter.fromList(freelancerIds)) {
                    let userResult = await userActor.getUserById(freelancerId);
                    switch (userResult) {
                        case (#err(errorMessage)) {
                            return #err("Failed to fetch user details for freelancer: " # freelancerId # ". Error: " # errorMessage);
                        };
                        case (#ok(user)) {
                            acceptedFreelancers := Array.append(acceptedFreelancers, [user]);
                        };
                    };
                };

                // Step 4: Return the list of accepted freelancers
                return #ok(acceptedFreelancers);
            };
        };
    };

    public func getAllTransactions() : async [JobTransaction.JobTransaction] {
        let transactions = Iter.toArray(jobTransactions.vals());
        return transactions;
    };

    public func getTransactionByJobId(job_id : Text) : async Result.Result<JobTransaction.JobTransaction, Text> {
        for ((_, transaction) in jobTransactions.entries()) {
            if (transaction.jobId == job_id) {
                return #ok(transaction);
            };
        };
        return #err("No transaction found for this job");
    };

    public func getTransactionByClientId(client_id : Text) : async [JobTransaction.JobTransaction] {
        let transactions = Iter.toArray(jobTransactions.vals());
        let clientTransactions = Array.filter(
            transactions,
            func(transaction : JobTransaction.JobTransaction) : Bool {
                return transaction.client == client_id;
            },
        );
        return clientTransactions;
    };

    public func getTransactionByFreelancerId(freelancer_id : Text) : async [JobTransaction.JobTransaction]{
        let transactions = Iter.toArray(jobTransactions.vals());

        let freelancerTransactions = Array.filter(
            transactions,
            func(transaction : JobTransaction.JobTransaction) : Bool {
                List.some(
                    transaction.freelancers,
                    func(freelancer : Text) : Bool {
                        freelancer == freelancer_id;
                    },
                );
            },
        );

        return freelancerTransactions;
    };

    public func getClientHistory(client_id : Text) : async [JobTransaction.JobTransaction] {
        let transactions = Iter.toArray(jobTransactions.vals());
        let clientTransactions = Array.filter(
            transactions,
            func(transaction : JobTransaction.JobTransaction) : Bool {
                return transaction.client == client_id;
            },
        );
        return clientTransactions;
    };

    public func getFreelancerHistory(freelancer_id : Text) : async [JobTransaction.JobTransaction] {
        let transactions = Iter.toArray(jobTransactions.vals());

        let freelancerTransactions = Array.filter(
            transactions,
            func(transaction : JobTransaction.JobTransaction) : Bool {
                List.some(
                    transaction.freelancers,
                    func(freelancer : Text) : Bool {
                        freelancer == freelancer_id;
                    },
                );
            },
        );

        return freelancerTransactions;
    };

};
