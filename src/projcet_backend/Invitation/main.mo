import Invitation "./model";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Job "../Job/model";
import User "../User/model";
import Global "../global";

actor InvitationModel{
    private stable var nextId : Int = 0;

    private stable var invitationsEntries : [(Int, Invitation.Invitation)] = [];
    
    private func intHash(n : Int) : Hash.Hash {
        let text = Int.toText(n);
        let hash = Text.hash(text);
        hash
    };

    private var invitations = HashMap.HashMap<Int, Invitation.Invitation>(
        0,
        Int.equal,
        intHash
    );

    system func preupgrade() {
        invitationsEntries := Iter.toArray(invitations.entries());
    };

    system func postupgrade() {
        invitations := HashMap.fromIter<Int, Invitation.Invitation>(
            invitationsEntries.vals(),
            0,
            Int.equal,
            intHash
        );
        invitationsEntries := [];
    };

    let jobActor = actor (Global.canister_id.job) : actor {
        getJob : (Text) -> async Result.Result<Job.Job, Text>;
    };

    public func createInvitation(owner_id : Text, job_id: Text, freelancer_id : Text) : async Result.Result<Invitation.Invitation, Text> {
        try {
            let jobResult = await jobActor.getJob(job_id);
            
            switch (jobResult) {
                case (#err(error)) {
                    return #err("Failed to fetch job: " # error);
                };
                case (#ok(job)) {
                    if (job.userId != owner_id) {
                        return #err("Unauthorized: Only job owner can create invitations");
                    };

                    for ((_, invitation) in invitations.entries()) {
                        if (invitation.job_id == job_id and invitation.user_id == freelancer_id) {
                            return #err("Invitation already exists for this job and freelancer");
                        };
                    };

                    let currentTime = Time.now();
                    
                    let newInvitation : Invitation.Invitation = {
                        id = nextId;
                        user_id = freelancer_id;
                        job_id = job_id;
                        invitedAt = currentTime;
                        isAccepted = false;
                    };

                    invitations.put(nextId, newInvitation);
                    nextId += 1;
                    
                    #ok(newInvitation)
                };
            };
        } catch (error) {
            #err("Failed to interact with job canister: " # Error.message(error))
        };
    };

    public func deleteInvitation(owner_id : Text, invitation_id: Int) : async Bool {
        switch (invitations.get(invitation_id)) {
            case (null) {
                return false;
            };
            case (?invitation) {
                try {
                    let jobResult = await jobActor.getJob(invitation.job_id);
                    
                    switch (jobResult) {
                        case (#err(_)) {
                            return false;
                        };
                        case (#ok(job)) {
                            if (job.userId != owner_id) {
                                return false;
                            };
                            invitations.delete(invitation_id);
                            return true;
                        };
                    };
                } catch (_) {
                    return false;
                };
            };
        };
    };

    public func getInvitationByUserID(user_id: Text) : async [Invitation.UserInvitationPayload] {
        var userInvitations : Buffer.Buffer<Invitation.UserInvitationPayload> = Buffer.Buffer(0);
        
        for ((_, invitation) in invitations.entries()) {
            if (invitation.user_id == user_id) {
                try {
                    let jobResult = await jobActor.getJob(invitation.job_id);
                    
                    switch (jobResult) {
                        case (#ok(job)) {
                            let userInvitation : Invitation.UserInvitationPayload = {
                                job = job;
                                invitedAt = invitation.invitedAt;
                            };
                            userInvitations.add(userInvitation);
                        };
                        case (#err(_)) {
                        };
                    };
                } catch (_) {
                };
            };
        };
        
        return Buffer.toArray(userInvitations);
    };

    let userActor = actor (Global.canister_id.user): actor{
        getUserById : (Text) -> async Result.Result<User.User, Text>;
    };
    
    public func getInvitationByJobId(job_id: Text) : async [Invitation.JobInvitationPayload] {
        var jobInvitations : Buffer.Buffer<Invitation.JobInvitationPayload> = Buffer.Buffer(0);
        
        for ((_, invitation) in invitations.entries()) {
            if (invitation.job_id == job_id) {
                try {
                    let userResult = await userActor.getUserById(invitation.user_id);
                    
                    switch (userResult) {
                        case (#ok(user)) {
                            let invitationPayload : Invitation.JobInvitationPayload = {
                                user = user;
                                isAccepted = invitation.isAccepted;
                            };
                            jobInvitations.add(invitationPayload);
                        };
                        case (#err(_)) {
                        };
                    };
                } catch (_) {
                };
            };
        };
        
        return Buffer.toArray(jobInvitations);
    };

    public func acceptInvitation(user_id: Text, invitation_id: Int) : async Bool {
        switch (invitations.get(invitation_id)) {
            case (null) {
                return false;
            };
            case (?invitation) {
                if (invitation.user_id != user_id) {
                    return false;
                };
                invitations.put(invitation_id, {invitation with isAccepted = true});
                return true;
            };
        };
    };

    public func rejectInvitation(user_id: Text, invitation_id: Int) : async Bool {
        switch (invitations.get(invitation_id)) {
            case (null) {
                return false;
            };
            case (?invitation) {
                if (invitation.user_id != user_id) {
                    return false;
                };
                invitations.delete(invitation_id);
                return true;
            };
        };
    };

    public func getAcceptedJobInvitations(job_id: Text) : async [Invitation.Invitation] {
        let allInvitations = Iter.toArray(invitations.vals());
        let acceptedInvitations = Array.filter(allInvitations, func(invitation : Invitation.Invitation) : Bool {
            return invitation.job_id == job_id and invitation.isAccepted;
        });
        acceptedInvitations;
    };

}