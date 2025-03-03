import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { job } from "../../../declarations/job";
import { Job, CreateJobPayload, UpdateJobPayload, JobCategory } from "../../../declarations/job/job.did";
import { User } from "../interface/User";
import { HttpAgent } from "@dfinity/agent";



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

        console.log(job.getAllJobCategories())

        if(userData){
            const parsedData = JSON.parse(userData);
            console.log("User ID:", parsedData.ok.id);
    
            const payload : CreateJobPayload = {
                jobName,
                jobDescription,
                jobTags: newJobTags, 
                jobSalary,
                jobSlots: BigInt(jobSlots),
                userId: parsedData.ok.id
            };
            
            
            const result = await job.createJob(payload);
            if ("ok" in result) {
                console.log("Job created:", result.ok);
                return ["Success", "Success post a job"];
            } else {
                console.error("Error creating job:", result.err);
                return ["Failed","Error creating job"];
            }
        }else{
            return ["Failed", "Before your post a job, login First"];
        }
        } catch (error) {
        console.error("Failed to create job:", error);
        return ["Failed", "Failed to create job:"];
    }
};

export const updateJob = async (jobId: string, payload: UpdateJobPayload, jobStatus: string): Promise<Job | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await job.updateJob(jobId, payload, jobStatus);
        if ("ok" in result) {
            console.log("Job updated:", result.ok);
            return result.ok;
        } else {
            console.error("Error updating job:", result.err);
            return null;
        }
    } catch (error) {
        console.error("Failed to update job:", error);
        return null;
    }
};

export const viewAllJobs = async (): Promise<Job[] | null> => {
    try {
        const result = await job.getAllJobs();
        // console.log("Jobs:", result);
        return result;
    } catch (error) {
        console.error("Failed to get all jobs:", error);
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
    try {
        const result = await job.getAllJobCategories();
        // console.log("Jobs:", result);
        return result;
    } catch (error) {
        console.error("Failed to get all jobs:", error);
        return null;
    }
}

export const getJobById = async (jobId: string): Promise<Job|null> =>{
    try{
        const result = await job.getJob(jobId);
        if ("ok" in result) {
            console.log("Job updated:", result.ok);
            return result.ok;
        } else {
            console.error("Error updating job:", result.err);
            return null;
        }
    } catch (error){
        console.error("Failed to get all jobs:", error);
        return null;
    }
}

// cek job punya owner
export const getUserJobs = async (userId: string): Promise<Job[] | null> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
    try {
        const result = await job.getUserJob(userId);
        console.log("Jobs:", result);
        return result;
    } catch (error) {
        console.error("Failed to get all jobs:", error);
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
            console.log("Job deleted:", result.ok);
            return ["Success", "Success delete job"];
        } else {
            console.error("Error deleting job:", result.err);
            return ["Failed", "Error deleting job"];
        }
    } catch (error) {
        console.error("Failed to delete job:", error);
        return ["Failed", "Failed to delete job"];
    }
}