import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "../controller/userController";
import { useNavigate } from "react-router-dom";
import { Camera, X } from "lucide-react";
const FaceRecognition = ({ principalId, onSuccess, onError, mode: initialMode, isOpen, onClose, }) => {
    const webcamRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [currentMode, setCurrentMode] = useState(initialMode);
    const [captureCount, setCaptureCount] = useState(0);
    const [registrationStatus, setRegistrationStatus] = useState("idle");
    const navigate = useNavigate();
    useEffect(() => {
        if (isOpen) {
            setCurrentMode(initialMode);
            setCaptureCount(0);
            setRegistrationStatus("idle");
        }
    }, [isOpen, initialMode]);
    const capture = async () => {
        if (!webcamRef.current || isCapturing)
            return;
        try {
            setIsCapturing(true);
            setRegistrationStatus("processing");
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                throw new Error("Failed to capture image");
            }
            // Convert base64 to blob
            const base64Data = imageSrc.split(",")[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "image/jpeg" });
            // Create form data
            const formData = new FormData();
            formData.append("file", blob, "image.jpg");
            // Only add principal_id if in register mode
            if (currentMode === "register") {
                formData.append("principal_id", principalId);
            }
            const endpoint = currentMode === "register" ? "/register-face" : "/verify-face";
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Response from server:", result);
            if (result.status === "success") {
                console.log(result.message);
                setRegistrationStatus("success");
                if (currentMode === "verify" && result.principal_id) {
                    // Handle successful verification
                    setTimeout(() => {
                        onSuccess({
                            principalId: result.principal_id,
                            similarity: result.similarity,
                            message: result.message,
                        });
                        login(result.principal_id);
                        navigate("/");
                        onClose();
                    }, 1500);
                }
                else {
                    // Handle successful registration
                    setCaptureCount((prev) => prev + 1);
                    setTimeout(() => {
                        if (captureCount >= 2) {
                            // If this was the 3rd capture (0-indexed)
                            onSuccess();
                            onClose();
                        }
                        else {
                            setRegistrationStatus("idle");
                        }
                    }, 1500);
                }
            }
            else {
                setRegistrationStatus("error");
                onError(result.message || "Failed to process request");
            }
        }
        catch (error) {
            console.error("Error in capture:", error);
            setRegistrationStatus("error");
            onError(error instanceof Error ? error.message : "Unknown error occurred");
        }
        finally {
            setIsCapturing(false);
        }
    };
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed inset-0 bg-black/40 backdrop-blur-sm z-40", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose }), _jsx(motion.div, { className: "fixed inset-0 z-50 flex items-center justify-center top-12", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { type: "spring", damping: 25, stiffness: 300 }, children: _jsxs("div", { className: "max-h-[80vh] max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col", children: [_jsxs("div", { className: "relative px-8 pt-4 pb-4", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-70" }), _jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 rounded-full bg-white/80 text-gray-500 hover:bg-white hover:text-gray-700 transition-colors z-10", children: _jsx(X, { className: "h-5 w-5" }) }), _jsxs("div", { className: "relative z-10 text-center", children: [_jsx("h3", { className: "text-[2rem] font-bold text-gray-800", children: currentMode === "register"
                                                    ? "Face Registration"
                                                    : "Face Verification" }), _jsxs("p", { className: "mt-2 text-gray-600", children: ["Please look at the camera and", " ", currentMode === "register"
                                                        ? "capture your face to register"
                                                        : "verify your identity"] }), currentMode === "register" && (_jsx(_Fragment, { children: _jsxs("div", { className: "mt-2 flex items-center justify-center", children: [_jsx("div", { className: "flex space-x-1", children: [0, 1, 2].map((step) => (_jsx("div", { className: `w-3 h-3 rounded-full ${step < captureCount
                                                                    ? "bg-green-500"
                                                                    : step === captureCount
                                                                        ? "bg-blue-500"
                                                                        : "bg-gray-200"}` }, step))) }), _jsxs("span", { className: "ml-2 text-sm text-gray-600", children: [captureCount, "/3 captures"] })] }) }))] })] }), _jsxs("div", { className: "px-8 py-4 flex justify-center", children: [_jsx(Webcam, { ref: webcamRef, screenshotFormat: "image/jpeg", mirrored: true, className: "w-[20vw]" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: _jsx("div", { className: "w-[12rem] h-[12rem] border-2 border-white/40 rounded-full" }) }), registrationStatus === "processing" && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/20", children: _jsx("div", { className: "p-4 rounded-lg bg-white/90", children: _jsx("div", { className: "animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" }) }) })), registrationStatus === "success" && (_jsx(motion.div, { className: "absolute inset-0 flex items-center justify-center bg-black/20", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(motion.div, { className: "p-4 rounded-lg bg-white/90 text-green-500", initial: { scale: 0.8 }, animate: { scale: 1 }, children: _jsx("svg", { className: "w-16 h-16", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }) })), registrationStatus === "error" && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/20", children: _jsx("div", { className: "p-4 rounded-lg bg-white/90 text-red-500", children: _jsx("svg", { className: "w-16 h-16", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }) }))] }), _jsx("div", { className: "p-8 pt-2 flex justify-center", children: _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: capture, disabled: isCapturing || registrationStatus === "processing", className: `
                    relative w-1/2 flex items-center justify-center space-x-2 
                    ${registrationStatus === "processing"
                                        ? "bg-gray-400"
                                        : registrationStatus === "success"
                                            ? "bg-green-500 hover:bg-green-600"
                                            : registrationStatus === "error"
                                                ? "bg-red-500 hover:bg-red-600"
                                                : currentMode === "register"
                                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                                    : "bg-blue-600 hover:bg-blue-700"}
                    text-white font-medium px-6 py-4 rounded-xl transition-all
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `, children: registrationStatus === "processing" ? (_jsx("span", { children: "Processing..." })) : registrationStatus === "success" ? (_jsx(_Fragment, { children: _jsx("span", { children: "Captured Successfully!" }) })) : registrationStatus === "error" ? (_jsx(_Fragment, { children: _jsx("span", { children: "Try Again" }) })) : (_jsxs(_Fragment, { children: [_jsx(Camera, { className: "w-5 h-5" }), _jsx("span", { children: currentMode === "register"
                                                    ? `Capture Face ${captureCount + 1}/3`
                                                    : "Verify Face" })] })) }) }), _jsxs("button", { onClick: onClose, className: "relative bottom-0 w-full py-4 text-center font-medium border-t border-gray-100 text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-colors", children: ["Cancel", " ", currentMode === "register" ? "Registration" : "Verification"] })] }) })] })) }));
};
export default FaceRecognition;
