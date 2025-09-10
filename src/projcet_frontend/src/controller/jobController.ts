<<<<<<< HEAD
import { AuthClient } from "@dfinity/auth-client";
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
=======
import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { job } from "../../../declarations/job";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import {
  Job,
  CreateJobPayload,
  UpdateJobPayload,
  JobCategory,
<<<<<<< HEAD
  User as BackendUser,
} from "../../../declarations/projcet_backend_single/projcet_backend_single.did";
import { User } from "../shared/types/User";
import { ApplierPayload } from "../shared/types/Applier";
=======
} from "../../../declarations/job/job.did";
import { User } from "../shared/types/User";
import { HttpAgent } from "@dfinity/agent";
import { applier } from "../../../declarations/applier";
import { job_transaction } from "../../../declarations/job_transaction";
import { ApplierPayload } from "../shared/types/Applier";
import { Wallet } from "lucide-react";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import { agentService } from "../singleton/agentService";
import { storage } from "../utils/storage";
import { ensureUserData } from "../utils/sessionUtils";
import { debugUserData } from "../utils/debugUtils";
import { fixUserData } from "../utils/userDataFixer";
import { Job as JobShared, JobPayload } from "../shared/types/Job";
<<<<<<< HEAD
import { getBalanceController, transferToJobController, transfertoWorkerController } from "./tokenController";
import { HttpAgent } from "@dfinity/agent";
=======
import { user } from "../../../declarations/user";
import { getBalanceController, transferToJobController, transfertoWorkerController } from "./tokenController";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

