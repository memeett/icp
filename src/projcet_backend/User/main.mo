import User "./model";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import Nat64 "mo:base/Nat64";



actor UserModel {
    let session = actor ("by6od-j4aaa-aaaaa-qaadq-cai") : actor {

        createSession : (userid : Text) -> async Text;
        getUserIdBySession : (sessionId : Text) -> async Result.Result<Text, Text>;
    };

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

    public func createUser(newid : Text, profilePic : Blob) : async User.User {
        let timestamp = Time.now();

        let newUser : User.User = {
            id = newid;
            profilePicture = profilePic;
            username = "";
            dob = "";
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

    public func login(id : Text, profilePic : Blob) : async Text {
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

    public func updateUser(sessionid : Text, payload : User.UpdateUserPayload) : async Result.Result<User.User, Text> {
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
            case (?user) {
                users.delete(userID);
                Debug.print(user.username);
            };
            case null {

            };
        };
    };

    public shared func transfer_ckbtc(from : Text, to : Text, amount : Nat64) : async Result.Result<Text, Text> {
        switch (users.get(from)) {
            case (?fromUser) {
                if (fromUser.wallet < Float.fromInt(Nat64.toNat(amount))) {
                    #err("Insufficient balance");
                } else {
                    switch (users.get(to)) {
                        case (?toUser) {
                            let fromNewBalance = fromUser.wallet - Float.fromInt(Nat64.toNat(amount));
                            let updatedFromUser : User.User = {
                                id = fromUser.id;
                                profilePicture = fromUser.profilePicture;
                                username = fromUser.username;
                                description = fromUser.description;
                                dob = fromUser.dob;
                                wallet = fromNewBalance;
                                rating = fromUser.rating;
                                createdAt = fromUser.createdAt;
                                updatedAt = Time.now();
                                isFaceRecognitionOn = fromUser.isFaceRecognitionOn;
                            };
                            users.put(from, updatedFromUser);

                            let toNewBalance = toUser.wallet + Float.fromInt(Nat64.toNat(amount));
                            let updatedToUser : User.User = {
                                id = toUser.id;
                                profilePicture = toUser.profilePicture;
                                username = toUser.username;
                                description = toUser.description;
                                dob = toUser.dob;
                                wallet = toNewBalance;
                                rating = toUser.rating;
                                createdAt = toUser.createdAt;
                                updatedAt = Time.now();
                                isFaceRecognitionOn = toUser.isFaceRecognitionOn;
                            };
                            users.put(to, updatedToUser);

                            #ok("Transferred ckBTC successfully");
                        };
                        case null {
                            #err("Recipient not found");
                        };
                    };
                };
            };
            case null {
                #err("Sender not found");
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

    public shared func topUpCkBTC(userId: Text, amount: Float) : async Result.Result<Text, Text> {
        switch (users.get(userId)) {
            case (?user) {
                let newBalance = user.wallet + amount;
                let updatedUser: User.User = {
                    id = user.id;
                    profilePicture = user.profilePicture;
                    username = user.username;
                    description = user.description;
                    dob = user.dob;
                    wallet = newBalance;
                    rating = user.rating;
                    createdAt = user.createdAt;
                    updatedAt = Time.now();
                    isFaceRecognitionOn = user.isFaceRecognitionOn;
                };
                users.put(userId, updatedUser);
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
};
