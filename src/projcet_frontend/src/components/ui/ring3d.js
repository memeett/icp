import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AuroraText } from "../../components/ui/aurora-text.js";
import { TypingAnimation } from "../../components/ui/typing-text.tsx";
const VantaRingsBackground = ({ className }) => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);
    useEffect(() => {
        const loadVanta = async () => {
            try {
                if (!vantaEffect && vantaRef.current) {
                    // Dynamically import Three.js and Vanta
                    const THREE = await import("three");
                    const VANTA = await import("vanta/dist/vanta.rings.min.js");
                    // Initialize the effect with light theme colors
                    const effect = VANTA.default({
                        el: vantaRef.current,
                        THREE: THREE,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 400.0,
                        minWidth: 400.0,
                        scale: 1.0,
                        scaleMobile: 1.0,
                        backgroundColor: 0xf7f7f9, // Light background to match your theme
                        color: 0x41b8aa, // Your brand color
                        backgroundAlpha: 1.0, // Slight transparency
                        ringColor: 0x41b8aa, // Match your brand color
                    });
                    setVantaEffect(effect);
                }
            }
            catch (err) {
                console.error("Error initializing Vanta:", err);
            }
        };
        loadVanta();
        // Clean up effect on component unmount
        return () => {
            if (vantaEffect) {
                vantaEffect.destroy();
            }
        };
    }, [vantaEffect]);
    // Text animation variants
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.8,
                ease: "easeOut",
            },
        }),
    };
    return (_jsxs("div", { className: "relative min-h-screen w-full", children: [_jsx("div", { ref: vantaRef, className: `absolute inset-0 w-full h-full ${className || ""}` }), _jsx("div", { className: "relative z-10 w-full h-full flex flex-col items-center px-6 lg:px-16 text-center lg:text-left", children: _jsxs("div", { className: "max-w-4xl mx-auto lg:mx-0 mt-16", children: [_jsxs(motion.div, { className: "flex flex-wrap items-center justify-start", initial: "hidden", animate: "visible", variants: {
                                hidden: { opacity: 0 },
                                visible: { opacity: 1 },
                            }, children: [_jsxs(motion.p, { className: "text-2xl md:text-4xl lg:text-7xl text-gray-800 font-bold inter-var", custom: 0, variants: textVariants, children: ["Redefining Freelancing with", " "] }), _jsx(motion.div, { custom: 1, variants: textVariants, children: _jsx(AuroraText, { className: "text-2xl md:text-4xl lg:text-7xl font-bold", children: "Ergasia" }) })] }), _jsxs(motion.div, { className: "mt-6 text-xl font-semibold text-gray-800", custom: 4, variants: textVariants, children: [_jsx("div", { className: "w-3/4", children: _jsx(TypingAnimation, { className: "inline", children: "Join Ergasia now and transform how you work." }) }), _jsxs("button", { className: "\n        px-8 \n        py-3 \n        bg-purple-600/75\n        text-white \n        font-medium \n        rounded-lg\n        hover:bg-purple-700\n        hover:shadow-lg\n        transform \n        hover:-translate-y-1\n        transition-all \n        duration-300\n        focus:outline-none \n        focus:ring-4 \n        focus:ring-purple-300\n        flex\n        items-center\n        gap-2\n        mt-6\n      ", children: ["Get Started", _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14 5l7 7m0 0l-7 7m7-7H3" }) })] })] })] }) })] }));
};
export default VantaRingsBackground;
