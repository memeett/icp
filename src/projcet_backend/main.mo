import Debug "mo:base/Debug";
import Text "mo:base/Text";
actor {
  public query func greet(name : Text) : async Text {
    Debug.print("asdasdsada");
    return "Hello, " # name # "!";
  };

};
