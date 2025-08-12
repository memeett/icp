import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform, } from "framer-motion";
import { useRef } from "react";
const MovingBorder = ({ children, duration = 2000, ...otherProps }) => {
    const pathRef = useRef();
    const progress = useMotionValue(0);
    useAnimationFrame((time) => {
        const length = pathRef.current?.getTotalLength();
        if (length) {
            const pxPerMillisecond = length / duration;
            progress.set((time * pxPerMillisecond) % length);
        }
    });
    const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
    const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);
    const transform = useMotionTemplate `translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;
    return (_jsxs(_Fragment, { children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "none", style: {
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                }, width: "100%", height: "100%", ...otherProps, children: _jsx("rect", { fill: "none", width: "100%", height: "100%", rx: "12px", ry: "12px", ref: pathRef }) }), _jsx(motion.div, { style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    transform,
                }, children: children })] }));
};
export const AnimatedNavLink = ({ href, children, className = "", duration = 2000, borderColor = "#00A8CC", textColor = "#000000", backgroundColor = "#F9F7F7", }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (_jsxs("div", { className: `relative inline-block p-3 bg-transparent rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${className}`, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [isHovered && (_jsx(MovingBorder, { duration: duration, children: _jsx("div", { className: "h-5 w-5 opacity-100", style: {
                        background: `radial-gradient(circle, ${borderColor} 40%, transparent 60%)`,
                    } }) })), _jsx("div", { className: "absolute inset-0.5 rounded-lg", style: { background: backgroundColor, zIndex: 1 } }), _jsx(motion.a, { href: href, className: `relative z-10 block text-base`, style: {
                    color: textColor,
                    fontWeight: isHovered ? 600 : 400, // Controlled by parent hover
                }, transition: { duration: 0.1, ease: "backInOut" }, children: children })] }));
};
export default AnimatedNavLink;
