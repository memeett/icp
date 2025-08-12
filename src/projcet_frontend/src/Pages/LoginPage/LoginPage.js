import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Navbar from "../../components/Navbar";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import { ModalProvider, useModal } from "../../contexts/modal-context.js";
import { NestedModalProvider } from "../../contexts/nested-modal-context.js"; // Import new provider
import { authUtils } from "../../utils/authUtils.js";
import { PenLine } from "lucide-react";
import { TypingAnimation } from "../../components/ui/typing-text.tsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProcessFlow from "../../components/cards/TransactionStepCard.tsx";
import WhyChoose from "../../components/cards/ChooseErgasia.tsx";
import JobCategories from "../../components/cards/CategoriesCard.tsx";
import { getAllUsers } from "../../controller/userController.ts";
import LoadingOverlay from "../../components/ui/loading-animation.tsx";
import CallToAction from "../../components/buttons/DualAction.tsx";
import { useAgent } from "../../singleton/AgentProvider";
const BackgroundPattern = () => (_jsxs("svg", { className: "absolute inset-0 w-full h-full opacity-10", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("defs", { children: _jsx("pattern", { id: "grid", width: "20", height: "20", patternUnits: "userSpaceOnUse", children: _jsx("path", { d: "M 20 0 L 0 0 0 20", fill: "none", stroke: "white", strokeWidth: "1" }) }) }), _jsx("rect", { width: "100%", height: "100%", fill: "url(#grid)" })] }));
const FloatingBubbles = () => {
    const bubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 30 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
    }));
    return (_jsx(_Fragment, { children: bubbles.map((bubble) => (_jsx(motion.div, { className: "absolute rounded-full bg-white opacity-10", style: {
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
            }, animate: {
                y: [0, -20, 0],
                opacity: [0.05, 0.2, 0.05],
            }, transition: {
                duration: bubble.duration,
                repeat: Infinity,
                ease: "easeInOut",
            } }, bubble.id))) }));
};
function LoginPageContent() {
    const { current_user } = authUtils();
    const [isHovered, setIsHovered] = useState(false);
    const [modalIndex, setModalIndex] = useState(null);
    const [freelancers, setFreelancers] = useState([]);
    const { setOpen, openModal } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    const { getAgent } = useAgent();
    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const users = await getAllUsers();
                if (users) {
                    setFreelancers(users);
                }
                else {
                    setFreelancers([]);
                    console.error("No users found or error fetching users");
                }
            }
            catch (error) {
                console.error("Error fetching freelancers:", error);
                setFreelancers([]);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchFreelancers();
    }, [current_user]);
    // Option 1: Use the simple modal toggle
    const handleSimpleModalOpen = () => {
        setOpen(true);
    };
    // Option 2: Use the more advanced modal system with index tracking
    const handleModalOpen = () => {
        const index = openModal();
        setModalIndex(index);
    };
    return (_jsxs("div", { className: "flex flex-col h-screen bg-[#f7f7f9]", children: [_jsx(Navbar, {}), isLoading && _jsx(LoadingOverlay, { message: "Loading freelancers..." }), _jsxs("div", { className: "flex-grow overflow-x-hidden [&::-webkit-scrollbar]:hidden", children: [_jsxs("div", { className: "relative my-12 flex flex-col border-2 mx-6 border-blue-400 px-8 py-8  rounded-4xl", children: [_jsxs("div", { className: "w-full max-w-6xl mx-auto pb-12", children: [_jsx("h2", { className: "text-4xl text-center mb-8 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400", children: "Start Your Crypto Journey" }), _jsx("p", { className: "text-center text-purple-700 text-xl mb-12 max-w-2xl mx-auto", children: "Join the decentralized workforce marketplace where payments are secure, instant, and borderless." }), _jsx(CallToAction, {})] }), _jsx(ProcessFlow, {})] }), _jsx(WhyChoose, {}), _jsx("div", { className: "relative flex flex-col items-center justify-center mt-12", children: _jsxs(motion.div, { className: "relative overflow-hidden bg-gradient-to-br from-blue-400  to-purple-400 w-[85%] h-72 px-12 py-8 text-4xl rounded-4xl font-bold shadow-lg", initial: { opacity: 0.9 }, animate: {
                                boxShadow: isHovered
                                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                                    : "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                                y: isHovered ? -5 : 0,
                            }, onHoverStart: () => setIsHovered(true), onHoverEnd: () => setIsHovered(false), transition: { duration: 0.3 }, children: [_jsx(BackgroundPattern, {}), _jsx(FloatingBubbles, {}), _jsx(motion.div, { className: "absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white", animate: {
                                        opacity: [0.1, 0.2, 0.1],
                                        scale: [1, 1.05, 1],
                                    }, transition: {
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    } }), _jsx(motion.div, { className: "absolute inset-0 rounded-4xl border border-white opacity-20", animate: { opacity: [0.1, 0.3, 0.1] }, transition: { duration: 3, repeat: Infinity } }), _jsxs("div", { className: "relative z-10", children: [_jsx(motion.div, { className: "text-white", initial: { x: -10, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.5 }, children: "Why bother with traditional payment methods?" }), _jsxs(motion.div, { className: "text-white", initial: { x: -10, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.5, delay: 0.2 }, children: ["Behold the power of Cryptocurrency, only in", " ", _jsx(TypingAnimation, { className: "inline", children: "Ergasia." })] }), _jsxs(motion.button, { onClick: handleSimpleModalOpen, className: "bg-white px-8 py-4 rounded-2xl font-medium border-solid border-2 border-white hover:text-black text-[#41b8aa] mt-4 relative overflow-hidden group", whileHover: { scale: 1.03 }, whileTap: { scale: 0.98 }, children: [_jsx(motion.div, { className: "absolute inset-0 bg-white opacity-0 group-hover:opacity-10", animate: {
                                                        x: ["0%", "100%"],
                                                    }, transition: {
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    } }), _jsxs("div", { className: "flex items-center justify-center text-center text-xl relative z-10 ", children: ["Sign in ", _jsx(PenLine, { className: "inline stroke-2 w-4 ml-2" })] })] })] })] }) }), _jsx(JobCategories, {})] }), modalIndex !== null ? (_jsx(AuthenticationModal, { modalIndex: modalIndex })) : (_jsx(AuthenticationModal, {}))] }));
}
export default function LoginPage() {
    return (_jsx(ModalProvider, { children: _jsx(NestedModalProvider, { children: _jsx(LoginPageContent, {}) }) }));
}
