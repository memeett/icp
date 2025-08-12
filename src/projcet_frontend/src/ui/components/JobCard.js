import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Tag, Button, Avatar, Space, Tooltip, Typography, Divider, Progress } from 'antd';
import { DollarOutlined, ClockCircleOutlined, UserOutlined, HeartOutlined, HeartFilled, EyeOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { useNotifications } from '../../shared/hooks/useNotifications';
const { Text, Title } = Typography;
const JobCard = memo(({ job, className = '', variant = 'default', showActions = true, onSave, onUnsave, isSaved = false }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { success } = useNotifications();
    const [isHovered, setIsHovered] = useState(false);
    const [localSaved, setLocalSaved] = useState(isSaved);
    const handleViewDetails = useCallback(() => {
        navigate(`/jobs/${job.id}`);
    }, [navigate, job.id]);
    const handleSaveToggle = useCallback((e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/face-recognition/login');
            return;
        }
        const newSavedState = !localSaved;
        setLocalSaved(newSavedState);
        if (newSavedState) {
            onSave?.(job.id);
            success('Success', 'Job saved to your favorites!');
        }
        else {
            onUnsave?.(job.id);
            success('Success', 'Job removed from favorites');
        }
    }, [isAuthenticated, localSaved, onSave, onUnsave, job.id, navigate, success]);
    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'green';
            case 'In Progress': return 'blue';
            case 'Completed': return 'purple';
            case 'Cancelled': return 'red';
            default: return 'default';
        }
    };
    const getExperienceColor = (level) => {
        switch (level) {
            case 'Beginner': return 'green';
            case 'Intermediate': return 'orange';
            case 'Expert': return 'red';
            default: return 'default';
        }
    };
    const calculateProgress = () => {
        // Mock progress calculation based on job slots
        const totalSlots = Number(job.jobSlots);
        const filledSlots = Math.floor(totalSlots * 0.3); // 30% filled for demo
        return totalSlots > 0 ? (filledSlots / totalSlots) * 100 : 0;
    };
    const cardVariants = {
        default: "min-h-[280px]",
        compact: "min-h-[200px]",
        featured: "min-h-[320px] border-2 border-primary/20"
    };
    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, whileHover: {
            y: -8,
            transition: { duration: 0.2, ease: 'easeOut' }
        }, onHoverStart: () => setIsHovered(true), onHoverEnd: () => setIsHovered(false), className: className, children: _jsxs(Card, { hoverable: true, className: `${cardVariants[variant]} relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl`, onClick: handleViewDetails, cover: variant === 'featured' && (_jsx("div", { className: "h-2 bg-gradient-to-r from-primary to-purple-600" })), actions: showActions ? [
                _jsx(Tooltip, { title: localSaved ? 'Remove from favorites' : 'Save job', children: _jsx(Button, { type: "text", icon: localSaved ? _jsx(HeartFilled, { className: "text-red-500" }) : _jsx(HeartOutlined, {}), onClick: handleSaveToggle, className: "hover:scale-110 transition-transform" }) }, "save"),
                _jsx(Tooltip, { title: "View details", children: _jsx(Button, { type: "text", icon: _jsx(EyeOutlined, {}), onClick: handleViewDetails, className: "hover:scale-110 transition-transform" }) }, "view"),
                _jsx(Tooltip, { title: "Quick apply", children: _jsx(Button, { type: "primary", size: "small", onClick: (e) => {
                            e.stopPropagation();
                            navigate(`/jobs/${job.id}/apply`);
                        }, className: "hover:scale-105 transition-transform", children: "Apply" }) }, "apply")
            ] : undefined, children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx(Title, { level: 4, className: "mb-1 line-clamp-2", children: job.jobName }), _jsxs(Space, { wrap: true, children: [_jsx(Tag, { color: getStatusColor(job.jobStatus), children: job.jobStatus }), job.experienceLevel && (_jsx(Tag, { color: getExperienceColor(job.experienceLevel), children: job.experienceLevel })), job.jobType && (_jsx(Tag, { children: job.jobType }))] })] }), _jsx(AnimatePresence, { children: isHovered && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "flex items-center space-x-1 text-yellow-500", children: [_jsx(StarOutlined, {}), _jsx(Text, { className: "text-sm", children: "4.8" })] })) })] }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Space, { children: [_jsx(DollarOutlined, { className: "text-green-500" }), _jsxs(Text, { strong: true, className: "text-lg", children: ["$", job.jobSalary] }), _jsx(Text, { type: "secondary", children: "fixed price" })] }), _jsxs(Space, { children: [_jsx(UserOutlined, { className: "text-blue-500" }), _jsxs(Text, { children: [Number(job.jobSlots), " slots"] })] })] }), job.deadline && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(CalendarOutlined, { className: "text-orange-500" }), _jsxs(Text, { type: "secondary", children: ["Due: ", new Date(job.deadline).toLocaleDateString()] })] })), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx(Text, { type: "secondary", className: "text-xs", children: "Applications" }), _jsxs(Text, { type: "secondary", className: "text-xs", children: [Math.floor(calculateProgress()), "% filled"] })] }), _jsx(Progress, { percent: calculateProgress(), size: "small", showInfo: false, strokeColor: {
                                        '0%': '#108ee9',
                                        '100%': '#87d068',
                                    } })] })] }), _jsx(Divider, { className: "my-3" }), _jsx("div", { className: "mb-4", children: _jsxs(Text, { type: "secondary", className: "text-sm line-clamp-3", children: [job.jobDescription.slice(0, 2).join(' • '), job.jobDescription.length > 2 && '...'] }) }), _jsxs("div", { className: "flex flex-wrap gap-1 mb-3", children: [job.jobTags.slice(0, 3).map((tag, index) => (_jsx(Tag, { className: "text-xs", children: tag.jobCategoryName }, index))), job.jobTags.length > 3 && (_jsxs(Tag, { className: "text-xs", children: ["+", job.jobTags.length - 3, " more"] }))] }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(ClockCircleOutlined, {}), _jsxs("span", { children: ["Posted ", new Date(Number(job.createdAt)).toLocaleDateString()] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Avatar, { size: "small", icon: _jsx(UserOutlined, {}) }), _jsx("span", { children: "Client" })] })] }), _jsx(AnimatePresence, { children: isHovered && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" })) })] }) }));
});
JobCard.displayName = 'JobCard';
export default JobCard;
