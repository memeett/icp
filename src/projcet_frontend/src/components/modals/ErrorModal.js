import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
const ErrorModal = ({ isOpen, onClose, title = "Error", message, duration, }) => {
    const [isVisible, setIsVisible] = useState(isOpen);
    // Handle auto-close if duration is provided
    useEffect(() => {
        setIsVisible(isOpen);
        let timer;
        if (isOpen && duration) {
            timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Delay actual close until animation completes
            }, duration);
        }
        return () => {
            if (timer)
                clearTimeout(timer);
        };
    }, [isOpen, duration, onClose]);
    // Handle manual close
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Delay actual close until animation completes
        console.log("kanjut");
    };
    return (_jsx(AnimatePresence, { children: isVisible && (_jsx(_Fragment, { children: _jsx(motion.div, { className: "fixed top-20 left-0 right-0 z-50 flex justify-center pointer-events-none", initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -20, opacity: 0 }, transition: { type: "spring", damping: 25, stiffness: 300 }, children: _jsxs("div", { className: "pointer-events-auto mt-6 mx-4 w-full max-w-md overflow-hidden rounded-lg shadow-lg bg-white border border-red-200", children: [_jsx("div", { className: "relative p-4", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full bg-red-50", children: _jsx(AlertTriangle, { className: "w-6 h-6 text-red-500" }) }) }), _jsxs("div", { className: "ml-3 w-0 flex-1 pt-0.5", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900", children: title }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: message })] }), _jsx("div", { className: "ml-4 flex-shrink-0 flex", children: _jsxs("button", { className: "inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2", onClick: handleClose, children: [_jsx("span", { className: "sr-only", children: "Close" }), _jsx(X, { className: "h-5 w-5", "aria-hidden": "true" })] }) })] }) }), duration && (_jsx(motion.div, { className: "h-1 bg-gradient-to-r from-red-400 to-red-600", initial: { width: "100%" }, animate: { width: "0%" }, transition: { duration: duration / 1000, ease: "linear" } }))] }) }) })) }));
};
export default ErrorModal;
