import { job } from "../../../declarations/job";
import { Job, CreateJobPayload, UpdateJobPayload } from "../../../declarations/job/job.did";
export const createJob = async (payload: CreateJobPayload): Promise<Job | null> => {
    try {
        const result = await job.createJob(payload);
        if ("ok" in result) {
            console.log("Job created:", result.ok);
            return result.ok;
        } else {
            console.error("Error creating job:", result.err);
            return null;
        }
    } catch (error) {
        console.error("Failed to create job:", error);
        return null;
    }
};

export const updateJob = async (jobId: string, payload: UpdateJobPayload): Promise<Job | null> => {
    try {
        const result = await job.updateJob(jobId, payload);
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
        console.log("Jobs:", result);
        return result;
    } catch (error) {
        console.error("Failed to get all jobs:", error);
        return null;
    }
}