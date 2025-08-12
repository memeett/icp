import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Card, Button, Typography, Space, Spin, Progress, Steps, message, Tabs, Form, Input, Checkbox, Divider, Select } from 'antd';
import { CameraOutlined, UserOutlined, CheckCircleOutlined, ScanOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, GoogleOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useAuth } from '../shared/hooks/useAuth';
const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;
const { Option } = Select;
const RegisterPage = () => {
    const navigate = useNavigate();
    const { loginWithMock } = useAuth();
    const videoRef = useRef(null);
    // Face Recognition State
    const [currentStep, setCurrentStep] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [capturedImages, setCapturedImages] = useState([]);
    const [stream, setStream] = useState(null);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    // Traditional Register State
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
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
        message.success('Registration completed! You can now use face login.');
        loginWithMock();
        navigate('/');
    };
    const handleTraditionalRegister = async (values) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Registration successful!');
            loginWithMock();
            navigate('/');
        }
        catch (error) {
            message.error('Registration failed. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSocialRegister = (provider) => {
        message.info(`${provider} registration will be implemented soon`);
    };
    const getCurrentStepContent = () => {
        switch (currentStep) {
            case 0:
                return (_jsxs("div", { className: "text-center", children: [_jsx(CameraOutlined, { className: "text-6xl text-muted-foreground mb-4" }), _jsx(Title, { level: 4, children: "Camera Access Required" }), _jsx(Text, { type: "secondary", className: "block mb-6", children: "We need access to your camera to register your face for secure login." }), _jsx(Button, { type: "primary", size: "large", icon: _jsx(CameraOutlined, {}), onClick: startCamera, children: "Allow Camera Access" })] }));
            case 1:
            case 2:
            case 3:
                return (_jsxs("div", { className: "text-center", children: [_jsx(Title, { level: 4, children: steps[currentStep].title }), _jsx(Text, { type: "secondary", className: "block mb-4", children: steps[currentStep].description }), !isScanning ? (_jsx(Button, { type: "primary", size: "large", icon: _jsx(ScanOutlined, {}), onClick: captureImage, children: "Capture Image" })) : (_jsxs("div", { children: [_jsx(Spin, { size: "large" }), _jsxs("div", { className: "mt-4", children: [_jsx(Text, { children: "Capturing image..." }), _jsx(Progress, { percent: scanProgress, showInfo: false, strokeColor: "#6366f1", className: "mt-2" })] })] }))] }));
            case 4:
                return (_jsxs("div", { className: "text-center", children: [_jsx(CheckCircleOutlined, { className: "text-6xl text-green-500 mb-4" }), _jsx(Title, { level: 4, children: "Registration Complete!" }), _jsx(Text, { type: "secondary", className: "block mb-6", children: "Your face has been successfully registered. You can now use face recognition to log in." }), _jsx(Button, { type: "primary", size: "large", onClick: handleComplete, children: "Finish Setup" })] }));
            default:
                return null;
        }
    };
    const FaceRecognitionTab = () => (_jsxs("div", { children: [_jsx("div", { className: "mb-6", children: _jsx(Steps, { current: currentStep, size: "small", children: steps.map((step, index) => (_jsx(Step, { title: step.title, description: step.description }, index))) }) }), _jsxs("div", { className: "text-center", children: [stream && currentStep > 0 && currentStep < 4 && (_jsxs("div", { className: "relative mb-6", children: [_jsxs("div", { className: "w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden", children: [_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-64 object-cover" }), isScanning && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "text-white text-center", children: [_jsx(Spin, { size: "large" }), _jsxs("div", { className: "mt-4", children: [_jsx(Text, { className: "text-white", children: "Processing..." }), _jsx(Progress, { percent: scanProgress, showInfo: false, strokeColor: "#6366f1", className: "mt-2" })] })] }) }))] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: _jsx("div", { className: "w-48 h-64 border-2 border-primary border-dashed rounded-full opacity-50" }) })] })), getCurrentStepContent(), capturedImages.length > 0 && (_jsxs("div", { className: "mt-8", children: [_jsx(Title, { level: 5, children: "Captured Images" }), _jsx("div", { className: "flex justify-center space-x-4 mt-4", children: capturedImages.map((image, index) => (_jsxs("div", { className: "relative", children: [_jsx("img", { src: image, alt: `Capture ${index + 1}`, className: "w-20 h-20 object-cover rounded-lg border-2 border-green-500" }), _jsx(CheckCircleOutlined, { className: "absolute -top-2 -right-2 text-green-500 bg-white rounded-full" })] }, index))) })] }))] })] }));
    const TraditionalRegisterTab = () => (_jsxs("div", { children: [_jsxs(Form, { form: form, layout: "vertical", onFinish: handleTraditionalRegister, size: "large", children: [_jsx(Form.Item, { name: "username", label: "Full Name", rules: [{ required: true, message: 'Please enter your full name' }], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "Enter your full name" }) }), _jsx(Form.Item, { name: "email", label: "Email", rules: [
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ], children: _jsx(Input, { prefix: _jsx(MailOutlined, {}), placeholder: "Enter your email" }) }), _jsx(Form.Item, { name: "password", label: "Password", rules: [
                            { required: true, message: 'Please enter your password' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "Create a password", iconRender: (visible) => (visible ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {})) }) }), _jsx(Form.Item, { name: "confirmPassword", label: "Confirm Password", dependencies: ['password'], rules: [
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "Confirm your password", iconRender: (visible) => (visible ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {})) }) }), _jsx(Form.Item, { name: "userType", label: "I want to", rules: [{ required: true, message: 'Please select your role' }], children: _jsxs(Select, { placeholder: "Select your primary role", children: [_jsx(Option, { value: "freelancer", children: "Find work as a freelancer" }), _jsx(Option, { value: "client", children: "Hire freelancers for my projects" }), _jsx(Option, { value: "both", children: "Both hire and work as a freelancer" })] }) }), _jsx(Form.Item, { children: _jsx(Form.Item, { name: "terms", valuePropName: "checked", noStyle: true, children: _jsxs(Checkbox, { children: ["I agree to the ", _jsx(Link, { href: "#", className: "text-primary", children: "Terms of Service" }), " and", ' ', _jsx(Link, { href: "#", className: "text-primary", children: "Privacy Policy" })] }) }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", loading: isLoading, block: true, size: "large", children: "Create Account" }) })] }), _jsx(Divider, { children: "Or continue with" }), _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(Button, { block: true, size: "large", icon: _jsx(GoogleOutlined, {}), onClick: () => handleSocialRegister('Google'), children: "Continue with Google" }), _jsx(Button, { block: true, size: "large", icon: _jsx(GithubOutlined, {}), onClick: () => handleSocialRegister('GitHub'), children: "Continue with GitHub" })] })] }));
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "max-w-md mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(Title, { level: 2, children: "Join Ergasia" }), _jsx(Text, { type: "secondary", children: "Create your account to get started" })] }), _jsx(Card, { children: _jsxs(Tabs, { defaultActiveKey: "face", centered: true, children: [_jsx(TabPane, { tab: _jsxs("span", { children: [_jsx(CameraOutlined, {}), "Face Recognition"] }), children: _jsx(FaceRecognitionTab, {}) }, "face"), _jsx(TabPane, { tab: _jsxs("span", { children: [_jsx(LockOutlined, {}), "Traditional Sign Up"] }), children: _jsx(TraditionalRegisterTab, {}) }, "traditional")] }) }), _jsx("div", { className: "text-center mt-6", children: _jsxs(Text, { type: "secondary", children: ["Already have an account?", ' ', _jsx(Link, { onClick: () => navigate('/login'), className: "text-primary", children: "Sign in here" })] }) })] }) })] }));
};
export default RegisterPage;
