import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Modal = ({ isOpen, onClose, onPay, amount }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-96", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Payment Required" }), _jsxs("p", { className: "text-gray-700 mb-6", children: ["You need to transfer ", _jsxs("span", { className: "font-bold", children: ["$", amount.toFixed(2)] }), " to start the job."] }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx("button", { className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all", onClick: onClose, children: "Close" }), _jsx("button", { className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all", onClick: onPay, children: "Pay" })] })] }) }));
};
export default Modal;
