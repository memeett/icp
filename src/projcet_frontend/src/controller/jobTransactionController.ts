import { AuthClient } from "@dfinity/auth-client";
import { job_transaction } from "../../../declarations/job_transaction";
import { HttpAgent } from "@dfinity/agent";
import { agentService } from "../singleton/agentService";

export const appendFreelancers = async (jobId: string, newFreelancerId: string): Promise<string[]> => {
    const agent = await agentService.getAgent();
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

export const isFreelancerRegistered = async (jobId: string, freelancerId: string): Promise<string[]> => {
    const agent = await agentService.getAgent();

    try {
        const result = await job_transaction.isFreelancerRegistered(jobId, freelancerId);
        return ["succ", String(result)]
    } catch (error) {
        return ["err", "error"]
    }

}
