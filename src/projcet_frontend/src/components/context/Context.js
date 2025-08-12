import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext } from 'react';
const BooleanContext = createContext(undefined);
export const BooleanProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    return (_jsx(BooleanContext.Provider, { value: { isActive, setIsActive }, children: children }));
};
export const useBoolean = () => {
    const context = useContext(BooleanContext);
    if (!context)
        throw new Error('useBoolean must be used within BooleanProvider');
    return context;
};
