import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Typography, Button, Avatar, Row, Col, Tabs, Form, Input, Select, Upload, Tag, Space, List, Modal, Skeleton, DatePicker, } from 'antd';
import { UserOutlined, EditOutlined, CameraOutlined, StarOutlined, ProjectOutlined, DollarOutlined, CalendarOutlined, MailOutlined, GlobalOutlined, InfoCircleOutlined, } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Navbar from '../ui/components/Navbar';
import { useAuth } from '../shared/hooks/useAuth';
import { getProfilePictureUrl } from '../controller/userController';
import dayjs from 'dayjs';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
// Mock job categories - in a real app, this would be fetched from the backend
const mockJobCategories = [
    { id: '1', jobCategoryName: 'Web Development' },
    { id: '2', jobCategoryName: 'Mobile Development' },
    { id: '3', jobCategoryName: 'UI/UX Design' },
    { id: '4', jobCategoryName: 'Data Science' },
    { id: '5', jobCategoryName: 'DevOps' },
];
const ProfilePage = () => {
    const { user, isLoading, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [profileImage, setProfileImage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user,
                dob: user.dob ? dayjs(user.dob) : null,
                preference: user.preference?.map(p => p.id) || [],
            });
            if (user.profilePicture) {
                setProfileImage(getProfilePictureUrl(user.id, user.profilePicture));
            }
        }
    }, [user, form]);
    const handleSave = async (values) => {
        if (!user)
            return;
        const payload = {
            username: values.username,
            description: values.description,
        };
        if (values.dob) {
            payload.dob = values.dob.format('YYYY-MM-DD');
        }
        if (values.preference) {
            payload.preference = values.preference.map((id) => mockJobCategories.find(cat => cat.id === id)).filter(Boolean);
        }
        if (uploadedFile) {
            console.log("1");
            payload.profilePicture = new Blob([uploadedFile], { type: uploadedFile.type });
        }
        else {
            console.log("2");
            payload.profilePicture = user.profilePicture;
        }
        payload.isProfileCompleted = user.isProfileCompleted;
        const success = await updateProfile(payload);
        if (success) {
            setIsEditing(false);
            setUploadedFile(null); // Reset uploaded file state
        }
    };
    const handleAvatarUpload = ({ file }) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target?.result);
            };
            reader.readAsDataURL(file);
            setUploadedFile(file);
        }
    };
    if (isLoading) {
        return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx(Skeleton, { active: true, avatar: true, paragraph: { rows: 4 } }), _jsx(Skeleton, { active: true, paragraph: { rows: 8 } })] })] }));
    }
    if (!user) {
        return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8 text-center", children: _jsx(Title, { level: 2, children: "Please log in to view your profile." }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx(Card, { className: "mb-6", children: _jsxs(Row, { gutter: [24, 24], align: "middle", children: [_jsx(Col, { xs: 24, sm: 6, className: "text-center", children: _jsx(Avatar, { size: 120, src: profileImage, icon: _jsx(UserOutlined, {}) }) }), _jsxs(Col, { xs: 24, sm: 12, children: [_jsx(Title, { level: 2, className: "mb-2", children: user.username || 'N/A' }), _jsxs(Space, { direction: "vertical", size: "small", children: [_jsxs(Space, { children: [_jsx(MailOutlined, {}), _jsx(Text, { children: user.id })] }), _jsxs(Space, { children: [_jsx(CalendarOutlined, {}), _jsxs(Text, { children: ["Member since ", dayjs(Number(user.createdAt)).format('MMMM YYYY')] })] })] })] }), _jsx(Col, { xs: 24, sm: 6, className: "text-center", children: _jsx(Button, { type: "primary", icon: _jsx(EditOutlined, {}), onClick: () => setIsEditing(true), block: true, children: "Edit Profile" }) })] }) }), _jsxs(Row, { gutter: [16, 16], className: "mb-6", children: [_jsx(Col, { xs: 12, sm: 8, children: _jsxs(Card, { className: "text-center", children: [_jsx(DollarOutlined, { className: "text-2xl text-green-500 mb-2" }), _jsxs("div", { className: "text-xl font-bold", children: ["$", user.wallet.toLocaleString()] }), _jsx(Text, { type: "secondary", children: "Wallet Balance" })] }) }), _jsx(Col, { xs: 12, sm: 8, children: _jsxs(Card, { className: "text-center", children: [_jsx(StarOutlined, { className: "text-2xl text-yellow-500 mb-2" }), _jsx("div", { className: "text-xl font-bold", children: user.rating.toFixed(1) }), _jsx(Text, { type: "secondary", children: "Average Rating" })] }) }), _jsx(Col, { xs: 12, sm: 8, children: _jsxs(Card, { className: "text-center", children: [_jsx(ProjectOutlined, { className: "text-2xl text-blue-500 mb-2" }), _jsx("div", { className: "text-xl font-bold", children: "0" }), _jsx(Text, { type: "secondary", children: "Jobs Completed" })] }) })] }), _jsx(Card, { children: _jsx(Tabs, { defaultActiveKey: "overview", children: _jsx(TabPane, { tab: "Overview", children: _jsxs(Row, { gutter: [24, 24], children: [_jsxs(Col, { xs: 24, lg: 16, children: [_jsx(Card, { title: "About Me", className: "mb-6", children: _jsx(Paragraph, { children: user.description || 'No description provided.' }) }), _jsx(Card, { title: "Skills", children: _jsx(Space, { wrap: true, children: user.preference?.length > 0 ? (user.preference.map(skill => (_jsx(Tag, { color: "blue", children: skill.jobCategoryName }, skill.id)))) : (_jsx(Text, { type: "secondary", children: "No skills listed." })) }) })] }), _jsx(Col, { xs: 24, lg: 8, children: _jsx(Card, { title: "Details", children: _jsxs(List, { children: [_jsx(List.Item, { children: _jsx(List.Item.Meta, { avatar: _jsx(InfoCircleOutlined, {}), title: "Date of Birth", description: user.dob ? dayjs(user.dob).format('MMMM D, YYYY') : 'Not specified' }) }), _jsx(List.Item, { children: _jsx(List.Item.Meta, { avatar: _jsx(GlobalOutlined, {}), title: "Face Recognition", description: user.isFaceRecognitionOn ? 'Enabled' : 'Disabled' }) })] }) }) })] }) }, "overview") }) })] }) }), _jsx(Modal, { title: "Edit Profile", open: isEditing, onCancel: () => setIsEditing(false), footer: null, width: 800, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleSave, children: [_jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 24, className: "text-center mb-4", children: _jsxs(Upload, { customRequest: handleAvatarUpload, showUploadList: false, accept: "image/*", children: [_jsx(Avatar, { size: 120, src: profileImage, icon: _jsx(UserOutlined, {}), className: "cursor-pointer" }), _jsx(Button, { icon: _jsx(CameraOutlined, {}), className: "mt-2", children: "Change Photo" })] }) }), _jsx(Col, { xs: 24, sm: 12, children: _jsx(Form.Item, { name: "username", label: "Username", rules: [{ required: true }], children: _jsx(Input, {}) }) }), _jsx(Col, { xs: 24, sm: 12, children: _jsx(Form.Item, { name: "dob", label: "Date of Birth", rules: [{ required: true }], children: _jsx(DatePicker, { className: "w-full" }) }) }), _jsx(Col, { span: 24, children: _jsx(Form.Item, { name: "description", label: "Description", rules: [{ required: true }], children: _jsx(TextArea, { rows: 4 }) }) }), _jsx(Col, { span: 24, children: _jsx(Form.Item, { name: "preference", label: "Skills", rules: [{ required: true }], children: _jsx(Select, { mode: "multiple", placeholder: "Select your skills", children: mockJobCategories.map(cat => (_jsx(Option, { value: cat.id, children: cat.jobCategoryName }, cat.id))) }) }) })] }), _jsxs("div", { className: "flex justify-end space-x-2 mt-4", children: [_jsx(Button, { onClick: () => setIsEditing(false), children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", children: "Save Changes" })] })] }) })] }));
};
export default ProfilePage;
