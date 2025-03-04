import JobTransaction "../JobTransaction/model";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Job "../Job/model";
import User "../User/model";
import Invitation "../Invitation/model";
import Applier "../Applier/model";

actor JobTransactionModel {
    private stable var nextId : Int = 0;

    private stable var jobTransactionEntries : [(Int, JobTransaction.JobTransaction)] = [];

    private func intHash(n : Int) : Hash.Hash {
        let text = Int.toText(n);
        let hash = Text.hash(text);
        hash;
    };

    private var jobTransactions = HashMap.HashMap<Int, JobTransaction.JobTransaction>(
        0,
        Int.equal,
        intHash,
    );

    system func preupgrade() {
        jobTransactionEntries := Iter.toArray(jobTransactions.entries());
    };

    system func postupgrade() {
        jobTransactions := HashMap.fromIter<Int, JobTransaction.JobTransaction>(
            jobTransactionEntries.vals(),
            0,
            Int.equal,
            intHash,
        );
        jobTransactionEntries := [];
    };

    let jobActor = actor ("bd3sg-teaaa-aaaaa-qaaba-cai") : actor {
        getJob : (Text) -> async Result.Result<Job.Job, Text>;
    };

    let applierActor = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
        getAcceptedAppliers : (Text) -> async Result.Result<[Applier.Applier], Text>;
    };

    let invitationActor = actor ("be2us-64aaa-aaaaa-qaabq-cai") : actor {
        getAcceptedJobInvitations : (Text) -> async Result.Result<[Invitation.Invitation], Text>;
    };

    public func createTransaction(owner_id : Text, job_id : Text) : async Result.Result<JobTransaction.JobTransaction, Text> {
        try {
            let jobResult = await jobActor.getJob(job_id);

            switch (jobResult) {
                case (#err(error)) {
                    return #err("Failed to fetch job: " # error);
                };
                case (#ok(job)) {
                    if (job.userId != owner_id) {
                        return #err("Unauthorized: Only job owner can create transactions");
                    };

                    let acceptedAppliersResult = await applierActor.getAcceptedAppliers(job_id);
                    let acceptedAppliers = switch (acceptedAppliersResult) {
                        case (#ok(appliers)) { appliers };
                        case (#err(error)) {
                            return #err("Failed to fetch accepted appliers: " # error);
                        };
                    };

                    let acceptedInvitationsResult = await invitationActor.getAcceptedJobInvitations(job_id);
                    let acceptedInvitations = switch (acceptedInvitationsResult) {
                        case (#ok(invitations)) { invitations };
                        case (#err(error)) {
                            return #err("Failed to fetch accepted invitations: " # error);
                        };
                    };

                    let freelancerIdsFromAppliers = Array.map(
                        acceptedAppliers,
                        func(applier : Applier.Applier) : Text {
                            applier.userId 
                        },
                    );

                    let freelancerIdsFromInvitations = Array.map(
                        acceptedInvitations,
                        func(invitation : Invitation.Invitation) : Text {
                            invitation.user_id 
                        },
                    );

                    let allFreelancerIds = Array.append(freelancerIdsFromAppliers, freelancerIdsFromInvitations);

                    let transaction : JobTransaction.JobTransaction = {
                        transactionId = nextId;
                        jobId = job_id;
                        freelancers = List.fromArray(allFreelancerIds); 
                        client = owner_id;
                    };

                    nextId := nextId + 1;
                    jobTransactions.put(transaction.transactionId, transaction);
                    #ok(transaction);
                };
            };
        } catch (e) {
            return #err("Internal Server Error");
        };
    };

    public func updateTransaction(transaction_id : Int, freelancers : List.List<Text>) : async Result.Result<JobTransaction.JobTransaction, Text> {
        switch (jobTransactions.get(transaction_id)) {
            case (null) {
                return #err("No transaction found for this id");
            };
            case (?transaction) {
                let updatedTransaction : JobTransaction.JobTransaction = {
                    transactionId = transaction_id;
                    jobId = transaction.jobId;
                    freelancers = freelancers;
                    client = transaction.client;
                };
                jobTransactions.put(transaction_id, updatedTransaction);
                #ok(updatedTransaction);
            };
        };
    };

    public func getAllTransactions() : async List.List<JobTransaction.JobTransaction> {
        let transactions = jobTransactions.vals();
        List.fromArray(Iter.toArray(transactions));
    };

    public func getTransactionByJobId(job_id : Text) : async Result.Result<JobTransaction.JobTransaction, Text> {
        for ((_, transaction) in jobTransactions.entries()) {
            if (transaction.jobId == job_id) {
                return #ok(transaction);
            };
        };
        return #err("No transaction found for this job");
    };

    public func getTransactionById(transaction_id : Int) : async Result.Result<JobTransaction.JobTransaction, Text> {
        switch (jobTransactions.get(transaction_id)) {
            case (null) {
                return #err("No transaction found for this id");
            };
            case (?transaction) {
                return #ok(transaction);
            };
        };
    };

    public func getTransactionByClientId(client_id : Text) : async List.List<JobTransaction.JobTransaction> {
        let transactions = Iter.toArray(jobTransactions.vals());
        let clientTransactions = Array.filter(
            transactions,
            func(transaction : JobTransaction.JobTransaction) : Bool {
                return transaction.client == client_id;
            },
        );
        List.fromArray(clientTransactions);
    };

    public func getTransactionByFreelancerId(freelancer_id : Text) : async List.List<JobTransaction.JobTransaction> {
        let transactions = Iter.toArray(jobTransactions.vals());

        let freelancerTransactions = Array.filter(
            transactions,
            func(transaction : JobTransaction.JobTransaction) : Bool {
                // Check if the freelancer_id exists in the transaction's freelancers list
                List.some(
                    transaction.freelancers,
                    func(freelancer : Text) : Bool {
                        freelancer == freelancer_id;
                    },
                );
            },
        );

        List.fromArray(freelancerTransactions);
    };

    public func getClientHistory(client_id : Text) : async List.List<JobTransaction.JobTransaction> {
        let transactions = Iter.toArray(jobTransactions.vals());
        let clientTransactions = Array.filter(
            transactions,
            func(transaction : JobTransaction.JobTransaction) : Bool {
                return transaction.client == client_id;
            },
        );
        List.fromArray(clientTransactions);
    };

    public func getFreelancerHistory(freelancer_id : Text) : async List.List<JobTransaction.JobTransaction> {
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

        List.fromArray(freelancerTransactions);
    };

};
