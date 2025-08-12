"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/tvMerge";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, } from "react";
import { useOutsideClick } from "../../utils/useTapOutside";
import "../../styles/style.css";
import { useModal } from "../../contexts/modal-context";
export const ModalTrigger = ({ children, className, }) => {
    const { setOpen } = useModal();
    return (_jsx("button", { className: cn("px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden", className), onClick: () => setOpen(true), children: children }));
};
export const ModalBody = ({ children, className, }) => {
    const { open, setOpen } = useModal();
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    }, [open]);
    const modalRef = useRef(null);
    useOutsideClick(modalRef, () => setOpen(false));
    return (_jsx(AnimatePresence, { mode: "wait", children: open && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "fixed h-screen w-screen inset-0 bg-black/30 backdrop-blur-sm z-50 m-0" }, "overlay"), _jsx(motion.div, { initial: {
                        opacity: 0,
                        scale: 0.95,
                        y: 20,
                    }, animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }, exit: {
                        opacity: 0,
                        scale: 0.95,
                        y: 20,
                    }, transition: {
                        type: "spring",
                        bounce: 0.5,
                        duration: 0.3,
                        exit: { duration: 0.2 },
                    }, className: "fixed inset-0 flex items-center justify-center z-50 pointer-events-none", children: _jsx("div", { ref: modalRef, className: `pointer-events-auto ${className || ""}`, children: children }) }, "modal")] })) }));
};
export const ModalContent = ({ children, className, }) => {
    return (_jsx("div", { className: `bg-white rounded-2xl shadow-xl overflow-hidden ${className || ""}`, children: children }));
};
export const ModalFooter = ({ children, className, }) => {
    return _jsx("div", { className: `${className || ""}`, children: children });
};
