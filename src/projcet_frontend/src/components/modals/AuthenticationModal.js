"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ModalBody, ModalContent, ModalFooter } from "../ui/animated-modal";
import { motion } from "framer-motion";
import { GlobeIcon } from "lucide-react";
import { useModal } from "../../contexts/modal-context";
import { loginWithInternetIdentity } from "../../controller/userController";
import LoadingOverlay from "../ui/loading-animation";
export function AuthenticationModal({ modalIndex }) {
    const { open, setOpen, closeModal } = useModal();
    const [loading, setLoading] = useState(false);
    const handleInternetIdentityLogin = async () => {
        setLoading(true);
        try {
            const success = await loginWithInternetIdentity();
            if (success) {
                setOpen(false);
            }
        }
        catch (error) {
            console.error("Login failed:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleClose = () => {
        if (modalIndex !== undefined) {
            closeModal(modalIndex);
        }
        else {
            setOpen(false);
        }
    };
    if (!open && modalIndex === undefined)
        return null;
    return (_jsxs("div", { className: "hidden md:flex flex-column items-center space-x-4", children: [loading && _jsx(LoadingOverlay, { message: "Connecting to Internet Identity..." }), _jsx(ModalBody, { className: "flex flex-column items-center space-x-4", children: _jsxs(ModalContent, { className: "max-w-lg mx-auto bg-[#F9F7F7]", children: [_jsxs("div", { className: "space-y-6 px-6 pt-6 pb-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-2xl font-bold text-[#112D4E]", children: "Welcome to ERGASIA" }), _jsx("p", { className: "mt-2 text-[#112D4E] text-base", children: "Sign in with Internet Identity" })] }), _jsx("div", { className: "space-y-4", children: _jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: _jsxs("button", { className: "w-full flex items-center justify-center space-x-3 bg-[#112D4E] text-white px-6 py-3 text-base font-medium rounded-xl transition-all hover:bg-[#0f2741] focus:outline-none focus:ring-2 focus:ring-[#112D4E] focus:ring-offset-2 disabled:opacity-50", onClick: handleInternetIdentityLogin, disabled: loading, children: [_jsx(GlobeIcon, { className: "w-5 h-5" }), _jsx("span", { children: loading ? "Connecting..." : "Continue with Internet Identity" })] }) }) }), _jsx("div", { className: "text-center text-xs text-gray-500", children: _jsx("p", { children: "New user? After signing in, you'll complete your profile setup." }) })] }), _jsx(ModalFooter, { className: "flex items-center justify-center mt-2 p-0", children: _jsx("div", { onClick: handleClose, className: "w-full text-center font-medium rounded-b-xl border-b border-b-[#112D4E] text-gray-600 transition-colors hover:text-white hover:bg-[#D9534F] hover:border-[#D9534F] py-3 cursor-pointer", children: "Cancel" }) })] }) })] }));
}