export const createJob = async (payload: JobPayload): Promise<string[]> => {
  const agent = await agentService.getAgent();
  try {
    if (!payload.jobName.trim()) return ["Failed", "Job name is required"];
    if (payload.jobDescription.length === 0)
      return ["Failed", "Job description is required"];
    if (payload.jobTags.length === 0)
      return ["Failed", "At least one job tag is required"];
    if (payload.jobSalary < 1)
      return ["Failed", "Job salary must be at least 1"];
    if (payload.jobSlots < 1) return ["Failed", "Job slots must be at least 1"];

    // First, ensure we have user data if there's a session
    const hasUserData = await ensureUserData();
    if (!hasUserData) {
      return [
        "Failed",
        "Authentication required. Please login before posting a job.",
      ];
    }

    // Run debug utility to help troubleshoot
    debugUserData();

    // Get user data from storage utility
    let currentUser = storage.getUser();
    console.log("Current user from storage for job creation:", currentUser);

    // If user data has issues, try to fix it
    if (!currentUser || !currentUser.id) {
      console.log("User data has issues, attempting to fix...");
      currentUser = fixUserData();
    }
    if (currentUser) {
      console.log("User ID:", currentUser.id);
      console.log("User structure type:", typeof currentUser);
      console.log("User keys:", Object.keys(currentUser));
    } else {
      console.log("No user data available");
    }


<<<<<<< HEAD
    const newJobTags: JobCategory[] = [];

    for (const tag of payload.jobTags) {
      let existingCategory = await projcet_backend_single.findJobCategoryByName(tag);

      if (!("ok" in existingCategory)) {
        existingCategory = await projcet_backend_single.createJobCategory(tag);
=======
    


    const newJobTags: JobCategory[] = [];

    for (const tag of payload.jobTags) {
      let existingCategory = await job.findJobCategoryByName(tag);

      if (!("ok" in existingCategory)) {
        existingCategory = await job.createJobCategory(tag);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      }

      if ("ok" in existingCategory) {
        newJobTags.push(existingCategory.ok);
      }
    }

    if (currentUser) {

<<<<<<< HEAD
=======
      const new_curr_user = currentUser as User;
      const obj = currentUser.subAccount[0]!;

      const uint8 = new Uint8Array(Object.values(obj));
      const converted_user: User = {
        ...new_curr_user,
        subAccount: [uint8], // Convert subAccount to Uint8Array
      }
      console.log("lanjutt euy")
      // Debug the user data structure
      console.log("User ID:", currentUser.id);
      console.log("User structure type:", typeof currentUser);
      console.log("User keys:", Object.keys(currentUser));
      console.log("User data:", currentUser);

>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      // Make sure the ID is a string
      const userId = String(currentUser.id);
      console.log("User ID as string:", userId);

      // Safely create the payload
      const createJobPayload: CreateJobPayload = {
        jobProjectType: payload.jobProjectType,
        jobRequirementSkills: payload.jobSkills,
        jobName: payload.jobName,
        jobTags: newJobTags,
        userId: userId,
        jobDescription: payload.jobDescription,
        jobStartDate: payload.jobStartDate,
        jobSalary: payload.jobSalary,
        jobExperimentLevel: payload.jobExprienceLevel,
        jobDeadline: payload.jobDeadline,
        jobSlots: BigInt(payload.jobSlots),
        jobStatus: "Open",
      };

      console.log("Job payload being sent:", {
        ...createJobPayload,
        jobSlots: createJobPayload.jobSlots.toString(),
        userId: createJobPayload.userId,
      });

<<<<<<< HEAD
      const result = await projcet_backend_single.createJob(createJobPayload);
=======
      const result = await job.createJob(
        createJobPayload,
        process.env.CANISTER_ID_JOB_TRANSACTION!,
        process.env.CANISTER_ID_JOB!
      );
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      if ("ok" in result) {
   

        return ["Success", "Successfully created job"]

      } else {
        return ["Failed", "Error creating job"];
      }
    } else {
      return [
        "Failed",
        "Authentication required. Please login before posting a job.",
      ];
    }
  } catch (error) {
    return ["Failed", `Failed to create job: ${error}`];
  }
};

export const updateJob = async (
  jobId: string,
  jobName: string,
  jobDescription: string,
  jobStartDate: bigint,
  jobDeadline: bigint
): Promise<string[]> => {
  const agent = await agentService.getAgent();

      const payload: UpdateJobPayload = {
        jobName: jobName,
        jobDescription: [jobDescription],
        jobStartDate: jobStartDate,
        jobDeadline: jobDeadline,
      };

<<<<<<< HEAD
      const result = await projcet_backend_single.updateJob(jobId, payload);
=======
      const result = await job.updateJob(jobId, payload);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

      if ("ok" in result) {
        return ["Success", "Successfully updated the job"];
      } else {
        return ["Failed", "Error updating job"];
      }
};

export const viewAllJobs = async (): Promise<Job[] | null> => {
  const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getAllJobs();
=======
    const result = await job.getAllJobs();
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    return result;
  } catch (error) {
    return null;
  }
};

export const getJobDetail = async (jobId: string): Promise<Job | null> => {
  const agent = await agentService.getAgent();

<<<<<<< HEAD
  const result = await projcet_backend_single.getJob(jobId);
=======
  const result = await job.getJob(jobId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
  if ("ok" in result) {
    return result.ok;
  }
  return null;
};

export const viewAllJobCategories = async (): Promise<JobCategory[] | null> => {
  const agent = await agentService.getAgent();

  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getAllJobCategories();
=======
    const result = await job.getAllJobCategories();
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    // console.log("Jobs:", result);
    return result;
  } catch (error) {
    return null;
  }
};

export const getJobById = async (jobId: string): Promise<Job | null> => {
  const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getJob(jobId);
=======
    const result = await job.getJob(jobId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    if ("ok" in result) {
      return result.ok;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getUserJobs = async (userId: string): Promise<Job[] | null> => {
  const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getUserJob(userId);
=======
    const result = await job.getUserJob(userId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    return result;
  } catch (error) {
    return null;
  }
};

export const deleteJob = async (jobId: string): Promise<string[]> => {
  const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.deleteJob(jobId);
=======
    const result = await job.deleteJob(jobId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    if ("ok" in result) {
      return ["Success", "Success delete job"];
    } else {
      return ["Failed", "Error deleting job"];
    }
  } catch (error) {
    return ["Failed", "Failed to delete job"];
  }
};

export const getJobApplier = async (
  jobId: string
): Promise<ApplierPayload[]> => {
  const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getJobAppliers(jobId);
    if ("ok" in result) {
        const appliers = result.ok;
        const processedUsers: ApplierPayload[] = appliers.map((applierData: { user: BackendUser; appliedAt: bigint; }) => {
            const userData = applierData.user;
            const profilePictureBlob = userData.profilePicture && userData.profilePicture.length > 0
                ? new Blob([new Uint8Array(userData.profilePicture)], { type: 'image/jpeg' })
                : null;
            
            return {
                user: {
                    ...userData,
                    profilePicture: profilePictureBlob,
                    createdAt: BigInt(userData.createdAt),
                    updatedAt: BigInt(userData.updatedAt),
                    preference: userData.preference.map((pref: any) => ({
                      ...pref,
                      id: pref.id.toString(),
                    })),
                    subAccount: userData.subAccount[0] ? [new Uint8Array(userData.subAccount[0])] : [],
                },
                appliedAt: BigInt(applierData.appliedAt),
            };
        });
        return processedUsers;
    }
    return [];
=======
    const result = await applier.getJobApplier(
      jobId,
      process.env.CANISTER_ID_USER!
    );
    if (!result || !("ok" in result)) {
      return [];
    }
    const appliers = result.ok; // This is the array of users from the canister

    const processedUsers = await Promise.all(
      appliers.map(async (applierData) => {
        let userData = applierData.user;
        let profilePictureBlob: Blob;

        if (userData.profilePicture) {
          const uint8Array = new Uint8Array(userData.profilePicture);
          profilePictureBlob = new Blob([uint8Array.buffer], {
            type: "image/jpeg",
          });
        } else {
          profilePictureBlob = new Blob([], { type: "image/jpeg" });
        }

        // Make sure to return an object that matches the `ApplierPayload` structure
        return {
          user: {
            ...userData,
            profilePicture: profilePictureBlob,
            createdAt: BigInt(userData.createdAt),
            updatedAt: BigInt(userData.updatedAt),
            preference: userData.preference.map((pref: JobCategory) => ({
              ...pref,
              id: pref.id.toString(),
            })),
          },
          appliedAt: BigInt(applierData.appliedAt), // Ensure this field is included
        } as ApplierPayload; // Assert that this matches the ApplierPayload type
      })
    );

    return processedUsers;
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
  } catch (error) {
    return [];
  }
};

export const getAcceptedFreelancer = async (jobId: string): Promise<User[]> => {
  const agent = await agentService.getAgent();

  console.log("Getting accepted freelancers for job:", jobId);
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getAcceptedFreelancer(jobId);
    if (result) {
        return result.map((backendUser: BackendUser) => {
            const profilePictureBlob = backendUser.profilePicture && backendUser.profilePicture.length > 0
                ? new Blob([new Uint8Array(backendUser.profilePicture[0])], { type: 'image/jpeg' })
                : null;

            return {
                ...backendUser,
                id: backendUser.id.toString(),
                profilePicture: profilePictureBlob,
                createdAt: BigInt(backendUser.createdAt),
                updatedAt: BigInt(backendUser.updatedAt),
                preference: backendUser.preference.map((pref: any) => ({
                  ...pref,
                  id: pref.id.toString(),
                })),
                subAccount: backendUser.subAccount[0] ? [new Uint8Array(backendUser.subAccount[0])] : [],
            };
        });
    }
    return [];
=======
    const result = await job_transaction.getAcceptedFreelancers(
      jobId,
      process.env.CANISTER_ID_USER!
    );
    if (!result || !("ok" in result)) {
      return [];
    }
    const users = result.ok;

    const processedUsers = await Promise.all(
      users.map(async (userData) => {
        let profilePictureBlob: Blob;
        if (userData.profilePicture) {
          // Convert the returned profilePicture (a Uint8Array or number[]) into a Blob.
          const uint8Array = new Uint8Array(userData.profilePicture);
          profilePictureBlob = new Blob([uint8Array.buffer], {
            type: "image/jpeg",
          });
        } else {
          profilePictureBlob = new Blob([], { type: "image/jpeg" });
        }

        const userSubaccount: [] | [Uint8Array] =
                    userData.subAccount && userData.subAccount[0]
                        ? [new Uint8Array(userData.subAccount[0])]
                        : [];
        return {
          ...userData,
          profilePicture: profilePictureBlob,
          createdAt: BigInt(userData.createdAt),
          updatedAt: BigInt(userData.updatedAt),
          preference: userData.preference.map((pref: JobCategory) => ({
            ...pref,
            id: pref.id.toString(),
          })),
          subAccount:  userSubaccount, // Ensure subAccount is included
        };
      })
    );

    return processedUsers;
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
  } catch (error) {
    return [];
  }
};

export const startJob = async (
  job_id: string,
  curr_user: User,
): Promise<{ jobStarted: boolean; message: string }> => {
  try {
    // Authenticate the user
    const agent = await agentService.getAgent();
    const curr_job = await getJobById(job_id);

<<<<<<< HEAD
    if(curr_job){
      const result = await projcet_backend_single.startJob(job_id);
      if ("ok" in result) {
          const creator_token = await getBalanceController(curr_user);
=======
    

    if(curr_job){
      const result = await job.startJob(job_id);
      if (result) {

          const creator_token = await getBalanceController(curr_user);
          console.log("Creator token balance:", creator_token.token_value);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
          if(creator_token.token_value < curr_job.jobSalary) {
            return {
                jobStarted: false,
                message: "Insufficient Balance.",
              };
          }
<<<<<<< HEAD
          
          const transferResult = await transferToJobController(
            curr_user,
            curr_job as unknown as JobShared,
=======
          const obj = curr_job.subAccount[0]!;
          const uint8 = new Uint8Array(Object.values(obj));

          
          const transferResult = await transferToJobController(
            curr_user,
            {
              ...curr_job,
              jobStatus: curr_job.jobStatus as "Open" | "Ongoing" | "Finished" | "Cancelled",
              subAccount: [uint8],
            },
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
            curr_job.jobSalary
          );
          console.log("Transfer result:", transferResult);
          if ("ok" in transferResult) {
            return {
                jobStarted: true,
                message: "Job started successfully.",
              };
          } else {
            return {
              jobStarted: false,
              message: "Job started unsuccessfully.",
            };
          }
      
      }else{
        return {
          jobStarted: false,
          message: "Failed to start job: " + JSON.stringify(result),
        };
      }
    } else {
      return {
        jobStarted: false,
        message: "Job not found.",
      };
    }
   } catch (error) {
     return {
      jobStarted: false,
      message: "Error: " + String(error),
    };
  }
};

export const getUserJobByStatusFinished = async (
  userId: string
): Promise<Job[] | null> => {
  const agent = await agentService.getAgent();
  try {
<<<<<<< HEAD
    const result = await projcet_backend_single.getUserJobByStatusFinished(userId);
=======
    const result = await job.getUserJobByStatusFinished(userId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    return result;
  } catch (error) {
    return null;
  }
};

export const finishJob = async (
  job_id: string
): Promise<{ jobFinished: boolean; message: string }> => {
  try {
<<<<<<< HEAD
    const agent = await agentService.getAgent();
    const result = await projcet_backend_single.finishJob(
=======
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
      await agent.fetchRootKey();
    }

    const result = await job.finishJob(
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      job_id
    );

    if ("ok" in result) {
      const next_result = await transfertoWorkerController(job_id)
        if ("ok" in next_result) {
          return {jobFinished: true, message: "Job posted and transfer completed"};
        } else {
          return {jobFinished: false, message: `Job created but transfer failed: ${next_result.err}`};
        }

    } else {
      return {
        jobFinished: false,
<<<<<<< HEAD
        message: result.err?.toString() || "Failed to finish job.",
=======
        message: result.err || "Failed to finish job.",
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
      };
    }
  } catch (error) {
    return {
      jobFinished: false,
      message: "An error occurred while finishing the job.",
    };
  }
};
