import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import { useModal } from "./modal-context";
const NestedModalContext = createContext(null);
export const NestedModalProvider = ({ children }) => {
    const [nestedModals, setNestedModals] = useState([]);
    const openNestedModal = (modalComponent) => {
        setNestedModals(prev => [...prev, { component: modalComponent, isOpen: true }]);
    };
    const closeNestedModal = (index) => {
        setNestedModals(prev => {
            const updated = [...prev];
            if (index >= 0 && index < updated.length) {
                updated[index].isOpen = false;
            }
            return updated;
        });
    };
    return (_jsxs(NestedModalContext.Provider, { value: { nestedModals, openNestedModal, closeNestedModal }, children: [children, nestedModals.map((modal, index) => modal.isOpen ? _jsx("div", { children: modal.component }, index) : null)] }));
};
export const useNestedModal = () => {
    const context = useContext(NestedModalContext);
    if (!context) {
        throw new Error("useNestedModal must be used within a NestedModalProvider");
    }
    return context;
};
// Combined hook for both modal types
export const useModalSystem = () => {
    const modalContext = useModal();
    const nestedModalContext = useNestedModal();
    return {
        ...modalContext,
        ...nestedModalContext
    };
};
