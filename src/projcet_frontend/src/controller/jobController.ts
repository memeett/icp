import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { job } from "../../../declarations/job";
import { Job, CreateJobPayload, UpdateJobPayload, JobCategory } from "../../../declarations/job/job.did";
import { User } from "../interface/User";
import { HttpAgent } from "@dfinity/agent";
import { applier } from "../../../declarations/applier";
import { job_transaction } from "../../../declarations/job_transaction";
import { ApplierPayload } from "../interface/Applier";
import { Wallet } from "lucide-react";



export const createJob = async (jobName:string, jobDescription:string[], jobTags:string[], jobSalary: number, jobSlots: number): Promise<string[]> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {


        if (!jobName.trim()) return ["Failed", "Job name is required"];
        if (jobDescription.length === 0) return ["Failed", "Job description is required"];
        if (jobTags.length === 0) return ["Failed", "At least one job tag is required"];
        if (jobSalary < 1) return ["Failed", "Job salary must be at least 1"];
        if (jobSlots < 1) return ["Failed", "Job slots must be at least 1"];
        
        const userData = localStorage.getItem("current_user");

        const newJobTags: JobCategory[] = [];

        for (const tag of jobTags) {
            let existingCategory = await job.findJobCategoryByName(tag); 

            if (!("ok" in existingCategory)) {
                existingCategory = await job.createJobCategory(tag); 
                
            }

            if ("ok" in existingCategory) {
                newJobTags.push(existingCategory.ok); 
            }
        }

        if(userData){
            const parsedData = JSON.parse(userData);
    
            const payload : CreateJobPayload = {
                jobName,
                jobDescription,
                jobTags: newJobTags, 
                jobSalary,
                jobSlots: BigInt(jobSlots),
                userId: parsedData.ok.id
            };
            
            
            const result = await job.createJob(payload, process.env.CANISTER_ID_JOB_TRANSACTION!, process.env.CANISTER_ID_JOB!);
            if ("ok" in result) {
                return ["Success", "Success post a job"];
            } else {
                return ["Failed","Error creating job"];
            }
        }else{
            return ["Failed", "Before your post a job, login First"];
        }
        } catch (error) {
        return ["Failed", "Failed to create job:"];
    }
};

export const updateJob = async (
    jobId: string,
    jobName: string, 
    jobDescription: string[], 
    jobTags: string[], 
    jobSalary: number, 
    jobSlots: number,
    jobStatus: string
): Promise<string[]> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }

    try {
        // Validation checks
        if (!jobName.trim()) return ["Failed", "Job name is required"];
        if (jobDescription.length === 0) return ["Failed", "Job description is required"];
        if (jobTags.length === 0) return ["Failed", "At least one job tag is required"];
        if (jobSalary < 1) return ["Failed", "Job salary must be at least 1"];
        if (jobSlots < 1) return ["Failed", "Job slots must be at least 1"];
        if (!jobStatus) return ["Failed", "Job status is required"];

        const userData = localStorage.getItem("current_user");

        const newJobTags: JobCategory[] = [];

        // Process job tags
        for (const tag of jobTags) {
            let existingCategory = await job.findJobCategoryByName(tag); 

            if (!("ok" in existingCategory)) {
                existingCategory = await job.createJobCategory(tag); 
            }

            if ("ok" in existingCategory) {
                newJobTags.push(existingCategory.ok); 
            }
        }

        if (userData) {
            const parsedData = JSON.parse(userData);
            
            const payload: UpdateJobPayload = {
                jobName: [jobName],
                jobDescription: [jobDescription],
                jobTags: [newJobTags],
                jobSalary: [jobSalary],
                jobSlots: [BigInt(jobSlots)],
                userId: [parsedData.ok.id]
            };

            
            // Call update job function
            const result = await job.updateJob(jobId, payload,jobStatus);
            
            if ("ok" in result) {
                return ["Success", "Successfully updated the job"];
            } else {
                return ["Failed", "Error updating job"];
            }
        } else {
            return ["Failed", "Please log in before updating a job"];
        }
    } catch (error) {
        return ["Failed", "Failed to update job"];
    }
};

export const viewAllJobs = async (): Promise<Job[] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
  
    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await job.getAllJobs();
        return result;
    } catch (error) {
        return null;
    }
}

export const getJobDetail = async (jobId: string):Promise<Job | null> =>{
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    
    const result = await job.getJob(jobId)
    if("ok" in result){
        return result.ok
    }
    return null
}


export const viewAllJobCategories = async (): Promise<JobCategory[] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await job.getAllJobCategories();
        // console.log("Jobs:", result);
        return result;
    } catch (error) {
        return null;
    }
}

export const getJobById = async (jobId: string): Promise<Job|null> =>{
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try{
        const result = await job.getJob(jobId);
        if ("ok" in result) {
            return result.ok;
        } else {
            return null;
        }
    } catch (error){
        return null;
    }
}


export const getUserJobs = async (userId: string): Promise<Job[] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await job.getUserJob(userId);
        return result;
    } catch (error) {
        return null;
    }
}


