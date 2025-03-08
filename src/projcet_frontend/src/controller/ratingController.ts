import { User } from "../interface/User";
import { rating } from "../../../declarations/rating";

export interface JobRatingPayload {
    rating_id: bigint;
    user : User;
    rating: number;
    isEdit: boolean;
};

export const getFreelancerForRating = async (job_id: string): Promise<JobRatingPayload[]> => {
    // Step 1: Retrieve the current user's ID from local storage
    const userData = localStorage.getItem("current_user");
    const parsedData = userData ? JSON.parse(userData) : null;

    // Step 2: Check if the user data is valid
    if (!parsedData || !parsedData.ok) {
        console.error("User data is invalid or not found in local storage");
        return []; // Return an empty array if user data is invalid
    }

    const userId = parsedData.ok.id;

    try {
        // Step 3: Call the `getRatingByJobId` method on the rating actor
        const result = await rating.getRatingByJobId(
            job_id,
            userId,
            process.env.CANISTER_ID_USER!, // Ensure this environment variable is set
            process.env.CANISTER_ID_JOB! // Ensure this environment variable is set
        );

        // Step 4: Handle the result
        if ("ok" in result) {
            // Step 5: Transform the profilePicture field to Blob
            const transformedRatings = result.ok.map((rating) => {
                let profilePictureBlob: Blob;
                if (rating.user.profilePicture) {
                    const uint8Array = new Uint8Array(rating.user.profilePicture);
                    profilePictureBlob = new Blob([uint8Array.buffer], {
                        type: 'image/jpeg', // Adjust the MIME type if needed
                    });
                } else {
                    profilePictureBlob = new Blob([], { type: 'image/jpeg' }); // Default empty Blob
                }

                return {
                    ...rating,
                    user: {
                        ...rating.user,
                        profilePicture: profilePictureBlob,
                    },
                };
            });

            // Step 6: Return the transformed ratings
            return transformedRatings;
        } else {
            // Error case: Log the error and return an empty array
            console.error("Failed to fetch freelancer ratings:", result.err);
            return [];
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error fetching freelancer ratings:", error);
        return [];
    }
};

