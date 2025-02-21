import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Iter "mo:base/Iter";

actor UserModel{
    public type User = {
        id: Text;
        username: Text;
        email: Text;
        wallet: Text;
        rating: Float;
        createdAt: Int;
        updatedAt: Int;
    };

    let session = actor ("aax3a-h4aaa-aaaaa-qaahq-cai") : actor {
        createSession : (userid : Text) -> async Text;
        getUserIdBySession : (sessionId: Text) -> async Result.Result<Text, Text>
    };

    private stable var usersEntries : [(Text, User)] = [];
    
    private var users = HashMap.fromIter<Text, User>(
        usersEntries.vals(),
        0,
        Text.equal,
        Text.hash
    );

    // Save state before upgrade
    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
    };

    // Restore state after upgrade
    system func postupgrade() {
        users := HashMap.fromIter<Text, User>(
            usersEntries.vals(),
            0,
            Text.equal,
            Text.hash
        );
        usersEntries := [];
    };

    public func createUser(newid : Text) : async User{
        let timestamp = Time.now();

        let newUser : User = {
            id= newid;
            username = "";  
            email = "";
            wallet = "";
            rating = 0.0;
            createdAt = timestamp;
            updatedAt = timestamp;
        };

        users.put(newid, newUser);
        newUser
    };

    public func getAllUser(): async [User]{
        Iter.toArray(users.vals());
    };

    public func getUserById(userId: Text) : async Result.Result<User, Text> {
        switch (users.get(userId)) {
            case (?user) { #ok(user) };
            case null { #err("User not found") };
        }
    };

    public func login(id : Text) : async Result.Result<Text, Text> {
        let currUser = switch(users.get(id)) {
            case (?user) user;  
            case null {
                let newUser = await createUser(id);
                newUser
            };
        };

        let sessionId = await session.createSession(currUser.id);

        return #ok(sessionId);
    };

    public func updateUser(sessionid: Text, username: Text) : async Result.Result<User, Text> {
        let userIdResult = await session.getUserIdBySession(sessionid);
        switch (userIdResult) {
            case (#ok(userId)) {
                switch (users.get(userId)) {
                    case (?currUser) {
                        let timestamp = Time.now();
                        let updatedUser: User = {
                            id = currUser.id;
                            username = username;
                            email = currUser.email;
                            wallet = currUser.wallet;
                            rating = currUser.rating;
                            createdAt = currUser.createdAt;
                            updatedAt = timestamp;
                        };
                        users.put(userId, updatedUser);
                        #ok(updatedUser)
                    };
                    case null { #err("User not found") };
                }
            };
            case (#err(msg)) { #err(msg) };
        }
    };

};