export const deleteJob = async (jobId: string): Promise<string[]> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await job.deleteJob(jobId);
        if ("ok" in result) {
            return ["Success", "Success delete job"];
        } else {
            return ["Failed", "Error deleting job"];
        }
    } catch (error) {
        return ["Failed", "Failed to delete job"];
    }
}

export const getJobApplier = async (jobId: string): Promise<ApplierPayload[]> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await applier.getJobApplier(jobId, process.env.CANISTER_ID_USER!);
        if (!result || !("ok" in result)) {
            return [];
        }
        const appliers = result.ok; // This is the array of users from the canister

        const processedUsers = await Promise.all(appliers.map(async (applierData) => {
            let userData = applierData.user;
            let profilePictureBlob: Blob;
            
            if (userData.profilePicture) {
                const uint8Array = new Uint8Array(userData.profilePicture);
                profilePictureBlob = new Blob([uint8Array.buffer], { type: 'image/jpeg' });
            } else {
                profilePictureBlob = new Blob([], { type: 'image/jpeg' });
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
                        id: pref.id.toString()
                    }))
                },
                appliedAt: BigInt(applierData.appliedAt), // Ensure this field is included
            } as ApplierPayload; // Assert that this matches the ApplierPayload type
        }));

        return processedUsers;
    } catch (error) {
        return [];
    }
};

export const getAcceptedFreelancer = async (jobId: string): Promise<User[]> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });


    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await job_transaction.getAcceptedFreelancers(jobId, process.env.CANISTER_ID_USER!)
        if (!result || !("ok" in result)) {
            return [];
        }
        const users = result.ok; 

        const processedUsers = await Promise.all(users.map(async (userData) => {
            let profilePictureBlob: Blob;
            if (userData.profilePicture) {
                // Convert the returned profilePicture (a Uint8Array or number[]) into a Blob.
                const uint8Array = new Uint8Array(userData.profilePicture);
                profilePictureBlob = new Blob([uint8Array.buffer], { type: 'image/jpeg' });
            } else {
                profilePictureBlob = new Blob([], { type: 'image/jpeg' });
            }
            
            return {
                ...userData,
                profilePicture: profilePictureBlob,
                createdAt: BigInt(userData.createdAt),
                updatedAt: BigInt(userData.updatedAt),
                preference: userData.preference.map((pref: JobCategory) => ({
                    ...pref,
                    id: pref.id.toString()
                }))
            };
        }));

        return processedUsers;
    } catch (error) {
        return [];
    }
};

export const startJob = async (
    user_id: string,
    job_id: string,
    amount: number
  ): Promise<{ jobStarted: boolean; message: string }> => {
    try {
      // Authenticate the user
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const agent = new HttpAgent({ identity });
  
      // Fetch the root key for local development
      if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
      }
  
      // Call the startJob method on the job actor
      const result = await job.startJob(
        user_id,
        job_id,
        process.env.CANISTER_ID_JOB!,
        process.env.CANISTER_ID_JOB_TRANSACTION!,
        process.env.CANISTER_ID_USER!
      );
  
      // Check if the result is successful
      if ("ok" in result) {
        // Update the user's wallet balance in local storage
        const userStr = localStorage.getItem("current_user");
        if (userStr) {
          const parsedData = JSON.parse(userStr);
          if (parsedData && typeof parsedData === "object" && "ok" in parsedData) {
            const updatedUser = {
              ...parsedData.ok,
              wallet: parsedData.ok.wallet - amount,
            };
  
            localStorage.setItem(
              "current_user",
              JSON.stringify({ ok: updatedUser })
            );
            return {
              jobStarted: true,
              message: "Job started and wallet updated successfully",
            };
          } else {
            return {
              jobStarted: true,
              message: "Job started but user data in local storage is invalid",
            };
          }
        } else {
          return {
            jobStarted: true,
            message: "Job started but user not found in local storage",
          };
        }
      } else {
        return {
          jobStarted: false,
          message: "Failed to start job: " + JSON.stringify(result.err),
        };
      }
    } catch (error) {
      return {
        jobStarted: false,
        message: "Error: " + String(error),
      };
    }
  };

export const getUserJobByStatusFinished = async (userId: string): Promise<Job[] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await job.getUserJobByStatusFinished(userId);
        return result;
    } catch (error) {
        return null;
    }
}



export const finishJob = async (job_id: string): Promise<{ jobFinished: boolean; message: string }> =>{
    try {
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity });


        if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
        }

        const result =await job.finishJob(job_id, process.env.CANISTER_ID_JOB!, process.env.CANISTER_ID_JOB_TRANSACTION!, process.env.CANISTER_ID_USER!, process.env.CANISTER_ID_RATING!)

        if ("ok" in result) {
            return { jobFinished: true, message: "Job finished successfully." };
        } else {
            return { jobFinished: false, message: result.err || "Failed to finish job." };
        }
    } catch (error) {
        return { jobFinished: false, message: "An error occurred while finishing the job." };
    }
    
}

