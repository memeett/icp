import User "./model";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Debug "mo:base/Debug";

actor UserModel{
    let session = actor ("bw4dl-smaaa-aaaaa-qaacq-cai") : actor {
        createSession : (userid : Text) -> async Text;
        getUserIdBySession : (sessionId: Text) -> async Result.Result<Text, Text>
    };

    private stable var usersEntries : [(Text, User.User)] = [];
    
    private var users = HashMap.fromIter<Text, User.User>(
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
        users := HashMap.fromIter<Text, User.User>(
            usersEntries.vals(),
            0,
            Text.equal,
            Text.hash
        );
        usersEntries := [];
    };

    public func createUser(newid : Text, profilePic: Blob) : async User.User{
        let timestamp = Time.now();

        let newUser : User.User = {
            id= newid;
            profilePicture= profilePic;
            username = "";  
            email = "";
            description= "";
            wallet = "";
            rating = 0.0;
            createdAt = timestamp;
            updatedAt = timestamp;
            isFaceRecognitionOn = false;
        };

        users.put(newid, newUser);
        newUser
    };

    public func getAllUser(): async [User.User]{
        Iter.toArray(users.vals());
    };

    public func getUserById(userId: Text) : async Result.Result<User.User, Text> {
        switch (users.get(userId)) {
            case (?user) { #ok(user) };
            case null { #err("User not found") };
        }
    };

    public func login(id : Text, profilePic: Blob) : async Text {
        let currUser = switch(users.get(id)) {
            case (?user) user;  
            case null {
                let newUser = await createUser(id, profilePic);
                newUser
            };
        };

        let sessionId = await session.createSession(currUser.id);

        return sessionId;
    };

    public func updateUser(sessionid: Text, payload: User.UpdateUserPayload) : async Result.Result<User.User, Text> {
        let userIdResult = await session.getUserIdBySession(sessionid);
        switch (userIdResult) {
            case (#ok(userId)) {
                switch (users.get(userId)) {
                    case (?currUser) {
                        let timestamp = Time.now();
                        let updatedUser: User.User = {
                            id = currUser.id;
                            profilePicture = currUser.profilePicture;
                            username = Option.get(payload.username, currUser.username);
                            email = Option.get(payload.email, currUser.email);
                            description = Option.get(payload.description, currUser.description);
                            wallet = currUser.wallet;
                            rating = currUser.rating;
                            createdAt = currUser.createdAt;
                            updatedAt = timestamp;
                            isFaceRecognitionOn = currUser.isFaceRecognitionOn;
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

    public func deleteUser(userID: Text) : async (){
        switch(users.get(userID)){
            case(?user){
                users.delete(userID);
                Debug.print(user.username);
            };
            case null{

            };
        }
    }
}