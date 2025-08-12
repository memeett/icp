import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Form, Input, Button, Upload, DatePicker, Select, Card, Typography, Space, message, Row, Col, Avatar, Divider } from 'antd';
import { UserOutlined, CameraOutlined, CalendarOutlined, TagsOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';
import dayjs from 'dayjs';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
// Mock job categories - in real app, fetch from backend
const mockJobCategories = [
    { id: '1', jobCategoryName: 'Web Development' },
    { id: '2', jobCategoryName: 'Mobile Development' },
    { id: '3', jobCategoryName: 'UI/UX Design' },
    { id: '4', jobCategoryName: 'Data Science' },
    { id: '5', jobCategoryName: 'DevOps' },
    { id: '6', jobCategoryName: 'Machine Learning' },
    { id: '7', jobCategoryName: 'Blockchain' },
    { id: '8', jobCategoryName: 'Cybersecurity' },
    { id: '9', jobCategoryName: 'Content Writing' },
    { id: '10', jobCategoryName: 'Digital Marketing' },
];
const CompleteProfilePage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const { updateProfile, user } = useAuth();
    const navigate = useNavigate();
    const handleImageUpload = useCallback((options) => {
        const { file, onSuccess } = options;
        if (file instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target?.result);
                setUploadedFile(file);
                onSuccess?.('ok');
            };
            reader.readAsDataURL(file);
        }
    }, []);
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        return true;
    };
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            // Convert form data to update payload
            const updatePayload = {
                username: values.username,
                dob: values.dob,
                description: values.description,
                preference: values.preference.map(id => mockJobCategories.find(cat => cat.id === id)).filter(Boolean),
                isProfileCompleted: true,
            };
            // Add profile picture if uploaded
            if (uploadedFile) {
                updatePayload.profilePicture = new Blob([uploadedFile], { type: uploadedFile.type });
            }
            const success = await updateProfile(updatePayload);
            if (success) {
                message.success('Profile completed successfully!');
                navigate('/profile');
            }
            else {
                message.error('Failed to complete profile. Please try again.');
            }
        }
        catch (error) {
            console.error('Profile completion error:', error);
            message.error('An error occurred while completing your profile.');
        }
        finally {
            setLoading(false);
        }
    };
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8", children: _jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "max-w-4xl mx-auto px-4", children: [_jsxs(motion.div, { variants: itemVariants, className: "text-center mb-8", children: [_jsx(Title, { level: 1, className: "text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Complete Your Profile" }), _jsx(Paragraph, { className: "text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto", children: "Welcome to ERGASIA! Let's set up your profile to help you connect with the best opportunities." })] }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "shadow-xl border-0 rounded-2xl overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(CheckCircleOutlined, { className: "text-3xl" }), _jsxs("div", { children: [_jsx(Title, { level: 3, className: "text-white mb-0", children: "Profile Setup" }), _jsx(Text, { className: "text-blue-100", children: "Fill in your details to get started" })] })] }) }), _jsx("div", { className: "p-8", children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleSubmit, initialValues: {
                                        username: user?.username || '',
                                        description: user?.description || '',
                                        preference: user?.preference?.map(p => p.id) || [],
                                    }, className: "space-y-6", children: [_jsxs(Row, { gutter: [24, 24], children: [_jsx(Col, { xs: 24, md: 8, children: _jsxs(motion.div, { variants: itemVariants, className: "text-center", children: [_jsxs(Title, { level: 4, className: "flex items-center justify-center mb-4", children: [_jsx(CameraOutlined, { className: "mr-2" }), "Profile Picture"] }), _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx(Avatar, { size: 120, src: profileImage, icon: _jsx(UserOutlined, {}), className: "border-4 border-blue-200 shadow-lg" }), _jsx(Upload, { customRequest: handleImageUpload, beforeUpload: beforeUpload, showUploadList: false, accept: "image/*", children: _jsx(Button, { icon: _jsx(CameraOutlined, {}), type: "dashed", className: "rounded-lg", children: "Upload Photo" }) }), _jsx(Text, { type: "secondary", className: "text-sm", children: "JPG or PNG, max 2MB" })] })] }) }), _jsx(Col, { xs: 24, md: 16, children: _jsxs(Space, { direction: "vertical", size: "large", className: "w-full", children: [_jsx(motion.div, { variants: itemVariants, children: _jsx(Form.Item, { name: "username", label: _jsxs("span", { className: "flex items-center", children: [_jsx(UserOutlined, { className: "mr-2" }), "Username"] }), rules: [
                                                                        { required: true, message: 'Please enter your username' },
                                                                        { min: 3, message: 'Username must be at least 3 characters' },
                                                                        { max: 50, message: 'Username must be less than 50 characters' }
                                                                    ], children: _jsx(Input, { placeholder: "Enter your username", size: "large", className: "rounded-lg" }) }) }), _jsx(motion.div, { variants: itemVariants, children: _jsx(Form.Item, { name: "dob", label: _jsxs("span", { className: "flex items-center", children: [_jsx(CalendarOutlined, { className: "mr-2" }), "Date of Birth"] }), rules: [{ required: true, message: 'Please select your date of birth' }], children: _jsx(DatePicker, { placeholder: "Select your date of birth", size: "large", className: "w-full rounded-lg", disabledDate: (current) => current && current > dayjs().subtract(13, 'years') }) }) }), _jsx(motion.div, { variants: itemVariants, children: _jsx(Form.Item, { name: "preference", label: _jsxs("span", { className: "flex items-center", children: [_jsx(TagsOutlined, { className: "mr-2" }), "Skills & Preferences"] }), rules: [
                                                                        { required: true, message: 'Please select at least one skill' },
                                                                        { type: 'array', min: 1, message: 'Please select at least one skill' }
                                                                    ], children: _jsx(Select, { mode: "multiple", placeholder: "Select your skills and preferences", size: "large", className: "rounded-lg", maxTagCount: 3, maxTagTextLength: 15, children: mockJobCategories.map(category => (_jsx(Option, { value: category.id, children: category.jobCategoryName }, category.id))) }) }) }), _jsx(motion.div, { variants: itemVariants, children: _jsx(Form.Item, { name: "description", label: _jsxs("span", { className: "flex items-center", children: [_jsx(FileTextOutlined, { className: "mr-2" }), "About You"] }), rules: [
                                                                        { required: true, message: 'Please write a brief description about yourself' },
                                                                        { min: 50, message: 'Description must be at least 50 characters' },
                                                                        { max: 500, message: 'Description must be less than 500 characters' }
                                                                    ], children: _jsx(TextArea, { placeholder: "Tell us about yourself, your experience, and what you're looking for...", rows: 4, className: "rounded-lg", showCount: true, maxLength: 500 }) }) })] }) })] }), _jsx(Divider, {}), _jsxs(motion.div, { variants: itemVariants, className: "text-center", children: [_jsx(Button, { type: "primary", htmlType: "submit", loading: loading, size: "large", className: "px-12 py-2 h-auto rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg", children: _jsxs("span", { className: "flex items-center", children: [_jsx(CheckCircleOutlined, { className: "mr-2" }), "Complete Profile"] }) }), _jsx("div", { className: "mt-4", children: _jsx(Text, { type: "secondary", children: "By completing your profile, you agree to our Terms of Service and Privacy Policy" }) })] })] }) })] }) })] }) }));
};
export default CompleteProfilePage;
