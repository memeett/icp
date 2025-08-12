"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { ModalBody, ModalContent, ModalFooter } from "../ui/animated-modal";
import { motion } from "framer-motion";
import { CameraIcon } from "lucide-react";
import { useModal } from "../../contexts/modal-context";
import { useNavigate } from 'react-router-dom';
import { login } from '../../controller/userController';
export function FaceVerificationModal({ parentIndex, index }) {
    const { closeModal } = useModal();
    const webcamRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const navigate = useNavigate();
    const verifyFace = async () => {
        if (!webcamRef.current)
            return;
        try {
            setIsCapturing(true);
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                throw new Error('Failed to capture image');
            }
            // Convert base64 to blob
            const base64Data = imageSrc.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            // Create form data
            const formData = new FormData();
            formData.append('file', blob, 'image.jpg');
            const response = await fetch('http://localhost:8000/verify-face', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Response from server:', result);
            if (result.status === 'success' && result.principal_id) {
                console.log("Verified successfully:", result.message);
                // Login the user
                login(result.principal_id);
                // Close the modal
                closeModal(index, parentIndex);
                // Navigate to home page
                navigate('/');
            }
            else {
                throw new Error(result.message || 'Verification failed');
            }
        }
        catch (error) {
            console.error('Error in face verification:', error);
        }
        finally {
            setIsCapturing(false);
        }
    };
    return (_jsx("div", { className: "hidden md:flex flex-column items-center space-x-4", children: _jsx(ModalBody, { className: "flex flex-column items-center space-x-4", children: _jsxs(ModalContent, { className: "max-w-2xl mx-auto bg-[#F9F7F7]", children: [_jsxs("div", { className: "space-y-6 px-8 pt-8 pb-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-3xl font-bold text-[#112D4E]", children: "Face Verification" }), _jsx("p", { className: "mt-3 text-[#112D4E] text-lg", children: "Please look at the camera to verify your identity" })] }), _jsx("div", { className: "webcam-container flex justify-center my-6", children: _jsx(Webcam, { ref: webcamRef, screenshotFormat: "image/jpeg", mirrored: true, className: "webcam border-4 border-[#112D4E] rounded-lg", style: {
                                        width: '100%',
                                        maxWidth: '480px',
                                    } }) }), _jsx("div", { className: "space-y-5", children: _jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: _jsxs("button", { className: "relative w-full flex items-center justify-center space-x-2 bg-[#112D4E] text-white border-2 border-[#112D4E] px-24 py-4 text-lg rounded-4xl transition-all hover:bg-[#1A3E6C] focus:outline-none focus:ring-2 focus:ring-[#112D4E] focus:ring-offset-2", onClick: verifyFace, disabled: isCapturing, children: [_jsx(CameraIcon, { className: "w-6 h-6" }), _jsx("span", { children: isCapturing ? 'Verifying...' : 'Verify Face' })] }) }) })] }), _jsx(ModalFooter, { className: "flex items-center justify-center mt-2 p-0", children: _jsx("div", { onClick: () => closeModal(index, parentIndex), className: "w-full h-full text-lg text-center font-semibold rounded-b-2xl border-b border-b-[#112D4E] text-black transition-colors hover:text-white hover:bg-[#D9534F] hover:border-[#D9534F] py-4", children: "Cancel" }) })] }) }) }));
}
