import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { useAuth } from "../hooks/useAuth";
import ergasiaLogo from '../assets/ergasia_logo.png';
import { LogIn } from "lucide-react";
const Navbar = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    return (_jsx("header", { className: "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: _jsxs("div", { className: "container mx-auto flex h-16 items-center justify-between px-4 md:px-6", children: [_jsx("div", { className: "flex items-center gap-2 cursor-pointer", onClick: () => navigate('/'), children: _jsx("img", { src: ergasiaLogo, alt: "Ergasia Logo", className: "h-8 w-auto" }) }), _jsxs("nav", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "ghost", onClick: () => navigate('/find-work'), children: "Find Work" }), _jsx(Button, { variant: "ghost", onClick: () => navigate('/post-job'), children: "Post a Job" }), isAuthenticated ? (_jsx(Button, { onClick: () => navigate('/dashboard'), children: "Dashboard" })) : (_jsxs(Button, { onClick: () => navigate('/login'), children: [_jsx(LogIn, { className: "mr-2 h-4 w-4" }), " Sign In"] }))] })] }) }));
};
export default Navbar;
