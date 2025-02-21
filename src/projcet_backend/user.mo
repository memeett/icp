import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Nat64 "mo:base/Nat64";
import Float "mo:base/Float";

actor class UserModel() {
    public type User = {
        id: Text;
        username: Text;
        email: Text;
        wallet: Text;  // BTC address
        ckbtcBalance: Nat64;
        rating: Float;
        createdAt: Int;
        updatedAt: Int;
    };

    // CKBTC Ledger interface
    type Account = {
        owner : Principal;
        subaccount : ?[Nat8];
    };

    // Testnet canister IDs
    let CKBTC_LEDGER_CANISTER_ID = "ml52i-qqaaa-aaaar-qaaba-cai";   
    let CKBTC_MINTER_CANISTER_ID = "mr54i-mqaaa-aaaar-qaaba-cai";

    let auth = actor ("asrmz-lmaaa-aaaaa-qaaeq-cai") : actor {
        setToken : (id : Text) -> async ();
        getToken : () -> async Text;
    };

    private let users = HashMap.HashMap<Text, User>(0, Text.equal, Text.hash);

    // Create user with CKBTC wallet
    public func createUser(newid : Text) : async User {
        let timestamp = Time.now();
        
        // Get BTC deposit address for the user
        let minter = actor(CKBTC_MINTER_CANISTER_ID) : actor {
            get_btc_address : shared { } -> async Text;
        };
        
        let btcAddress = try {
            await minter.get_btc_address({})
        } catch (_) {
            "pending"  // Default value if address generation fails
        };

        let newUser : User = {
            id = newid;
            username = "";
            email = "";
            wallet = btcAddress;
            ckbtcBalance = 0;
            rating = 0.0;
            createdAt = timestamp;
            updatedAt = timestamp;
        };

        users.put(newid, newUser);
        newUser
    };

    // Get CKBTC balance for user
    public shared(_) func getCKBTCBalance(userId: Text) : async Result.Result<Nat64, Text> {
        switch (users.get(userId)) {
            case (?user) {
                let ledger = actor(CKBTC_LEDGER_CANISTER_ID) : actor {
                    icrc1_balance_of : shared { owner : Principal; subaccount : ?[Nat8] } -> async Nat64;
                };

                try {
                    let balance = await ledger.icrc1_balance_of({ 
                        owner = Principal.fromText(userId); 
                        subaccount = null 
                    });
                    
                    // Update user's balance in our records
                    let updatedUser = {
                        user with
                        ckbtcBalance = balance;
                        updatedAt = Time.now();
                    };
                    users.put(userId, updatedUser);
                    
                    #ok(balance)
                } catch (_) {
                    #err("Balance check failed")
                }
            };
            case null { #err("User not found") };
        }
    };

    // Transfer CKBTC between users
    public shared(_) func transferCKBTC(fromUserId: Text, toUserId: Text, amount: Nat64) : async Result.Result<Text, Text> {
        switch (users.get(fromUserId), users.get(toUserId)) {
            case (?fromUser, ?toUser) { 
                let ledger = actor(CKBTC_LEDGER_CANISTER_ID) : actor {
                    icrc1_transfer : shared {
                        to : { owner : Principal; subaccount : ?[Nat8] };
                        amount : Nat64;
                        fee : ?Nat64;
                        memo : ?[Nat8];
                        from_subaccount : ?[Nat8];
                        created_at_time : ?Nat64;
                    } -> async Result.Result<Nat64, Text>;
                };

                try {
                    let transfer_args = {
                        to = { 
                            owner = Principal.fromText(toUserId); 
                            subaccount = null 
                        };
                        amount = amount;
                        fee = null;
                        memo = null;
                        from_subaccount = null;
                        created_at_time = null;
                    };
                    
                    let result = await ledger.icrc1_transfer(transfer_args);
                    switch(result) {
                        case (#ok(_)) { #ok("Transfer successful") };
                        case (#err(e)) { #err(e) };
                    }
                } catch (_) {
                    #err("Transfer failed")
                }
            };
            case (_, _) { #err("One or both users not found") };
        }
    };

    // Get BTC deposit address
    public shared(_) func getDepositAddress(userId: Text) : async Result.Result<Text, Text> {
        switch (users.get(userId)) {
            case (?user) {
                if (user.wallet != "pending") {
                    #ok(user.wallet)
                } else {
                    let minter = actor(CKBTC_MINTER_CANISTER_ID) : actor {
                        get_btc_address : shared { } -> async Text;
                    };
                    
                    try {
                        let address = await minter.get_btc_address({});
                        let updatedUser = {
                            user with
                            wallet = address;
                            updatedAt = Time.now();
                        };
                        users.put(userId, updatedUser);
                        #ok(address)
                    } catch (_) {
                        #err("Failed to get deposit address")
                    }
                }
            };
            case null { #err("User not found") };
        }
    };

    // Existing methods
    public func getAllUser(): async [User] {
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
                let updatedUser: User = {
                    currUser with
                    username = username;
                    updatedAt = Time.now();
                };
                users.put(userId, updatedUser);
                #ok(updatedUser)
            };
            case null { #err("User not found") };
        }
    };
}