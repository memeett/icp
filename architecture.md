# AI Agent System Architecture

This diagram illustrates the architecture of the AI agent system, showing the relationships between the Python-based agents, the central `AiAgent` canister, and the other backend canisters.

```mermaid
graph TD
    subgraph "User Interface"
        UI_Freelancer["Freelancer UI"]
        UI_Client["Client UI"]
    end

    subgraph "Python Agents"
        FreelancerAgent["FreelancerAgent.py"]
        ClientAgent["ClientAgent.py"]
    end

    subgraph "ICP Backend Canisters"
        AiAgentCanister["AiAgent Canister"]
        UserCanister["User Canister"]
        JobCanister["Job Canister"]
        RatingCanister["Rating Canister"]
        OtherCanisters["... other canisters ..."]
    end

    UI_Freelancer -- "Sends query" --> FreelancerAgent
    UI_Client -- "Sends query" --> ClientAgent

    FreelancerAgent -- "Calls functions" --> AiAgentCanister
    ClientAgent -- "Calls functions" --> AiAgentCanister

    AiAgentCanister -- "matchJobs()" --> JobCanister
    AiAgentCanister -- "matchFreelancers()" --> UserCanister
    AiAgentCanister -- "getUserRatings()" --> RatingCanister

    FreelancerAgent -- "Direct calls for data" --> UserCanister
    FreelancerAgent -- "Direct calls for data" --> JobCanister
    ClientAgent -- "Direct calls for data" --> UserCanister
    ClientAgent -- "Direct calls for data" --> JobCanister

    UserCanister <--> OtherCanisters
    JobCanister <--> OtherCanisters
```

This diagram shows:
-   **User Interface**: Separate UIs for freelancers and clients.
-   **Python Agents**: The `FreelancerAgent` and `ClientAgent` that process user queries.
-   **ICP Backend Canisters**: The core of the application, with the `AiAgent` canister acting as an orchestrator for complex logic, while the agents can also call other canisters directly for simple data retrieval.

With this diagram, we have a solid architectural foundation. I'll now update our todo list.