import Rating "./model";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Text "mo:base/Text";
import List "mo:base/List";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import User "../User/model";
import Job "../Job/model";

actor RatingModel{
    private stable var nextId : Nat = 0;

    private stable var ratingsEntries : [(Text, Rating.Rating)] = [];

    private var ratings = HashMap.fromIter<Text, Rating.Rating>(
        ratingsEntries.vals(),
        0,
        Text.equal,
        Text.hash,
    );

    // Save state before upgrade
    system func preupgrade() {
        ratingsEntries := Iter.toArray(ratings.entries());
    };

    // Restore state after upgrade
    system func postupgrade() {
        ratings := HashMap.fromIter<Text, Rating.Rating>(
            ratingsEntries.vals(),
            0,
            Text.equal,
            Text.hash,
        );
        ratingsEntries := [];
    };

     public func createRating(job_id : Text, user_ids : List.List<Text>) : async Result.Result<Text, Text> {
        // Check if the job_id is valid (non-empty)
        if (Text.size(job_id) == 0) {
            return #err("Job ID cannot be empty");
        };

        // Check if the user_ids list is empty
        if (List.size(user_ids) == 0) {
            return #err("User IDs list cannot be empty");
        };

        // Iterate over the list of user IDs and create a rating for each user
        List.iterate<Text>(
            user_ids,
            func(user_id : Text) {
                let ratingId = Int.toText(nextId);

                let newRating : Rating.Rating = {
                    id = nextId+1;          // Assign the next unique ID
                    job_id = job_id;      // Job ID for the rating
                    user_id = user_id;    // User ID for the rating
                    rating = 0;           // Default rating value
                    isEdit = false;       // Default edit status
                };

                // Add the new rating to the HashMap
                ratings.put(ratingId, newRating);
                nextId += 1;
            }
        );

        // Return success message
        #ok("Ratings created successfully");
    };

    public func getRatingByJobId(job_id : Text, user_id: Text, user_canister: Text, job_canister: Text) : async Result.Result<[Rating.JobRatingPayload], Text> {
        // Step 1: Validate job_id
        if (Text.size(job_id) == 0) {
            return #err("Job ID cannot be empty");
        };

        // Step 2: Initialize the Job actor
        let jobActor = actor(job_canister) : actor {
            getJob: (jobId : Text) -> async Result.Result<Job.Job, Text>;
        };

        // Step 3: Fetch the job details
        let jobResult = await jobActor.getJob(job_id);
        switch (jobResult) {
            case (#ok(job)) {
                // Step 4: Check if the user_id in the job matches the user_id parameter
                if (job.userId != user_id) {
                    return #err("Unauthorized: User ID does not match the job owner");
                };

                // Step 5: Initialize the User actor
                let userActor = actor(user_canister) : actor {
                    getUserById : (userId : Text) -> async Result.Result<User.User, Text>;
                };

                // Step 6: Filter ratings by job_id
                let filteredRatings = Iter.toArray(
                    Iter.filter<Rating.Rating>(
                        ratings.vals(),
                        func(rating : Rating.Rating) : Bool {
                            rating.job_id == job_id
                        }
                    )
                );

                // Step 7: Enrich ratings with user data
                var enrichedRatings : [Rating.JobRatingPayload] = [];
                for (rating in filteredRatings.vals()) {
                    let userResult = await userActor.getUserById(rating.user_id);
                    switch (userResult) {
                        case (#ok(user)) {
                            let enrichedRating : Rating.JobRatingPayload = {
                                rating_id = rating.id;
                                user = user;
                                rating = rating.rating;
                                isEdit = rating.isEdit;
                            };
                            enrichedRatings := Array.append(enrichedRatings, [enrichedRating]);
                        };
                        case (#err(errMsg)) {
                            return #err("Failed to fetch user data for user " # rating.user_id # ": " # errMsg);
                        };
                    };
                };

                // Step 8: Return the enriched ratings
                #ok(enrichedRatings);
            };
            case (#err(errMsg)) {
                return #err("Failed to fetch job details: " # errMsg);
            };
        };
    };

    public func ratingUser(payloads : [Rating.RequestRatingPayload]) : async Result.Result<Text, Text> {
        // Step 1: Convert HashMap values to an array
        let ratingsArray = Iter.toArray(ratings.vals());

        // Step 2: Iterate over the payloads
        for (payload in payloads.vals()) {
            // Step 3: Find the rating with the matching ID
            let foundRating = Array.find<Rating.Rating>(
                ratingsArray,
                func(rating : Rating.Rating) : Bool {
                    switch (Nat.fromText(payload.rating_id)) {
                        case (?natId) rating.id == natId;
                        case null false;
                    }
                }
            );

            // Step 4: Check if the rating was found
            switch (foundRating) {
                case (?rating) {
                    // Step 5: Check if the rating is editable
                    if (rating.isEdit) {
                        return #err("Rating with ID " # payload.rating_id # " is not editable");
                    };

                    // Step 6: Update the rating
                    let updatedRating : Rating.Rating = {
                        id = rating.id;
                        job_id = rating.job_id;
                        user_id = rating.user_id;
                        rating = payload.rating; // Update the rating value
                        isEdit = true; // Mark the rating as edited
                    };

                    // Step 7: Save the updated rating back to the HashMap
                    ratings.put(payload.rating_id, updatedRating);
                };
                case null {
                    return #err("Rating with ID " # payload.rating_id # " not found");
                };
            };
        };

        // Step 8: Return success message
        #ok("Ratings updated successfully");
    };

    public func getAllRating(): async [Rating.Rating] {
        Iter.toArray(ratings.vals());
    };


}