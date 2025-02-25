import Text "mo:base/Text";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Random "mo:base/Random";
import Nat8 "mo:base/Nat8";
import Iter "mo:base/Iter";
import Result "mo:base/Result";

actor Authentication{
    public type SessionData = {
        userId: Text;
        createdAt: Time.Time;
        expiresAt: Time.Time;
    };

    private stable var sessionsEntries : [(Text, SessionData)] = [];
    private var sessions = HashMap.fromIter<Text, SessionData>(
        sessionsEntries.vals(), 
        0, 
        Text.equal, 
        Text.hash
    );

    system func preupgrade() {
        sessionsEntries := Iter.toArray(sessions.entries());
    };

    system func postupgrade() {
        sessions := HashMap.fromIter<Text, SessionData>(
            sessionsEntries.vals(),
            0,
            Text.equal,
            Text.hash
        );
        sessionsEntries := [];
    };
    
    private let SESSION_DURATION : Int = 24 * 60 * 60 * 1_000_000_000;

    private func generateSessionId() : async Text {
        let now = Int.toText(Time.now());
        let randomBlob = await Random.blob();
        let randomByte = Random.byteFrom(randomBlob);
        let random = Int.toText(Nat8.toNat(randomByte));
        Text.concat(now, random)
    };


    public shared func createSession(userId: Text) : async Text {
        let sessionId = await generateSessionId(); 
        let now = Time.now();
        
        let sessionData : SessionData = {
            userId = userId;
            createdAt = now;
            expiresAt = now + SESSION_DURATION;
        };

        sessions.put(sessionId, sessionData);
        sessionId
    };

    public shared query func getUserIdBySession(sessionId: Text) : async Result.Result<Text, Text>{
        switch(sessions.get(sessionId)){
            case(?session){
                #ok(session.userId);
            };
            case null {
                #err("Session Could not be found")
            }
        }
        
    };

    public query func validateSession(sessionId: Text) : async Bool {
        switch(sessions.get(sessionId)) {
            case (?session) {
                if (Time.now() > session.expiresAt) {
                    sessions.delete(sessionId);
                    false
                } else {
                    true
                };
            };
            case null false;
        };
    };

    public shared func logout(sessionId: Text) : async () {
        sessions.delete(sessionId);
    };

    public func getAllSessions(): async [SessionData]{
        Iter.toArray(sessions.vals());
    };
}