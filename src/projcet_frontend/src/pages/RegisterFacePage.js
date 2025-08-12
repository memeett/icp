import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Card, Button, Typography, Spin, Progress, Steps, message } from 'antd';
import { CameraOutlined, CheckCircleOutlined, ScanOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
const { Title, Text } = Typography;
const { Step } = Steps;
const RegisterFacePage = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [capturedImages, setCapturedImages] = useState([]);
    const [stream, setStream] = useState(null);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const steps = [
        {
            title: 'Setup Camera',
            description: 'Allow camera access'
        },
        {
            title: 'Capture Front View',
            description: 'Look directly at camera'
        },
        {
            title: 'Capture Left Profile',
            description: 'Turn head slightly left'
        },
        {
            title: 'Capture Right Profile',
            description: 'Turn head slightly right'
        },
        {
            title: 'Complete',
            description: 'Registration finished'
        }
    ];
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
            setCurrentStep(1);
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
    const captureImage = () => {
        setIsScanning(true);
        setScanProgress(0);
        // Simulate image capture process
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    // Simulate successful capture
                    const canvas = document.createElement('canvas');
                    canvas.width = 640;
                    canvas.height = 480;
                    const ctx = canvas.getContext('2d');
                    if (ctx && videoRef.current) {
                        ctx.drawImage(videoRef.current, 0, 0);
                        const imageData = canvas.toDataURL('image/jpeg');
                        setCapturedImages(prev => [...prev, imageData]);
                    }
                    message.success('Image captured successfully!');
                    if (currentStep < 4) {
                        setCurrentStep(prev => prev + 1);
                    }
                    else {
                        setRegistrationComplete(true);
                        message.success('Face registration completed successfully!');
                    }
                    return 100;
                }
                return prev + 20;
            });
        }, 100);
    };
    const handleComplete = () => {
        stopCamera();
        message.success('Face registration saved! You can now use face login.');
        navigate('/');
    };
    const getCurrentStepContent = () => {
        switch (currentStep) {
            case 0:
                return (_jsxs("div", { className: "text-center", children: [_jsx(CameraOutlined, { className: "text-6xl text-gray-400 mb-4" }), _jsx(Title, { level: 4, children: "Camera Access Required" }), _jsx(Text, { type: "secondary", className: "block mb-6", children: "We need access to your camera to register your face for secure login." }), _jsx(Button, { type: "primary", size: "large", icon: _jsx(CameraOutlined, {}), onClick: startCamera, children: "Allow Camera Access" })] }));
            case 1:
            case 2:
            case 3:
                return (_jsxs("div", { className: "text-center", children: [_jsx(Title, { level: 4, children: steps[currentStep].title }), _jsx(Text, { type: "secondary", className: "block mb-4", children: steps[currentStep].description }), !isScanning ? (_jsx(Button, { type: "primary", size: "large", icon: _jsx(ScanOutlined, {}), onClick: captureImage, children: "Capture Image" })) : (_jsxs("div", { children: [_jsx(Spin, { size: "large" }), _jsxs("div", { className: "mt-4", children: [_jsx(Text, { children: "Capturing image..." }), _jsx(Progress, { percent: scanProgress, showInfo: false, strokeColor: "#1890ff", className: "mt-2" })] })] }))] }));
            case 4:
                return (_jsxs("div", { className: "text-center", children: [_jsx(CheckCircleOutlined, { className: "text-6xl text-green-500 mb-4" }), _jsx(Title, { level: 4, children: "Registration Complete!" }), _jsx(Text, { type: "secondary", className: "block mb-6", children: "Your face has been successfully registered. You can now use face recognition to log in." }), _jsx(Button, { type: "primary", size: "large", onClick: handleComplete, children: "Finish Setup" })] }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "max-w-3xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(Title, { level: 2, children: "Face Recognition Setup" }), _jsx(Text, { type: "secondary", children: "Register your face for secure and convenient login" })] }), _jsx(Card, { className: "mb-6", children: _jsx(Steps, { current: currentStep, size: "small", children: steps.map((step, index) => (_jsx(Step, { title: step.title, description: step.description }, index))) }) }), _jsx(Card, { children: _jsxs("div", { className: "text-center", children: [stream && currentStep > 0 && currentStep < 4 && (_jsxs("div", { className: "relative mb-6", children: [_jsxs("div", { className: "w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden", children: [_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-64 object-cover" }), isScanning && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "text-white text-center", children: [_jsx(Spin, { size: "large" }), _jsxs("div", { className: "mt-4", children: [_jsx(Text, { className: "text-white", children: "Processing..." }), _jsx(Progress, { percent: scanProgress, showInfo: false, strokeColor: "#1890ff", className: "mt-2" })] })] }) }))] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: _jsx("div", { className: "w-48 h-64 border-2 border-blue-500 border-dashed rounded-full opacity-50" }) })] })), getCurrentStepContent(), capturedImages.length > 0 && (_jsxs("div", { className: "mt-8", children: [_jsx(Title, { level: 5, children: "Captured Images" }), _jsx("div", { className: "flex justify-center space-x-4 mt-4", children: capturedImages.map((image, index) => (_jsxs("div", { className: "relative", children: [_jsx("img", { src: image, alt: `Capture ${index + 1}`, className: "w-20 h-20 object-cover rounded-lg border-2 border-green-500" }), _jsx(CheckCircleOutlined, { className: "absolute -top-2 -right-2 text-green-500 bg-white rounded-full" })] }, index))) })] }))] }) }), _jsxs(Card, { className: "mt-6", children: [_jsx(Title, { level: 4, children: "Tips for Best Results" }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: "\u2022 Ensure you're in a well-lit area" }), _jsx("li", { children: "\u2022 Remove glasses and face coverings if possible" }), _jsx("li", { children: "\u2022 Keep your face centered in the frame" }), _jsx("li", { children: "\u2022 Stay still during image capture" }), _jsx("li", { children: "\u2022 Follow the prompts for different angles" }), _jsx("li", { children: "\u2022 Make sure your entire face is visible" })] })] })] }) })] }));
};
export default RegisterFacePage;
