import { job_transaction } from "../../../declarations/job_transaction";

export const appendFreelancers = async (jobId: string, newFreelancerId: string): Promise<string[]> => {
    try {
        const result = await job_transaction.appendFreelancers(jobId, newFreelancerId);

        if ("ok" in result) {
            return ["ok", "Success"]; 
        } else {
            return ["err", result.err];
        }
    } catch (error) {
        console.error("Error appending freelancer:", error);
        return ["err", "An unexpected error occurred"];
    }
};