import { AuthClient } from "@dfinity/auth-client";
import { job_transaction } from "../../../declarations/job_transaction";
import { HttpAgent } from "@dfinity/agent";

export const appendFreelancers = async (jobId: string, newFreelancerId: string): Promise<string[]> => {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK === "local") {
        await agent.fetchRootKey();
    }
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

