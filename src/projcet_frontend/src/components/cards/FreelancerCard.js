import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function FreelancerCard({ user }) {
    const nav = useNavigate();
    const viewDetails = useCallback(() => {
        nav("/profile/" + user.id);
    }, [nav]);
    return (_jsxs(motion.div, { className: " bg-white rounded-2xl overflow-hidden shadow-lg", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 }, whileHover: { scale: 1.02 }, onClick: viewDetails, children: [_jsx("div", { className: "h-24 bg-gradient-to-r from-blue-400 to-purple-400 min-w-64" }), _jsxs("div", { className: "px-6 pb-6 -mt-12", children: [_jsx(motion.div, { className: "flex justify-center", children: _jsx("img", { src: URL.createObjectURL(user.profilePicture) || "/pic.jpeg", alt: "Profile", className: "w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" }) }), _jsxs("div", { className: "text-center mt-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400", children: user.username }), _jsxs("div", { className: "flex items-center justify-center mt-1 text-gray-600", children: [_jsx(Star, { className: "w-4 h-4 text-purple-400 mr-1" }), _jsxs("span", { children: [user.rating, "/5"] })] })] }), _jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: user.preference?.map((pref, index) => (_jsx(motion.span, { className: "px-3 py-1 text-sm rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 text-blue-600", whileHover: { scale: 1.05 }, children: pref.jobCategoryName }, index))) })] })] }));
}
