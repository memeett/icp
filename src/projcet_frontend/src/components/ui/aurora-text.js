import { jsx as _jsx } from "react/jsx-runtime";
// AuroraText.tsx
import { motion } from "framer-motion";
import { cn } from "../../lib/tvMerge";
import "../../styles/aurora.css";
export function AuroraText({ className, children, as: Component = "span", ...props }) {
    const MotionComponent = motion(Component);
    return (_jsx(MotionComponent, { className: cn("relative inline-block overflow-hidden bg-transparent py-2", className), ...props, children: _jsx("span", { className: "\n    relative \n    z-10 \n    bg-gradient-to-br \n    from-[hsl(var(--aurora-color-1))] \n    via-[hsl(var(--aurora-color-2))] \n    to-[hsl(var(--aurora-color-4))] \n    bg-clip-text \n    animate-aurora-gradient\n    text-transparent\n    dark:selection:text-blue-950\n    selection:text-white\n    selection:bg-clip-border\n  ", children: children }) }));
}
