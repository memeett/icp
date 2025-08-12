import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
class AgentService {
    authClientInstance = null;
    agentInstance = null;
    async getAuthClient() {
        if (!this.authClientInstance) {
            this.authClientInstance = await AuthClient.create({
                idleOptions: {
                    idleTimeout: 1000 * 60 * 30,
                    disableDefaultIdleCallback: true,
                },
            });
        }
        return this.authClientInstance;
    }
    async getAgent() {
        if (!this.agentInstance) {
            const client = await this.getAuthClient();
            this.agentInstance = new HttpAgent({
                identity: client.getIdentity(),
            });
            if (process.env.DFX_NETWORK === "local") {
                await this.agentInstance.fetchRootKey();
            }
            //   console.log("Agent created");
        }
        else {
            //   console.log("Agent reused");
        }
        return this.agentInstance;
    }
}
// Singleton instance
const globalForAgent = globalThis;
export const agentService = globalForAgent.agentService ?? new AgentService();
if (!globalForAgent.agentService)
    globalForAgent.agentService = agentService;
