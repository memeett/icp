import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
const ModalContext = createContext(null);
export const ModalProvider = ({ children }) => {
    const [modalStates, setModalStates] = useState([]);
    const [open, setOpen] = useState(false);
    const openModal = (parentIndex) => {
        if (parentIndex === undefined) {
            const newIndex = modalStates.length;
            setModalStates([...modalStates, { isOpen: true }]);
            return newIndex;
        }
        else {
            let childIndex = 0;
            setModalStates(prevStates => {
                const newStates = [...prevStates];
                if (!newStates[parentIndex].children) {
                    newStates[parentIndex].children = [];
                }
                childIndex = newStates[parentIndex].children.length;
                newStates[parentIndex].children.push({ isOpen: true });
                return newStates;
            });
            return childIndex;
        }
    };
    const closeModal = (index, parentIndex) => {
        setModalStates(prevStates => {
            const newStates = [...prevStates];
            if (parentIndex === undefined) {
                if (index >= 0 && index < newStates.length) {
                    newStates[index].isOpen = false;
                }
            }
            else {
                if (parentIndex >= 0 &&
                    parentIndex < newStates.length &&
                    newStates[parentIndex].children &&
                    index >= 0 &&
                    index < newStates[parentIndex].children.length) {
                    newStates[parentIndex].children[index].isOpen = false;
                }
            }
            return newStates;
        });
    };
    // Prevent body scrolling when any modal is open
    useEffect(() => {
        const isAnyModalOpen = modalStates.some(state => state.isOpen || state.children?.some(child => child.isOpen)) || open;
        document.body.style.overflow = isAnyModalOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [modalStates, open]);
    return (_jsx(ModalContext.Provider, { value: { modalStates, openModal, closeModal, open, setOpen }, children: children }));
};
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};
