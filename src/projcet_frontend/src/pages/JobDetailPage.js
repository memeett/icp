import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Typography, Button, Tag, Space, Row, Col, Avatar, Divider, Modal, Form, Input, Upload, message, Skeleton, Badge, Tooltip } from 'antd';
import { DollarOutlined, CalendarOutlined, UserOutlined, HeartOutlined, HeartFilled, ShareAltOutlined, FlagOutlined, SendOutlined, PaperClipOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useJobs } from '../shared/hooks/useJobs';
import { useAuth } from '../shared/hooks/useAuth';
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
// Mock job data for demonstration
const mockJob = {
    id: '1',
    title: 'Full Stack Developer for E-commerce Platform',
    description: `We are looking for an experienced Full Stack Developer to build a modern e-commerce platform from scratch. The project involves creating both frontend and backend components with a focus on performance, scalability, and user experience.

Key Requirements:
- 3+ years of experience with React and Node.js
- Experience with database design (PostgreSQL preferred)
- Knowledge of payment gateway integration
- Understanding of modern deployment practices
- Strong communication skills

The ideal candidate should be able to work independently and deliver high-quality code within the specified timeline.`,
    category: 'Web Development',
    budget: 5000,
    budgetType: 'fixed',
    deadline: '2024-02-15',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS'],
    experienceLevel: 'intermediate',
    projectType: 'one-time',
    status: 'active',
    postedAt: '2024-01-15T10:00:00Z',
    applicants: 12,
    client: {
        id: 'client1',
        name: 'TechCorp Solutions',
        avatar: '',
        rating: 4.8,
        reviewsCount: 24,
        jobsPosted: 15,
        memberSince: '2022-03-15'
    }
};
const JobDetailPage = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const { user } = useAuth();
    const { isLoading } = useJobs();
    const [job, setJob] = useState(mockJob);
    const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        // TODO: Fetch job details by jobId
        console.log('Fetching job details for:', jobId);
    }, [jobId]);
    const handleApply = async (values) => {
        setIsApplying(true);
        try {
            // TODO: Implement job application
            console.log('Applying to job:', { jobId, ...values });
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            message.success('Application submitted successfully!');
            setIsApplyModalVisible(false);
            form.resetFields();
        }
        catch (error) {
            message.error('Failed to submit application. Please try again.');
        }
        finally {
            setIsApplying(false);
        }
    };
    const handleSaveJob = () => {
        setIsSaved(!isSaved);
        message.success(isSaved ? 'Job removed from saved' : 'Job saved successfully');
    };
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        message.success('Job link copied to clipboard');
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const getTimeAgo = (dateString) => {
        const now = new Date();
        const posted = new Date(dateString);
        const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        }
        else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} days ago`;
        }
    };
    if (isLoading) {
        return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsx(Skeleton, { active: true }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs(Row, { gutter: [24, 24], children: [_jsx(Col, { xs: 24, lg: 16, children: _jsxs(Card, { className: "mb-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx(Title, { level: 2, className: "mb-2", children: job.title }), _jsxs(Space, { size: "middle", wrap: true, children: [_jsx(Tag, { color: "blue", children: job.category }), _jsx(Tag, { color: "green", children: job.projectType }), _jsxs(Text, { type: "secondary", children: [_jsx(ClockCircleOutlined, { className: "mr-1" }), "Posted ", getTimeAgo(job.postedAt)] })] })] }), _jsxs(Space, { children: [_jsx(Tooltip, { title: isSaved ? 'Remove from saved' : 'Save job', children: _jsx(Button, { icon: isSaved ? _jsx(HeartFilled, {}) : _jsx(HeartOutlined, {}), onClick: handleSaveJob, type: isSaved ? 'primary' : 'default' }) }), _jsx(Tooltip, { title: "Share job", children: _jsx(Button, { icon: _jsx(ShareAltOutlined, {}), onClick: handleShare }) }), _jsx(Tooltip, { title: "Report job", children: _jsx(Button, { icon: _jsx(FlagOutlined, {}) }) })] })] }), _jsxs(Row, { gutter: [16, 16], className: "mb-6", children: [_jsx(Col, { xs: 12, sm: 6, children: _jsxs("div", { className: "text-center p-4 bg-gray-50 rounded-lg", children: [_jsx(DollarOutlined, { className: "text-2xl text-green-500 mb-2" }), _jsxs("div", { className: "font-semibold", children: ["$", job.budget.toLocaleString()] }), _jsx(Text, { type: "secondary", className: "capitalize", children: job.budgetType })] }) }), _jsx(Col, { xs: 12, sm: 6, children: _jsxs("div", { className: "text-center p-4 bg-gray-50 rounded-lg", children: [_jsx(CalendarOutlined, { className: "text-2xl text-blue-500 mb-2" }), _jsx("div", { className: "font-semibold", children: "Deadline" }), _jsx(Text, { type: "secondary", children: formatDate(job.deadline) })] }) }), _jsx(Col, { xs: 12, sm: 6, children: _jsxs("div", { className: "text-center p-4 bg-gray-50 rounded-lg", children: [_jsx(UserOutlined, { className: "text-2xl text-purple-500 mb-2" }), _jsx("div", { className: "font-semibold", children: job.applicants }), _jsx(Text, { type: "secondary", children: "Applicants" })] }) }), _jsx(Col, { xs: 12, sm: 6, children: _jsxs("div", { className: "text-center p-4 bg-gray-50 rounded-lg", children: [_jsx(StarOutlined, { className: "text-2xl text-orange-500 mb-2" }), _jsx("div", { className: "font-semibold capitalize", children: job.experienceLevel }), _jsx(Text, { type: "secondary", children: "Level" })] }) })] }), _jsx(Divider, {}), _jsxs("div", { className: "mb-6", children: [_jsx(Title, { level: 4, children: "Job Description" }), _jsx(Paragraph, { className: "whitespace-pre-line", children: job.description })] }), _jsxs("div", { className: "mb-6", children: [_jsx(Title, { level: 4, children: "Required Skills" }), _jsx(Space, { wrap: true, children: job.skills.map(skill => (_jsx(Tag, { color: "processing", className: "mb-2", children: skill }, skill))) })] }), user && (_jsx("div", { className: "text-center", children: _jsx(Button, { type: "primary", size: "large", icon: _jsx(SendOutlined, {}), onClick: () => setIsApplyModalVisible(true), className: "px-8", children: "Apply for this Job" }) }))] }) }), _jsxs(Col, { xs: 24, lg: 8, children: [_jsxs(Card, { title: "About the Client", className: "mb-6", children: [_jsxs("div", { className: "text-center mb-4", children: [_jsx(Avatar, { size: 64, icon: _jsx(UserOutlined, {}), className: "mb-3" }), _jsx(Title, { level: 4, className: "mb-1", children: job.client.name }), _jsxs(Space, { children: [_jsx(Badge, { count: job.client.rating, color: "gold" }), _jsxs(Text, { type: "secondary", children: ["(", job.client.reviewsCount, " reviews)"] })] })] }), _jsx(Divider, {}), _jsxs(Row, { gutter: [16, 16], children: [_jsx(Col, { span: 12, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-semibold text-lg", children: job.client.jobsPosted }), _jsx(Text, { type: "secondary", children: "Jobs Posted" })] }) }), _jsx(Col, { span: 12, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-semibold text-lg", children: new Date(job.client.memberSince).getFullYear() }), _jsx(Text, { type: "secondary", children: "Member Since" })] }) })] }), _jsx("div", { className: "mt-4", children: _jsx(Button, { block: true, onClick: () => navigate(`/profile/${job.client.id}`), children: "View Profile" }) })] }), _jsx(Card, { title: "Similar Jobs", size: "small", children: _jsx("div", { className: "space-y-3", children: [1, 2, 3].map(i => (_jsxs("div", { className: "p-3 border rounded-lg hover:bg-gray-50 cursor-pointer", children: [_jsx(Text, { strong: true, className: "block mb-1", children: "React Developer Needed" }), _jsx(Text, { type: "secondary", className: "text-sm", children: "$2,500 \u2022 Fixed Price" })] }, i))) }) })] })] }) }) }), _jsx(Modal, { title: "Apply for this Job", open: isApplyModalVisible, onCancel: () => setIsApplyModalVisible(false), footer: null, width: 600, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleApply, children: [_jsx(Form.Item, { name: "coverLetter", label: "Cover Letter", rules: [{ required: true, message: 'Please write a cover letter' }], children: _jsx(TextArea, { rows: 6, placeholder: "Explain why you're the perfect fit for this job...", maxLength: 1000, showCount: true }) }), _jsx(Form.Item, { name: "proposedBudget", label: "Your Proposed Budget ($)", rules: [{ required: true, message: 'Please enter your proposed budget' }], children: _jsx(Input, { type: "number", placeholder: "Enter your budget", prefix: _jsx(DollarOutlined, {}) }) }), _jsx(Form.Item, { name: "timeline", label: "Estimated Timeline (days)", rules: [{ required: true, message: 'Please enter estimated timeline' }], children: _jsx(Input, { type: "number", placeholder: "How many days will you need?", suffix: "days" }) }), _jsx(Form.Item, { name: "attachments", label: "Attachments (Optional)", children: _jsx(Upload, { multiple: true, beforeUpload: () => false, listType: "text", children: _jsx(Button, { icon: _jsx(PaperClipOutlined, {}), children: "Attach Files" }) }) }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { onClick: () => setIsApplyModalVisible(false), children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", loading: isApplying, icon: _jsx(SendOutlined, {}), children: "Submit Application" })] })] }) })] }));
};
export default JobDetailPage;
