import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Monitor, Server, BrainCircuit, Gamepad2, Brush } from "lucide-react";
import { useInView } from "react-intersection-observer";
const jobCategories = [
    {
        title: "Front-end Developer",
        icon: _jsx(Monitor, { className: "w-8 h-8 text-white" }),
        gradient: "from-blue-400 to-purple-500",
        description: "Craft modern interfaces with crypto-powered payments",
    },
    {
        title: "Backend Developer",
        icon: _jsx(Server, { className: "w-8 h-8 text-white" }),
        gradient: "from-purple-400 to-pink-500",
        description: "Secure blockchain integrations & smart contracts",
    },
    {
        title: "AI Engineer",
        icon: _jsx(BrainCircuit, { className: "w-8 h-8 text-white" }),
        gradient: "from-green-400 to-cyan-500",
        description: "AI solutions with instant crypto settlements",
    },
    {
        title: "Game Development",
        icon: _jsx(Gamepad2, { className: "w-8 h-8 text-white" }),
        gradient: "from-pink-400 to-red-500",
        description: "Web3 gaming with integrated crypto payments",
    },
    {
        title: "Graphic Designer",
        icon: _jsx(Brush, { className: "w-8 h-8 text-white" }),
        gradient: "from-amber-400 to-orange-500",
        description: "Digital assets paid in cryptocurrency",
    },
];
export default function JobCategoriesLight() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    return (_jsx("section", { className: "relative py-12 bg-[#F9F7F7]", children: _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: inView ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.8 }, className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4", children: "Featured Categories" }), _jsx("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto", children: "Explore top crypto-friendly job categories on Ergasia" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8", children: jobCategories.map((category, index) => (_jsx(motion.div, { ref: ref, initial: { opacity: 0, y: 30 }, animate: inView ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.5, delay: index * 0.1 }, className: "group relative", children: _jsxs("div", { className: "relative h-full bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent transition-all shadow-sm hover:shadow-lg", children: [_jsx("div", { className: `mb-4 inline-block p-4 rounded-lg bg-gradient-to-br ${category.gradient}`, children: category.icon }), _jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-3", children: category.title }), _jsx("p", { className: "text-gray-600", children: category.description }), _jsx("div", { className: "absolute inset-0 rounded-2xl overflow-hidden", children: _jsx(motion.div, { className: "absolute inset-0 bg-gradient-to-br from-blue-50/40 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity", initial: { scale: 0.95 }, whileHover: { scale: 1 } }) }), _jsx(motion.div, { className: "absolute inset-0 rounded-2xl border-2 pointer-events-none", initial: { opacity: 0, borderColor: "transparent" }, whileHover: {
                                        opacity: 1,
                                        borderColor: "#3B82F6", // Blue-500
                                        transition: { duration: 0.3 },
                                    } })] }) }, index))) })] }) }));
}
