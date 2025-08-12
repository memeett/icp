"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/tvMerge";
import { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
export const WavyBackground = ({ children, className, containerClassName, colors, waveWidth, backgroundFill, blur = 15, speed = "fast", waveOpacity = 0.5, ...props }) => {
    const noise = createNoise3D();
    let w, h, nt, i, x, ctx, canvas;
    const canvasRef = useRef(null);
    const getSpeed = () => {
        switch (speed) {
            case "slow":
                return 0.001;
            case "fast":
                return 0.002;
            default:
                return 0.001;
        }
    };
    const init = () => {
        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        w = ctx.canvas.width = window.innerWidth;
        h = ctx.canvas.height = window.innerHeight;
        ctx.filter = `blur(${blur}px)`;
        nt = 0;
        window.onresize = function () {
            w = ctx.canvas.width = window.innerWidth;
            h = ctx.canvas.height = window.innerHeight;
            ctx.filter = `blur(${blur}px)`;
        };
        render();
    };
    const waveColors = colors ?? [
        "#2A9D8F",
        "#112D4E",
        "#64B6F7",
        "#3F72AF",
    ];
    const drawWave = (n) => {
        nt += getSpeed();
        for (i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.lineWidth = waveWidth || 50;
            ctx.strokeStyle = waveColors[i % waveColors.length];
            for (x = 0; x < w; x += 5) {
                var y = noise(x / 800, 0.3 * i, nt) * 100;
                ctx.lineTo(x, y + h * 0.6); // adjust for height, currently at 50% of the container
            }
            ctx.stroke();
            ctx.closePath();
        }
    };
    let animationId;
    const render = () => {
        ctx.fillStyle = backgroundFill || "black";
        ctx.globalAlpha = waveOpacity || 0.5;
        ctx.fillRect(0, 0, w, h);
        drawWave(5);
        animationId = requestAnimationFrame(render);
    };
    useEffect(() => {
        init();
        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);
    const [isSafari, setIsSafari] = useState(false);
    useEffect(() => {
        // I'm sorry but i have got to support it on safari.
        setIsSafari(typeof window !== "undefined" &&
            navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("Chrome"));
    }, []);
    return (_jsxs("div", { className: cn("relative flex flex-col items-center justify-center overflow-hidden w-screen h-screen", containerClassName), children: [_jsx("canvas", { className: "absolute inset-0 z-0", ref: canvasRef, id: "canvas", style: {
                    ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
                } }), _jsx("div", { className: cn("relative z-10", className), ...props, children: children })] }));
};
