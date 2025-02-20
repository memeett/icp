import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";

import Error "mo:base/Error";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import User "../model/User";

actor UserController {
  private stable var nextId : Nat = 0;
  private var users = HashMap.HashMap<Text, User.User>(0, Text.equal, Text.hash);

  // Create User
  public func createUser(payload: User.CreateUserPayload) : async Result.Result<User.User, Text> {
    let userId = Int.toText(nextId);
    let timestamp = Time.now();
    
    let newUser : User.User = {
      id = userId;
      username = payload.username;
      email = payload.email;
      role = payload.role;
      wallet = payload.wallet;
      rating = 0.0;
      createdAt = timestamp;
      updatedAt = timestamp;
    };

    users.put(userId, newUser);
    nextId += 1;
    
    #ok(newUser)
  };

  // Read User
  public query func getUser(userId: Text) : async Result.Result<User.User, Text> {
    switch (users.get(userId)) {
      case (?user) { #ok(user) };
      case null { #err("User not found") };
    }
  };

  // Update User
  public func updateUser(userId: Text, payload: User.UpdateUserPayload) : async Result.Result<User.User, Text> {
    switch (users.get(userId)) {
      case (?existingUser) {
        let updatedUser : User.User = {
          id = existingUser.id;
          username = Option.get(payload.username, existingUser.username);
          email = Option.get(payload.email, existingUser.email);
          role = existingUser.role;
          wallet = Option.get(payload.wallet, existingUser.wallet);
          rating = existingUser.rating;
          createdAt = existingUser.createdAt;
          updatedAt = Time.now();
        };
        
        users.put(userId, updatedUser);
        #ok(updatedUser)
      };
      case null { #err("User not found") };
    }
  };

  // Delete User
  public func deleteUser(userId: Text) : async Result.Result<(), Text> {
    switch (users.get(userId)) {
      case (?_) { 
        users.delete(userId);
        #ok(())
      };
      case null { #err("User not found") };
    }
  };

  // Get All Users
  public query func getAllUsers() : async [User.User] {
    Iter.toArray(users.vals())
  };
}
