import User "./model";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Job "../Job/model";

actor UserModel {

    

    private stable var usersEntries : [(Text, User.User)] = [];

    private var users = HashMap.fromIter<Text, User.User>(
        usersEntries.vals(),
        0,
        Text.equal,
        Text.hash,
    );

    // Save state before upgrade
    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
    };

    // Restore state after upgrade
    system func postupgrade() {
        users := HashMap.fromIter<Text, User.User>(
            usersEntries.vals(),
            0,
            Text.equal,
            Text.hash,
        );
        usersEntries := [];
    };


    stable var cashFlowHistories: [User.CashFlowHistory] = [];

    // Function to add a transaction record
    private func addTransaction(transaction: User.CashFlowHistory) {
        cashFlowHistories := Array.append(cashFlowHistories, [transaction]);
    };

    public func createUser(newid : Text, profilePic : Blob) : async User.User {
        let timestamp = Time.now();

        let newUser : User.User = {
            id = newid;
            profilePicture = profilePic;
            username = "";
            dob = "";
            preference = [];
            description = "";
            wallet = 0.0;
            rating = 0.0;
            createdAt = timestamp;
            updatedAt = timestamp;
            isFaceRecognitionOn = false;
        };

        users.put(newid, newUser);
        newUser;
    };

    public func getAllUser() : async [User.User] {
        Iter.toArray(users.vals());
    };

    public func getUserById(userId : Text) : async Result.Result<User.User, Text> {
        switch (users.get(userId)) {
            case (?user) { #ok(user) };
            case null { #err("User not found") };
        };
    };

    public func login(id : Text, profilePic : Blob, session_canister: Text) : async Text {
        let session = actor (session_canister) : actor {
            createSession : (userid : Text) -> async Text;
        };
        let currUser = switch (users.get(id)) {
            case (?user) user;
            case null {
                let newUser = await createUser(id, profilePic);
                newUser;
            };
        };

        let sessionId = await session.createSession(currUser.id);

        return sessionId;
    };

    public func updateUser(sessionid : Text, payload : User.UpdateUserPayload, session_canister: Text) : async Result.Result<User.User, Text> {
        let session = actor (session_canister) : actor {
            getUserIdBySession : (sessionId : Text) -> async Result.Result<Text, Text>;
        };
        let userIdResult = await session.getUserIdBySession(sessionid);
        switch (userIdResult) {
            case (#ok(userId)) {
                switch (users.get(userId)) {
                    case (?currUser) {
                        let timestamp = Time.now();
                        let updatedUser : User.User = {
                            id = currUser.id;
                            profilePicture = Option.get(payload.profilePicture, currUser.profilePicture);
                            username = Option.get(payload.username, currUser.username);
                            dob = Option.get(payload.dob, currUser.dob);
                            description = Option.get(payload.description, currUser.description);
                            preference = Option.get(payload.preference, currUser.preference);
                            wallet = currUser.wallet;
                            rating = currUser.rating;
                            createdAt = currUser.createdAt;
                            updatedAt = timestamp;
                            isFaceRecognitionOn = currUser.isFaceRecognitionOn;
                        };
                        users.put(userId, updatedUser);
                        #ok(updatedUser);
                    };
                    case null { #err("User not found") };
                };
            };
            case (#err(msg)) { #err(msg) };
        };
    };

    public func deleteUser(userID : Text) : async () {
        switch (users.get(userID)) {
            case (?_user) {
                users.delete(userID);
            };
            case null {

            };
        };
    };

    public shared func transfer_icp_to_user(from_job_id: Text, to_user_id: Text, amount: Float, job_canister: Text) : async Result.Result<Text, Text> {

        // Dynamically create the job actor
        let jobActor = actor(job_canister) : actor {
            getJob: (jobId : Text) -> async Result.Result<Job.Job, Text>;
            putJob: (job_id: Text, job: Job.Job) -> async ();
        };

        // Step 1: Fetch the job's wallet balance
        let jobResult = await jobActor.getJob(from_job_id);
        switch (jobResult) {
            case (#ok(jobData)) {
                // Debug: Print the job data

                // Step 2: Validate the job's wallet balance
                if (jobData.wallet < amount) {
                    return #err("Insufficient balance in job wallet");
                };

                // Step 3: Fetch the recipient user's details
                switch (users.get(to_user_id)) {
                    case (?toUser) {
                        // Step 4: Update the job's wallet
                        let updatedJobWallet = jobData.wallet - amount;
                        let updatedJob : Job.Job = {
                            id = jobData.id;
                            jobName = jobData.jobName;
                            jobDescription = jobData.jobDescription;
                            jobSalary = jobData.jobSalary;
                            jobRating = jobData.jobRating;
                            jobTags = jobData.jobTags;
                            jobSlots = jobData.jobSlots;
                            jobStatus = jobData.jobStatus;
                            userId = jobData.userId;
                            createdAt = jobData.createdAt;
                            updatedAt = Time.now();
                            wallet = updatedJobWallet;
                        };
                        await jobActor.putJob(from_job_id, updatedJob);

                        // Step 5: Update the recipient user's wallet
                        let updatedUserWallet = toUser.wallet + amount;
                        let updatedToUser : User.User = {
                            id = toUser.id;
                            profilePicture = toUser.profilePicture;
                            username = toUser.username;
                            description = toUser.description;
                            preference = toUser.preference;
                            dob = toUser.dob;
                            wallet = updatedUserWallet;
                            rating = toUser.rating;
                            createdAt = toUser.createdAt;
                            updatedAt = Time.now();
                            isFaceRecognitionOn = toUser.isFaceRecognitionOn;
                        };
                        users.put(to_user_id, updatedToUser);

                        // Step 6: Record the transaction
                        addTransaction({
                            fromId = from_job_id; // Job ID as the sender
                            transactionAt = Time.now();
                            amount = amount;
                            transactionType = #transfer;
                            toId = ?to_user_id;
                        });

                        // Debug: Print success message

                        return #ok("Transferred ICP from job to user successfully");
                    };
                    case null {
                        return #err("Recipient user not found");
                    };
                };
            };
            case (#err(errMsg)) {
                return #err("Failed to fetch job details: " # errMsg);
            };
        };
    };

    public shared func transfer_icp_to_job(user_id: Text, job_id: Text, amount: Float, job_canister: Text) : async Result.Result<Text, Text> {
        // Dynamically create the job actor
        let jobActor = actor(job_canister) : actor {
            getJob: (jobId : Text) -> async Result.Result<Job.Job, Text>;
            putJob: (job_id: Text, job: Job.Job) -> async ();
        };

        // Fetch the sender's details
        switch (users.get(user_id)) {
            case (?fromUser) {
                // Validate the sender's wallet balance
                if (fromUser.wallet < amount) {
                    return #err("Insufficient balance in sender's wallet");
                };

                // Fetch job details from the jobs canister
                let jobResult = await jobActor.getJob(job_id);
                switch (jobResult) {
                    case (#ok(jobData)) {
                        // Validate if the current user is the owner of the job
                        if (user_id != jobData.userId) {
                            return #err("User is not the owner of the job");
                        };

                        // Update the job wallet and job status (set to "Ongoing")
                        let updatedJob : Job.Job = {
                            id = jobData.id;
                            jobName = jobData.jobName;
                            jobDescription = jobData.jobDescription;
                            jobSalary = jobData.jobSalary;
                            jobRating = jobData.jobRating;
                            jobTags = jobData.jobTags;
                            jobSlots = jobData.jobSlots;
                            jobStatus = "Ongoing";
                            userId = jobData.userId;
                            createdAt = jobData.createdAt;
                            updatedAt = Time.now();
                            wallet = jobData.wallet + amount;
                        };
                        await jobActor.putJob(job_id, updatedJob);

                        // Update the sender's wallet
                        let updatedFromUser : User.User = {
                            id = fromUser.id;
                            profilePicture = fromUser.profilePicture;
                            username = fromUser.username;
                            description = fromUser.description;
                            preference = fromUser.preference;
                            dob = fromUser.dob;
                            wallet = fromUser.wallet - amount;
                            rating = fromUser.rating;
                            createdAt = fromUser.createdAt;
                            updatedAt = Time.now();
                            isFaceRecognitionOn = fromUser.isFaceRecognitionOn;
                        };
                        users.put(user_id, updatedFromUser);

                        // Record the transaction
                        addTransaction({
                            fromId = user_id;
                            transactionAt = Time.now();
                            amount = amount;
                            transactionType = #transferToJob;
                            toId = ?job_id;
                        });

                        return #ok("Transferred ckBTC to job successfully");
                    };
                    case (#err(errMsg)) {
                        return #err("Failed to fetch job details in user: " # errMsg);
                    };
                };
            };
            case null {
                return #err("Sender not found");
            };
        };
    };



    public func getAllFaceRecogUser() : async [User.User] {
        Iter.toArray(
            Iter.filter(
                users.vals(),
                func(user : User.User) : Bool {
                    user.isFaceRecognitionOn;
                },
            )
        );
    };

    public func getUserByName(username : Text) : async Result.Result<User.User, Text> {
        for (user in users.vals()) {
            if (user.username == username) {
                return #ok(user);
            };
        };
        #err("User not found");
    };

    public func isUsernameAvailable(username : Text) : async Bool {
        for (user in users.vals()) {
            if (user.username == username) {
                return false;
            };
        };
        true;
    };

    public shared func topUpICP(userId: Text, amount: Float) : async Result.Result<Text, Text> {
        switch (users.get(userId)) {
            case (?user) {
                let newBalance = user.wallet + amount;
                let updatedUser: User.User = {
                    id = user.id;
                    profilePicture = user.profilePicture;
                    username = user.username;
                    description = user.description;
                    preference = user.preference;
                    dob = user.dob;
                    wallet = newBalance;
                    rating = user.rating;
                    createdAt = user.createdAt;
                    updatedAt = Time.now();
                    isFaceRecognitionOn = user.isFaceRecognitionOn;
                };
                users.put(userId, updatedUser);

                // Save transaction
                addTransaction({
                    fromId = userId;
                    transactionAt = Time.now();
                    amount = amount;
                    transactionType = #topUp;
                    toId = null;
                });

                return #ok("Topped up ckBTC successfully. New balance: " # Float.toText(newBalance));
            };
            case null {
                return #err("User not found");
            };
        };
    };

    // public shared query func estimate_withdrawal_fee(args : { amount : ?Nat64 }) : async {
    //     minter_fee : Nat64;
    //     bitcoin_fee : Nat64;
    // } {
    //     { minter_fee = 1000; bitcoin_fee = 2000 };
    // };

    public query func getUserTransactions(userId: Text): async [User.CashFlowHistory] {
        return Array.filter<User.CashFlowHistory>(cashFlowHistories, func(t: User.CashFlowHistory): Bool {
            t.fromId == userId or (switch (t.toId) { 
                case (?to) to == userId;
                case (_) false;
            })
        });
    };

    public query func getUsernameById(userId: Text): async Text {
        switch (users.get(userId)) {
            case (?user) {
                return user.username;
            };
            case null {
                return "";
            };
        };
    };

    public func updateUserRating(userId: Text, newRating: Float) : async Result.Result<Text, Text> {
    // Step 1: Retrieve the user by userId
        switch (users.get(userId)) {
            case (?user) {
                // Step 2: Update the user's rating
                let updatedUser : User.User = {
                    id = user.id;
                    profilePicture = user.profilePicture;
                    username = user.username;
                    dob = user.dob;
                    preference = user.preference;
                    description = user.description;
                    wallet = user.wallet;
                    rating = newRating; // Update the rating
                    createdAt = user.createdAt;
                    updatedAt = Time.now(); // Update the timestamp
                    isFaceRecognitionOn = user.isFaceRecognitionOn;
                };

                // Step 3: Save the updated user back to the HashMap
                users.put(userId, updatedUser);

                // Step 4: Return success message
                #ok("User rating updated successfully");
            };
            case null {
                // Step 4: Return error if user not found
                #err("User not found");
            };
        };
    };

};
