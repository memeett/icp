import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import GlareCard from "./GlareCard";
export const ProfileCard = (user) => {
    const nav = useNavigate();
    return (_jsxs(GlareCard, { children: [_jsx("div", { className: "w-full h-[50%] overflow-hidden rounded-t-xl", children: _jsx("img", { src: URL.createObjectURL(user.profilePicture), alt: "../../assets/pic.jpeg", className: "w-full h-full object-cover" }) }), _jsx("div", { className: "group relative text-left w-full pl-4 pt-2", children: _jsx("h3", { className: "text-xl font-bold text-gray-800 transition-colors duration-200 w-full", children: _jsx("a", { href: `/profile/${user.id}`, onClick: () => nav(`/profile/${user.id}`), className: "before:absolute before:inset-0 before:z-10 hover:text-blue-600 hover:underline", children: user.username }) }) })] }));
};
