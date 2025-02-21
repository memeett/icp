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

    let auth = actor ("asrmz-lmaaa-aaaaa-qaaeq-cai") : actor {
        setToken : (id : Text) -> async ();
        getToken : () -> async Text;
    };


    private let users = HashMap.HashMap<Text, User>(0, Text.equal, Text.hash);

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

    public func login(id : Text) : async Result.Result<User, Text> {
        let currUser = switch(users.get(id)) {
            case (?user) user;  
            case null {
                let newUser = await createUser(id);
                newUser
            };
        };

        await auth.setToken(id);

        return #ok(currUser);
    };

    public func updateUser(username: Text) : async Result.Result<User, Text> {
        let userId = await auth.getToken(); 
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
                return #ok(updatedUser);
            };
            case null {
                return #err("User not found");
            };
        }
    };
};
