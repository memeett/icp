import Inbox "./model";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Job "canister:job";

actor InboxModule {
    private stable var nextId : Nat = 0;

    private stable var inboxEntries : [(Text, Inbox.Inbox)] = [];

    private var inboxes = HashMap.fromIter<Text, Inbox.Inbox>(
        inboxEntries.vals(),
        0,
        Text.equal,
        Text.hash
    );

    system func preupgrade() {
        inboxEntries := Iter.toArray(inboxes.entries());
    };

    system func postupgrade() {
        inboxes := HashMap.fromIter<Text, Inbox.Inbox>(
            inboxEntries.vals(),
            0,
            Text.equal,
            Text.hash
        );
        inboxEntries := [];
    };

    public func createInbox(receiverId : Text, jobId: Text, senderId : Text, inbox_type : Text, message: Text) : async Result.Result<Inbox.Inbox, Text> {
        let inboxId = Int.toText(nextId);   
        let jobResult = await Job.getJob(jobId);
        let jobName = switch (jobResult) {
            case (#err(_)) { "Unknown Job" };
            case (#ok(job)) { job.jobName }; 
        };
        

        let formattedMessage = "You have received a new " # inbox_type # " for " # jobName # "! \n" # message;
        let newInbox : Inbox.Inbox = {
            id = inboxId;
            jobId = jobId;
            receiverId = receiverId;
            senderId = senderId;
            inbox_type = inbox_type; //  submission/application/invitation
            message = formattedMessage;
            read = false;
            createdAt = Time.now();
        };
        nextId += 1;
        inboxes.put(inboxId, newInbox);
        #ok(newInbox);
    };

    public func getInbox(inboxId : Text) : async Result.Result<Inbox.Inbox, Text> {
        switch (inboxes.get(inboxId)) {
            case (null) { #err("Inbox not found") };
            case (?inbox) { #ok(inbox) };
        };
    };

    public func getAllInbox() : async [Inbox.Inbox] {
        Iter.toArray(inboxes.vals());
    };

    public func getReceiverInbox(clientId : Text) : async [Inbox.Inbox] {
        let allInbox = Iter.toArray(inboxes.vals());
        let userInbox = Array.filter(
            allInbox,
            func(inbox : Inbox.Inbox) : Bool {
                inbox.receiverId == clientId;
            },
        );
        userInbox;
    };

    public func getSenderInbox(freelancerId : Text) : async [Inbox.Inbox] {
        let allInbox = Iter.toArray(inboxes.vals());
        let userInbox = Array.filter(
            allInbox,
            func(inbox : Inbox.Inbox) : Bool {
                inbox.senderId == freelancerId;
            },
        );
        userInbox;
    };

    // public func updateInboxStatus(inboxId : Text, status : Text) : async Result.Result<Inbox.Inbox, Text> {
    //     switch (inboxes.get(inboxId)) {
    //         case (null) {
    //             #err("Inbox not found")
    //         };
    //         case (?inbox) {
    //             let updatedInbox : Inbox.Inbox = {
    //                 id = inbox.id;
    //                 jobId = inbox.jobId;
    //                 receiverId = inbox.receiverId;
    //                 senderId = inbox.senderId;
    //                 inbox_type = inbox.inbox_type;
    //                 message = inbox.message;
    //                 read = inbox.read;
    //                 createdAt = inbox.createdAt;
    //             };
    //             inboxes.put(inboxId, updatedInbox);
    //             #ok(updatedInbox);
    //         };
    //     };
    // };

    public func getAllInboxByUserId(userId : Text) : async [Inbox.Inbox] {
        // Debug.print("Fetching inbox for user: " # userId);
        let allInbox = Iter.toArray(inboxes.vals());
        let userInbox = Array.filter(
            allInbox,
            func(inbox : Inbox.Inbox) : Bool {
                inbox.receiverId == userId
            },
        );
        // Debug.print("Inbox fetched for user: " # userId # " with count: " # Int.toText(Array.size(userInbox)));
        
        userInbox;
    };

    // public func getAllInboxByStatus(status : Text) : async [Inbox.Inbox] {
    //     let allInbox = Iter.toArray(inboxes.vals());
    //     let userInbox = Array.filter(
    //         allInbox,
    //         func(inbox : Inbox.Inbox) : Bool {
    //             inbox.status == status;
    //         },
    //     );
    //     userInbox;
    // };

    public func getAllInboxBySubmissionType(inbox_type : Text) : async [Inbox.Inbox] {
        let allInbox = Iter.toArray(inboxes.vals());
        let userInbox = Array.filter(
            allInbox,
            func(inbox : Inbox.Inbox) : Bool {
                inbox.inbox_type == inbox_type;
            },
        );
        userInbox;
    };

    public func markAsRead(inboxId : Text) : async Result.Result<Inbox.Inbox, Text> {
        switch (inboxes.get(inboxId)) {
            case (null) {
                #err("Inbox not found")
            };
            case (?inbox) {
                let updatedInbox : Inbox.Inbox = {
                    id = inbox.id;
                    jobId = inbox.jobId;
                    receiverId = inbox.receiverId;
                    senderId = inbox.senderId;
                    inbox_type = inbox.inbox_type;
                    read = true;
                    createdAt = inbox.createdAt;
                    message = inbox.message;
                };
                inboxes.put(inboxId, updatedInbox);
                #ok(updatedInbox);
            };
        };
    };

    
    
};