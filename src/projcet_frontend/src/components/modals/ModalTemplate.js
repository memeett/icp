import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
const Modal = ({ isOpen, onClose, title, children }) => {
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: onClose }), _jsxs(motion.div, { initial: { y: 20, scale: 0.95 }, animate: { y: 0, scale: 1 }, exit: { y: 20, scale: 0.95 }, className: "relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden", children: [title && (_jsxs("div", { className: "px-6 py-4 border-b border-gray-100 flex items-center justify-between", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800", children: title }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors", children: _jsx(X, { size: 20 }) })] })), _jsx("div", { className: "p-6", children: children })] })] })) }));
};
export default Modal;
