import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Search, ChevronRight, Circle, } from "lucide-react";
import { markInboxAsRead } from "../../controller/inboxController";
const FloatingInbox = ({ messages, isOpen, onClose }) => {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const unreadCount = messages.filter((msg) => !msg.read).length;
    const filteredMessages = messages.filter((msg) => {
        const matchesSearch = msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.senderName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUnread = showUnreadOnly ? !msg.read : true;
        return matchesSearch && matchesUnread;
    });
    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
        if (!message.read) {
            message.read = true;
            await markInboxAsRead(message.id);
        }
    };
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-50", children: [_jsx(motion.div, { className: "absolute top-16 right-4 w-80 bg-white rounded-xl shadow-xl overflow-hidden", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx("div", { className: "w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg", children: isOpen ? (_jsx(X, { className: "w-6 h-6 text-white" })) : (_jsxs(_Fragment, { children: [_jsx(Bell, { className: "w-6 h-6 text-white" }), unreadCount > 0 && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, className: "absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold", children: unreadCount }))] })) }) }), _jsx(AnimatePresence, { children: isOpen && (_jsx(motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.95 }, className: "absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-xl overflow-hidden", drag: true, dragConstraints: {
                        top: -window.innerHeight + 200, // Adjust based on your needs
                        left: -window.innerWidth + 400, // Adjust based on your needs
                        right: 0,
                        bottom: 0,
                    }, dragElastic: 0.05, dragMomentum: false, dragTransition: { power: 0.1, timeConstant: 200 }, children: _jsxs("div", { className: "h-96 flex flex-col", children: [_jsxs("div", { className: "p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-semibold", children: ["Inbox (", unreadCount, ")"] }), _jsx("button", { onClick: () => setShowUnreadOnly(!showUnreadOnly), className: `px-2 py-1 rounded-md text-sm ${showUnreadOnly ? "bg-white/20" : "hover:bg-white/10"}`, children: showUnreadOnly ? "Showing unread" : "Show all" })] }), _jsxs("div", { className: "mt-3 relative", children: [_jsx("input", { type: "text", placeholder: "Search messages...", className: "w-full pl-10 pr-4 py-2 bg-white/10 rounded-lg focus:outline-none placeholder:text-white/70", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), _jsx(Search, { className: "w-4 h-4 absolute left-3 top-2.5 text-white/70" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto bg-gray-50", children: filteredMessages.map((message) => (_jsx(motion.div, { className: `p-4 border-b border-gray-100 cursor-pointer ${selectedMessage?.id === message.id ? "bg-blue-50" : ""} ${!message.read ? "bg-blue-50/30" : ""}`, onClick: () => handleSelectMessage(message), whileHover: { backgroundColor: "rgb(239 246 255)" }, children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "flex-shrink-0 mr-3", children: !message.read ? (_jsx(Circle, { className: "w-2 h-2 text-blue-500 fill-blue-500 mt-1.5" })) : (_jsx("div", { className: "w-2 h-2" })) }), _jsxs("div", { className: "flex-grow min-w-0", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("p", { className: `truncate text-sm ${!message.read ? "font-semibold" : ""}`, children: message.senderName }), _jsx("p", { className: "text-xs text-gray-500", children: message.createdAt })] }), _jsx("p", { className: `truncate text-sm mt-1 ${!message.read ? "font-semibold" : ""}`, children: message.message })] })] }) }, message.id))) }), _jsx(AnimatePresence, { children: selectedMessage && (_jsxs(motion.div, { initial: { x: 300 }, animate: { x: 0 }, exit: { x: 300 }, className: "absolute inset-0 bg-white p-4 overflow-y-auto", children: [_jsx("button", { onClick: () => setSelectedMessage(null), className: "mb-4 text-gray-500 hover:text-gray-700", children: _jsx(ChevronRight, { className: "w-5 h-5 rotate-180" }) }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold mr-3", children: selectedMessage.senderName.charAt(0) }), _jsx("div", { children: _jsx("p", { className: "font-medium", children: selectedMessage.senderName }) })] }), _jsx("p", { className: "text-sm whitespace-pre-line", children: selectedMessage.message })] })] })) })] }) })) })] }));
};
// Keep the sampleMessages array from previous code
export default FloatingInbox;
