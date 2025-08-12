import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Card, Button, Typography, Space, Alert, Spin, Progress, message } from 'antd';
import { CameraOutlined, UserOutlined, LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
const { Title, Text } = Typography;
const LoginFacePage = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanResult, setScanResult] = useState(null);
    const [stream, setStream] = useState(null);
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        }
        catch (error) {
            message.error('Unable to access camera. Please check permissions.');
        }
    };
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };
    const startFaceRecognition = () => {
        setIsScanning(true);
        setScanProgress(0);
        setScanResult(null);
        // Simulate face recognition process
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    // Simulate random success/failure for demo
                    const success = Math.random() > 0.3;
                    setScanResult(success ? 'success' : 'failed');
                    if (success) {
                        message.success('Face recognition successful!');
                        setTimeout(() => {
                            navigate('/');
                        }, 2000);
                    }
                    else {
                        message.error('Face recognition failed. Please try again.');
                    }
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };
    const handleRetry = () => {
        setScanResult(null);
        setScanProgress(0);
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(Title, { level: 2, children: "Face Recognition Login" }), _jsx(Text, { type: "secondary", children: "Use your face to securely log into your account" })] }), _jsx(Card, { children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "relative mb-6", children: _jsxs("div", { className: "w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden", children: [stream ? (_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-64 object-cover" })) : (_jsx("div", { className: "w-full h-64 flex items-center justify-center bg-gray-200", children: _jsx(CameraOutlined, { className: "text-4xl text-gray-400" }) })), isScanning && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "text-white text-center", children: [_jsx(Spin, { size: "large" }), _jsxs("div", { className: "mt-4", children: [_jsx(Text, { className: "text-white", children: "Scanning face..." }), _jsx(Progress, { percent: scanProgress, showInfo: false, strokeColor: "#1890ff", className: "mt-2" })] })] }) })), scanResult && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "text-center", children: [scanResult === 'success' ? (_jsx(CheckCircleOutlined, { className: "text-6xl text-green-500 mb-4" })) : (_jsx(CloseCircleOutlined, { className: "text-6xl text-red-500 mb-4" })), _jsx(Text, { className: `text-xl ${scanResult === 'success' ? 'text-green-500' : 'text-red-500'}`, children: scanResult === 'success' ? 'Login Successful!' : 'Recognition Failed' })] }) }))] }) }), !stream && !isScanning && !scanResult && (_jsx(Alert, { message: "Camera Access Required", description: "Please allow camera access to use face recognition login.", type: "info", showIcon: true, className: "mb-6" })), scanResult === 'failed' && (_jsx(Alert, { message: "Recognition Failed", description: "Face not recognized. Please ensure good lighting and face the camera directly.", type: "error", showIcon: true, className: "mb-6" })), scanResult === 'success' && (_jsx(Alert, { message: "Login Successful", description: "Redirecting to dashboard...", type: "success", showIcon: true, className: "mb-6" })), _jsx(Space, { size: "large", children: !stream ? (_jsx(Button, { type: "primary", size: "large", icon: _jsx(CameraOutlined, {}), onClick: startCamera, children: "Start Camera" })) : (_jsxs(_Fragment, { children: [!isScanning && !scanResult && (_jsx(Button, { type: "primary", size: "large", icon: _jsx(UserOutlined, {}), onClick: startFaceRecognition, children: "Start Recognition" })), scanResult === 'failed' && (_jsx(Button, { type: "primary", size: "large", onClick: handleRetry, children: "Try Again" })), _jsx(Button, { size: "large", onClick: stopCamera, disabled: isScanning, children: "Stop Camera" })] })) }), _jsxs("div", { className: "mt-8 pt-6 border-t", children: [_jsx(Text, { type: "secondary", className: "block mb-4", children: "Having trouble with face recognition?" }), _jsx(Button, { icon: _jsx(LockOutlined, {}), onClick: () => navigate('/login'), children: "Use Traditional Login" })] })] }) }), _jsxs(Card, { className: "mt-6", children: [_jsx(Title, { level: 4, children: "Instructions" }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: "\u2022 Ensure you're in a well-lit area" }), _jsx("li", { children: "\u2022 Face the camera directly" }), _jsx("li", { children: "\u2022 Remove any face coverings" }), _jsx("li", { children: "\u2022 Stay still during the scanning process" }), _jsx("li", { children: "\u2022 Make sure your entire face is visible" })] })] })] }) })] }));
};
export default LoginFacePage;
