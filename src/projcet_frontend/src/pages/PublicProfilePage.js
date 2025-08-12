import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Rate, Tag, Space, Row, Col, Button, Tabs, Skeleton, message, Result, List, } from 'antd';
import { UserOutlined, StarOutlined, ProjectOutlined, MessageOutlined, ShareAltOutlined, CalendarOutlined, } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { getUserById, getProfilePictureUrl } from '../controller/userController';
import dayjs from 'dayjs';
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const PublicProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                setIsLoading(true);
                try {
                    const fetchedUser = await getUserById(id);
                    setUser(fetchedUser);
                }
                catch (error) {
                    console.error("Failed to fetch user:", error);
                    message.error("Failed to load user profile.");
                }
                finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUser();
    }, [id]);
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        message.success('Profile link copied to clipboard');
    };
    if (isLoading) {
        return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx(Skeleton, { active: true, avatar: true, paragraph: { rows: 4 } }), _jsx(Skeleton, { active: true, paragraph: { rows: 8 } })] })] }));
    }
    if (!user) {
        return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsx(Result, { status: "404", title: "User Not Found", subTitle: "Sorry, the user you are looking for does not exist." }) })] }));
    }
    const profilePictureUrl = user.profilePicture
        ? getProfilePictureUrl(user.id, user.profilePicture)
        : undefined;
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx(Card, { className: "mb-6", children: _jsxs(Row, { gutter: [24, 24], align: "middle", children: [_jsx(Col, { xs: 24, sm: 6, className: "text-center", children: _jsx(Avatar, { size: 120, src: profilePictureUrl, icon: _jsx(UserOutlined, {}) }) }), _jsxs(Col, { xs: 24, sm: 12, children: [_jsx(Title, { level: 2, className: "mb-2", children: user.username || 'Anonymous User' }), _jsxs(Space, { direction: "vertical", size: "small", children: [_jsxs(Space, { children: [_jsx(CalendarOutlined, {}), _jsxs(Text, { children: ["Member since ", dayjs(Number(user.createdAt)).format('MMMM YYYY')] })] }), _jsxs(Space, { children: [_jsx(Rate, { disabled: true, value: user.rating, allowHalf: true }), _jsxs(Text, { children: ["(", user.rating.toFixed(1), ")"] })] })] })] }), _jsx(Col, { xs: 24, sm: 6, className: "text-center", children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(Button, { type: "primary", icon: _jsx(MessageOutlined, {}), block: true, children: "Contact" }), _jsx(Button, { icon: _jsx(ShareAltOutlined, {}), onClick: handleShare, block: true, children: "Share" })] }) })] }) }), _jsx(Card, { children: _jsx(Tabs, { defaultActiveKey: "overview", children: _jsx(TabPane, { tab: "Overview", children: _jsxs(Row, { gutter: [24, 24], children: [_jsxs(Col, { xs: 24, lg: 16, children: [_jsxs("div", { className: "mb-6", children: [_jsx(Title, { level: 4, children: "About" }), _jsx(Paragraph, { children: user.description || 'No description available.' })] }), _jsxs("div", { children: [_jsx(Title, { level: 4, children: "Skills" }), _jsx(Space, { wrap: true, children: user.preference?.length > 0 ? (user.preference.map(skill => (_jsx(Tag, { color: "blue", children: skill.jobCategoryName }, skill.id)))) : (_jsx(Text, { type: "secondary", children: "No skills listed." })) })] })] }), _jsx(Col, { xs: 24, lg: 8, children: _jsx(Card, { title: "Details", children: _jsxs(List, { children: [_jsx(List.Item, { children: _jsx(List.Item.Meta, { avatar: _jsx(StarOutlined, {}), title: "Rating", description: `${user.rating.toFixed(1)} / 5.0` }) }), _jsx(List.Item, { children: _jsx(List.Item.Meta, { avatar: _jsx(ProjectOutlined, {}), title: "Jobs Completed", description: "0" }) })] }) }) })] }) }, "overview") }) })] }) })] }));
};
export default PublicProfilePage;
