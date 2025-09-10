<<<<<<< HEAD
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
=======
import { AuthClient } from "@dfinity/auth-client";
import { job_transaction } from "../../../declarations/job_transaction";
import { HttpAgent } from "@dfinity/agent";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import { agentService } from "../singleton/agentService";

export const appendFreelancers = async (jobId: string, newFreelancerId: string): Promise<string[]> => {
    const agent = await agentService.getAgent();
    try {
<<<<<<< HEAD
        const result = await projcet_backend_single.appendFreelancers(jobId, newFreelancerId);
=======
        const result = await job_transaction.appendFreelancers(jobId, newFreelancerId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

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
<<<<<<< HEAD
        const result = await projcet_backend_single.isFreelancerRegistered(jobId, freelancerId);
=======
        const result = await job_transaction.isFreelancerRegistered(jobId, freelancerId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
        return ["succ", String(result)]
    } catch (error) {
        return ["err", "error"]
    }

}
