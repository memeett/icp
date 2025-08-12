import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { agentService } from "./agentService";
const AgentContext = createContext(undefined);
export const AgentProvider = ({ children }) => {
    return (_jsx(AgentContext.Provider, { value: { getAgent: agentService.getAgent.bind(agentService) }, children: children }));
};
export const useAgent = () => {
    const context = useContext(AgentContext);
    if (!context) {
        throw new Error("useAgent must be used within AgentProvider");
    }
    return context;
};
