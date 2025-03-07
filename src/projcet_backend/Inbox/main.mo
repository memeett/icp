import Inbox "./model";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

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

    public func createInbox(receiverId : Text, senderId : Text, submission_type : Text, status : Text) : async Result.Result<Inbox.Inbox, Text> {
        let inboxId = Int.toText(nextId);
        let newInbox : Inbox.Inbox = {
            id = inboxId;
            receiverId = receiverId;
            senderId = senderId;
            submission_type = submission_type;
            status = status;
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

    public func updateInboxStatus(inboxId : Text, status : Text) : async Result.Result<Inbox.Inbox, Text> {
        switch (inboxes.get(inboxId)) {
            case (null) {
                #err("Inbox not found")
            };
            case (?inbox) {
                let updatedInbox : Inbox.Inbox = {
                    id = inbox.id;
                    receiverId = inbox.receiverId;
                    senderId = inbox.senderId;
                    submission_type = inbox.submission_type;
                    status = status;
                    read = inbox.read;
                    createdAt = inbox.createdAt;
                };
                inboxes.put(inboxId, updatedInbox);
                #ok(updatedInbox);
            };
        };
    };

    public func getAllInboxByUserId(userId : Text) : async [Inbox.Inbox] {
        let allInbox = Iter.toArray(inboxes.vals());
        let userInbox = Array.filter(
            allInbox,
            func(inbox : Inbox.Inbox) : Bool {
                inbox.receiverId == userId
            },
        );
        userInbox;
    };

    public func acceptInbox(inboxId : Text) : async Result.Result<Inbox.Inbox, Text> {
        switch (inboxes.get(inboxId)) {
            case (null) {
                #err("Inbox not found")
            };
            case (?inbox) {
                let updatedInbox : Inbox.Inbox = {
                    id = inbox.id;
                    receiverId = inbox.receiverId;
                    senderId = inbox.senderId;
                    submission_type = inbox.submission_type;
                    status = "Accepted";
                    read = inbox.read;
                    createdAt = inbox.createdAt;
                };
                inboxes.put(inboxId, updatedInbox);
                #ok(updatedInbox);
            };
        };
    };

    public func rejectInbox(inboxId : Text) : async Result.Result<Inbox.Inbox, Text> {
        switch (inboxes.get(inboxId)) {
            case (null) {
                #err("Inbox not found")
            };
            case (?inbox) {
                let updatedInbox : Inbox.Inbox = {
                    id = inbox.id;
                    receiverId = inbox.receiverId;
                    senderId = inbox.senderId;
                    submission_type = inbox.submission_type;
                    status = "Rejected";
                    read = inbox.read;
                    createdAt = inbox.createdAt;
                };
                inboxes.put(inboxId, updatedInbox);
                #ok(updatedInbox);
            };
        };
    };

    public func getAllInboxByStatus(status : Text) : async [Inbox.Inbox] {
        let allInbox = Iter.toArray(inboxes.vals());
        let userInbox = Array.filter(
            allInbox,
            func(inbox : Inbox.Inbox) : Bool {
                inbox.status == status;
            },
        );
        userInbox;
    };

    public func getAllInboxBySubmissionType(submission_type : Text) : async [Inbox.Inbox] {
        let allInbox = Iter.toArray(inboxes.vals());
        let userInbox = Array.filter(
            allInbox,
            func(inbox : Inbox.Inbox) : Bool {
                inbox.submission_type == submission_type;
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
                    receiverId = inbox.receiverId;
                    senderId = inbox.senderId;
                    submission_type = inbox.submission_type;
                    status = inbox.status;
                    read = true;
                    createdAt = inbox.createdAt;
                };
                inboxes.put(inboxId, updatedInbox);
                #ok(updatedInbox);
            };
        };
    };

    
    
};