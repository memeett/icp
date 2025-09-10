import { User } from "../shared/types/User";
<<<<<<< HEAD
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
import {
  RequestRatingPayload,
  Rating as HistoryRatingPayload,
} from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
=======
import { rating } from "../../../declarations/rating";
import {
  HistoryRatingPayload,
  RequestRatingPayload,
  List,
} from "../../../declarations/rating/rating.did";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import { agentService } from "../singleton/agentService";

export interface JobRatingPayload {
  rating_id: number;
  user: User;
  rating: number;
  isEdit: boolean;
}

export const getFreelancerForRating = async (
<<<<<<< HEAD
  job_id: string,
  userId: string
): Promise<JobRatingPayload[]> => {
  const agent = await agentService.getAgent();

  try {
    const result = await projcet_backend_single.getRatingByJobId(
      job_id,
      userId,
    );
    if ("ok" in result) {
      const transformedRatings = result.ok.map((rating) => {
        let profilePictureBlob: Blob | null;
        if (rating.user.profilePicture && rating.user.profilePicture.length > 0) {
          const uint8Array = new Uint8Array(rating.user.profilePicture);
          profilePictureBlob = new Blob([uint8Array.buffer], {
            type: "image/jpeg", 
          });
        } else {
          profilePictureBlob = null;
=======
  job_id: string
): Promise<JobRatingPayload[]> => {
  // Step 1: Retrieve the current user's ID from local storage

  const agent = await agentService.getAgent();

  const userData = localStorage.getItem("current_user");
  const parsedData = userData ? JSON.parse(userData) : null;

  // Step 2: Check if the user data is valid
  if (!parsedData || !parsedData.ok) {
    console.error("User data is invalid or not found in local storage");
    return []; // Return an empty array if user data is invalid
  }

  const userId = parsedData.ok.id;
  const subAccount = parsedData.ok.subAccount;

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
            type: "image/jpeg", // Adjust the MIME type if needed
          });
        } else {
          profilePictureBlob = new Blob([], { type: "image/jpeg" }); // Default empty Blob
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        }

        return {
          ...rating,
          rating_id: Number(rating.rating_id),
<<<<<<< HEAD
          rating: Number(rating.rating),
          user: {
            ...rating.user,
            profilePicture: profilePictureBlob,
            subAccount: rating.user.subAccount[0] ? [new Uint8Array(rating.user.subAccount[0])] : [],
=======
          user: {
            ...rating.user,
            profilePicture: profilePictureBlob,
            subAccount:
              parsedData.ok.subAccount && parsedData.ok.subAccount.length > 0
                ? [new Uint8Array(parsedData.ok.subAccount[0])] as [Uint8Array]
                : [] as []
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
          },
        };
      });

<<<<<<< HEAD
      return transformedRatings as unknown as JobRatingPayload[];
    } else {
=======
      // Step 6: Return the transformed ratings
      return transformedRatings;
    } else {
      // Error case: Log the error and return an empty array
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      console.error("Failed to fetch freelancer ratings:", result.err);
      return [];
    }
  } catch (error) {
<<<<<<< HEAD
=======
    // Handle any unexpected errors
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    console.error("Error fetching freelancer ratings:", error);
    return [];
  }
};
export const ratingUser = async (
  payloads: RequestRatingPayload[]
): Promise<string> => {
  try {
    await agentService.getAgent();

<<<<<<< HEAD
    const result = await projcet_backend_single.ratingUser(payloads);
=======
    // Pastikan user canister id tersedia
    const userCanisterId = process.env.CANISTER_ID_USER;
    if (!userCanisterId) {
      throw new Error("User canister ID is not configured.");
    }

    const result = await rating.ratingUser(payloads, userCanisterId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

    if ("ok" in result) {
      return result.ok;
    } else {
      console.error("Failed to rate users:", result.err);
      return result.err;
    }
  } catch (error) {
    console.error("Error rating users:", error);
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred while rating users.";
  }
};

export const getRatingByUserIdJobId = async (
  jobId: string,
  userId: string
): Promise<HistoryRatingPayload | string> => {
  const agent = await agentService.getAgent();
  console.log("Fetching rating for jobId:", jobId, "and userId:", userId);
<<<<<<< HEAD
  const result = await projcet_backend_single.getRatingByUserIdJobId(
    jobId,
    userId,
  );
  if ("ok" in result) {
    return result.ok;
  } else {
=======
  const result = await rating.getRatingByUserIdJobId(
    jobId,
    userId,
    process.env.CANISTER_ID_USER!,
    process.env.CANISTER_ID_JOB!
  );
  if ("ok" in result) {
    // Success case: Return the success message
    return result.ok;
  } else {
    // Error case: Log the error and return the error message
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    console.error("Failed to rate user:", result.err);
    return result.err;
  }
};

export const createRating = async (
  jobId: string,
  userIds: string[]
): Promise<string> => {
  try {
    await agentService.getAgent();

    if (!jobId || jobId.trim().length === 0) {
      return "Job ID cannot be empty";
    }
    if (!userIds || userIds.length === 0) {
      return "User IDs list cannot be empty";
    }

<<<<<<< HEAD
    const result = await projcet_backend_single.createRating(jobId, userIds);
=======
    const arrayToList = (arr: string[]): List => {
      let list: List = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        list = [[arr[i], list]];
      }
      return list;
    };

    const userIdsList: List = arrayToList(userIds);

    const result = await rating.createRating(jobId, userIdsList);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

    if ("ok" in result) {
      return result.ok;
    } else {
      console.error("Failed to create ratings:", result.err);
      return result.err;
    }
  } catch (error) {
    console.error("Error creating ratings:", error);
    return "Error creating ratings. Please try again later.";
  }
};
