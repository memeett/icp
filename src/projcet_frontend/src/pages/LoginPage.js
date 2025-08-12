import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Card, Button, Typography, Space, Alert, Spin, Progress, message, Tabs, Form, Input, Checkbox, Divider } from 'antd';
import { CameraOutlined, UserOutlined, LockOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeInvisibleOutlined, EyeTwoTone, GoogleOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useAuth } from '../shared/hooks/useAuth';
const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;
const LoginPage = () => {
    const navigate = useNavigate();
    const { loginWithMock } = useAuth();
    const videoRef = useRef(null);
    // Face Recognition State
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanResult, setScanResult] = useState(null);
    const [stream, setStream] = useState(null);
    // Traditional Login State
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
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
                            loginWithMock();
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
    const handleTraditionalLogin = async (values) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            // For demo purposes, accept any email/password combination
            message.success('Login successful!');
            loginWithMock();
            navigate('/');
        }
        catch (error) {
            message.error('Login failed. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSocialLogin = (provider) => {
        message.info(`${provider} login will be implemented soon`);
    };
    const FaceRecognitionTab = () => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "relative mb-6", children: _jsxs("div", { className: "w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden", children: [stream ? (_jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-64 object-cover" })) : (_jsx("div", { className: "w-full h-64 flex items-center justify-center bg-muted", children: _jsx(CameraOutlined, { className: "text-4xl text-muted-foreground" }) })), isScanning && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "text-white text-center", children: [_jsx(Spin, { size: "large" }), _jsxs("div", { className: "mt-4", children: [_jsx(Text, { className: "text-white", children: "Scanning face..." }), _jsx(Progress, { percent: scanProgress, showInfo: false, strokeColor: "#6366f1", className: "mt-2" })] })] }) })), scanResult && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "text-center", children: [scanResult === 'success' ? (_jsx(CheckCircleOutlined, { className: "text-6xl text-green-500 mb-4" })) : (_jsx(CloseCircleOutlined, { className: "text-6xl text-red-500 mb-4" })), _jsx(Text, { className: `text-xl ${scanResult === 'success' ? 'text-green-500' : 'text-red-500'}`, children: scanResult === 'success' ? 'Login Successful!' : 'Recognition Failed' })] }) }))] }) }), !stream && !isScanning && !scanResult && (_jsx(Alert, { message: "Camera Access Required", description: "Please allow camera access to use face recognition login.", type: "info", showIcon: true, className: "mb-6" })), scanResult === 'failed' && (_jsx(Alert, { message: "Recognition Failed", description: "Face not recognized. Please ensure good lighting and face the camera directly.", type: "error", showIcon: true, className: "mb-6" })), scanResult === 'success' && (_jsx(Alert, { message: "Login Successful", description: "Redirecting to dashboard...", type: "success", showIcon: true, className: "mb-6" })), _jsx(Space, { size: "large", children: !stream ? (_jsx(Button, { type: "primary", size: "large", icon: _jsx(CameraOutlined, {}), onClick: startCamera, children: "Start Camera" })) : (_jsxs(_Fragment, { children: [!isScanning && !scanResult && (_jsx(Button, { type: "primary", size: "large", icon: _jsx(UserOutlined, {}), onClick: startFaceRecognition, children: "Start Recognition" })), scanResult === 'failed' && (_jsx(Button, { type: "primary", size: "large", onClick: handleRetry, children: "Try Again" })), _jsx(Button, { size: "large", onClick: stopCamera, disabled: isScanning, children: "Stop Camera" })] })) })] }));
    const TraditionalLoginTab = () => (_jsxs("div", { children: [_jsxs(Form, { form: form, layout: "vertical", onFinish: handleTraditionalLogin, size: "large", children: [_jsx(Form.Item, { name: "email", label: "Email", rules: [
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ], children: _jsx(Input, { prefix: _jsx(MailOutlined, {}), placeholder: "Enter your email" }) }), _jsx(Form.Item, { name: "password", label: "Password", rules: [{ required: true, message: 'Please enter your password' }], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "Enter your password", iconRender: (visible) => (visible ? _jsx(EyeTwoTone, {}) : _jsx(EyeInvisibleOutlined, {})) }) }), _jsx(Form.Item, { children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Form.Item, { name: "remember", valuePropName: "checked", noStyle: true, children: _jsx(Checkbox, { children: "Remember me" }) }), _jsx(Link, { href: "#", className: "text-primary", children: "Forgot password?" })] }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", loading: isLoading, block: true, size: "large", children: "Sign In" }) })] }), _jsx(Divider, { children: "Or continue with" }), _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(Button, { block: true, size: "large", icon: _jsx(GoogleOutlined, {}), onClick: () => handleSocialLogin('Google'), children: "Continue with Google" }), _jsx(Button, { block: true, size: "large", icon: _jsx(GithubOutlined, {}), onClick: () => handleSocialLogin('GitHub'), children: "Continue with GitHub" })] })] }));
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "max-w-md mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(Title, { level: 2, children: "Welcome Back" }), _jsx(Text, { type: "secondary", children: "Sign in to your account to continue" })] }), _jsx(Card, { children: _jsxs(Tabs, { defaultActiveKey: "face", centered: true, children: [_jsx(TabPane, { tab: _jsxs("span", { children: [_jsx(CameraOutlined, {}), "Face Recognition"] }), children: _jsx(FaceRecognitionTab, {}) }, "face"), _jsx(TabPane, { tab: _jsxs("span", { children: [_jsx(LockOutlined, {}), "Traditional Login"] }), children: _jsx(TraditionalLoginTab, {}) }, "traditional")] }) }), _jsx("div", { className: "text-center mt-6", children: _jsxs(Text, { type: "secondary", children: ["Don't have an account?", ' ', _jsx(Link, { onClick: () => navigate('/register'), className: "text-primary", children: "Sign up here" })] }) })] }) })] }));
};
export default LoginPage;
