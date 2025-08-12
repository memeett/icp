import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, Plus, AlertCircle } from "lucide-react";
export const RequirementsStep = ({ requirements, setRequirements, error, }) => {
    const addRequirement = () => {
        setRequirements([...requirements, ""]);
    };
    const updateRequirement = (index, value) => {
        const updatedRequirements = [...requirements];
        updatedRequirements[index] = value;
        setRequirements(updatedRequirements);
    };
    const removeRequirement = (index) => {
        if (requirements.length > 1) {
            const updatedRequirements = requirements.filter((_, i) => i !== index);
            setRequirements(updatedRequirements);
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6 p-2", children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent", children: "Job Requirements" }), _jsx(AnimatePresence, { children: _jsx("div", { className: "space-y-4", children: requirements.map((req, index) => (_jsxs(motion.div, { className: "flex items-center gap-3 group", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, x: -20 }, layout: true, children: [_jsxs("div", { className: "relative flex-1", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" }), _jsx("input", { type: "text", value: req, onChange: (e) => updateRequirement(index, e.target.value), className: "w-full p-4 rounded-xl border-2 border-purple-100 bg-white/80 backdrop-blur-sm focus:border-transparent focus:ring-4 focus:ring-purple-300/30 placeholder:text-purple-300 transition-all duration-300 shadow-sm hover:shadow-md", placeholder: `Requirement #${index + 1}` })] }), requirements.length > 1 && (_jsx(motion.button, { onClick: () => removeRequirement(index), className: "p-2 text-purple-500 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition-colors", whileHover: { scale: 1.05 }, children: _jsx(Trash, { size: 24, className: "stroke-current" }) }))] }, index))) }) }), _jsxs(motion.button, { onClick: addRequirement, className: "flex items-center gap-2 w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl border-2 border-dashed border-purple-200 text-purple-600 hover:text-purple-700 transition-all", whileHover: { scale: 1.005 }, children: [_jsx(Plus, { size: 24, className: "text-purple-500" }), _jsx("span", { className: "font-medium", children: "Add New Requirement" })] }), error && (_jsxs(motion.p, { className: "text-pink-600 mt-2 flex items-center gap-2", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, children: [_jsx(AlertCircle, { size: 18 }), error] }))] }));
};
