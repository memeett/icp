import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Table, Button, Tag, Space, Typography, Tabs, Statistic, Row, Col, Modal, Form, Input, Select, message, Popconfirm, Badge, Avatar, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, ProjectOutlined, CheckCircleOutlined, PauseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
// Mock job data
const mockJobs = [
    {
        id: '1',
        title: 'Full Stack Developer for E-commerce Platform',
        status: 'active',
        budget: 5000,
        budgetType: 'fixed',
        applicants: 12,
        postedAt: '2024-01-15',
        deadline: '2024-02-15',
        category: 'Web Development',
        applications: [
            {
                id: 'app1',
                freelancer: {
                    name: 'John Doe',
                    avatar: '',
                    rating: 4.8,
                    proposedBudget: 4500,
                    timeline: '30 days',
                    coverLetter: 'I am excited to work on this project...'
                },
                appliedAt: '2024-01-16'
            },
            {
                id: 'app2',
                freelancer: {
                    name: 'Jane Smith',
                    avatar: '',
                    rating: 4.9,
                    proposedBudget: 5200,
                    timeline: '25 days',
                    coverLetter: 'With 5+ years of experience...'
                },
                appliedAt: '2024-01-17'
            }
        ]
    },
    {
        id: '2',
        title: 'Mobile App UI/UX Design',
        status: 'draft',
        budget: 2500,
        budgetType: 'fixed',
        applicants: 0,
        postedAt: '2024-01-20',
        deadline: '2024-02-20',
        category: 'UI/UX Design',
        applications: []
    },
    {
        id: '3',
        title: 'React Native Developer',
        status: 'closed',
        budget: 75,
        budgetType: 'hourly',
        applicants: 8,
        postedAt: '2024-01-10',
        deadline: '2024-01-30',
        category: 'Mobile Development',
        applications: []
    }
];
const ManageJobPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState(mockJobs);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isApplicationsModalVisible, setIsApplicationsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [form] = Form.useForm();
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'green';
            case 'draft': return 'orange';
            case 'closed': return 'red';
            case 'paused': return 'blue';
            default: return 'default';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return _jsx(CheckCircleOutlined, {});
            case 'draft': return _jsx(EditOutlined, {});
            case 'closed': return _jsx(StopOutlined, {});
            case 'paused': return _jsx(PauseCircleOutlined, {});
            default: return null;
        }
    };
    const handleEditJob = (job) => {
        setSelectedJob(job);
        form.setFieldsValue(job);
        setIsEditModalVisible(true);
    };
    const handleDeleteJob = async (jobId) => {
        try {
            setJobs(jobs.filter(job => job.id !== jobId));
            message.success('Job deleted successfully');
        }
        catch (error) {
            message.error('Failed to delete job');
        }
    };
    const handleUpdateJobStatus = async (jobId, newStatus) => {
        try {
            setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
            message.success(`Job ${newStatus} successfully`);
        }
        catch (error) {
            message.error('Failed to update job status');
        }
    };
    const handleViewApplications = (job) => {
        setSelectedJob(job);
        setIsApplicationsModalVisible(true);
    };
    const handleSaveJob = async (values) => {
        try {
            setJobs(jobs.map(job => job.id === selectedJob.id ? { ...job, ...values } : job));
            setIsEditModalVisible(false);
            message.success('Job updated successfully');
        }
        catch (error) {
            message.error('Failed to update job');
        }
    };
    const columns = [
        {
            title: 'Job Title',
            dataIndex: 'title',
            key: 'title',
            render: (title, record) => (_jsxs("div", { children: [_jsx(Text, { strong: true, className: "block", children: title }), _jsx(Text, { type: "secondary", className: "text-sm", children: record.category })] })),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (_jsx(Tag, { color: getStatusColor(status), icon: getStatusIcon(status), children: status.toUpperCase() })),
        },
        {
            title: 'Budget',
            dataIndex: 'budget',
            key: 'budget',
            render: (budget, record) => (_jsxs("div", { children: [_jsxs(Text, { strong: true, children: ["$", budget.toLocaleString()] }), _jsx(Text, { type: "secondary", className: "block text-sm capitalize", children: record.budgetType })] })),
        },
        {
            title: 'Applicants',
            dataIndex: 'applicants',
            key: 'applicants',
            render: (applicants, record) => (_jsx(Button, { type: "link", onClick: () => handleViewApplications(record), disabled: applicants === 0, children: _jsx(Badge, { count: applicants, showZero: true, children: _jsx(UserOutlined, {}) }) })),
        },
        {
            title: 'Posted',
            dataIndex: 'postedAt',
            key: 'postedAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (_jsxs(Space, { children: [_jsx(Tooltip, { title: "View Job", children: _jsx(Button, { icon: _jsx(EyeOutlined, {}), onClick: () => navigate(`/jobs/${record.id}`) }) }), _jsx(Tooltip, { title: "Edit Job", children: _jsx(Button, { icon: _jsx(EditOutlined, {}), onClick: () => handleEditJob(record) }) }), record.status === 'active' && (_jsx(Tooltip, { title: "Pause Job", children: _jsx(Button, { icon: _jsx(PauseCircleOutlined, {}), onClick: () => handleUpdateJobStatus(record.id, 'paused') }) })), record.status === 'paused' && (_jsx(Tooltip, { title: "Activate Job", children: _jsx(Button, { icon: _jsx(CheckCircleOutlined, {}), onClick: () => handleUpdateJobStatus(record.id, 'active') }) })), _jsx(Popconfirm, { title: "Are you sure you want to delete this job?", onConfirm: () => handleDeleteJob(record.id), okText: "Yes", cancelText: "No", children: _jsx(Tooltip, { title: "Delete Job", children: _jsx(Button, { icon: _jsx(DeleteOutlined, {}), danger: true }) }) })] })),
        },
    ];
    const applicationColumns = [
        {
            title: 'Freelancer',
            key: 'freelancer',
            render: (_, record) => (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Avatar, { src: record.freelancer.avatar, icon: _jsx(UserOutlined, {}) }), _jsxs("div", { children: [_jsx(Text, { strong: true, children: record.freelancer.name }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Text, { type: "secondary", className: "text-sm", children: "Rating: " }), _jsx(Text, { className: "text-sm", children: record.freelancer.rating })] })] })] })),
        },
        {
            title: 'Proposed Budget',
            key: 'budget',
            render: (_, record) => (_jsxs(Text, { strong: true, children: ["$", record.freelancer.proposedBudget.toLocaleString()] })),
        },
        {
            title: 'Timeline',
            key: 'timeline',
            render: (_, record) => record.freelancer.timeline,
        },
        {
            title: 'Applied',
            dataIndex: 'appliedAt',
            key: 'appliedAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (_jsxs(Space, { children: [_jsx(Button, { type: "primary", size: "small", children: "Accept" }), _jsx(Button, { size: "small", children: "Message" }), _jsx(Button, { size: "small", danger: true, children: "Decline" })] })),
        },
    ];
    const filteredJobs = jobs.filter(job => {
        if (activeTab === 'all')
            return true;
        return job.status === activeTab;
    });
    const stats = {
        total: jobs.length,
        active: jobs.filter(job => job.status === 'active').length,
        draft: jobs.filter(job => job.status === 'draft').length,
        closed: jobs.filter(job => job.status === 'closed').length,
        totalApplicants: jobs.reduce((sum, job) => sum + job.applicants, 0)
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx(Title, { level: 2, children: "Manage Jobs" }), _jsx(Text, { type: "secondary", children: "Track and manage your job postings" })] }), _jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), size: "large", onClick: () => navigate('/post'), children: "Post New Job" })] }), _jsxs(Row, { gutter: [16, 16], className: "mb-6", children: [_jsx(Col, { xs: 12, sm: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "Total Jobs", value: stats.total, prefix: _jsx(ProjectOutlined, {}) }) }) }), _jsx(Col, { xs: 12, sm: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "Active Jobs", value: stats.active, prefix: _jsx(CheckCircleOutlined, {}), valueStyle: { color: '#52c41a' } }) }) }), _jsx(Col, { xs: 12, sm: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "Draft Jobs", value: stats.draft, prefix: _jsx(EditOutlined, {}), valueStyle: { color: '#faad14' } }) }) }), _jsx(Col, { xs: 12, sm: 6, children: _jsx(Card, { children: _jsx(Statistic, { title: "Total Applicants", value: stats.totalApplicants, prefix: _jsx(UserOutlined, {}), valueStyle: { color: '#1890ff' } }) }) })] }), _jsxs(Card, { children: [_jsxs(Tabs, { activeKey: activeTab, onChange: setActiveTab, children: [_jsx(TabPane, { tab: `All Jobs (${stats.total})` }, "all"), _jsx(TabPane, { tab: `Active (${stats.active})` }, "active"), _jsx(TabPane, { tab: `Draft (${stats.draft})` }, "draft"), _jsx(TabPane, { tab: `Closed (${stats.closed})` }, "closed")] }), _jsx(Table, { columns: columns, dataSource: filteredJobs, rowKey: "id", pagination: {
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                    } })] })] }) }), _jsx(Modal, { title: "Edit Job", open: isEditModalVisible, onCancel: () => setIsEditModalVisible(false), footer: null, width: 600, children: _jsxs(Form, { form: form, layout: "vertical", onFinish: handleSaveJob, children: [_jsx(Form.Item, { name: "title", label: "Job Title", rules: [{ required: true, message: 'Please enter job title' }], children: _jsx(Input, {}) }), _jsx(Form.Item, { name: "status", label: "Status", rules: [{ required: true, message: 'Please select status' }], children: _jsxs(Select, { children: [_jsx(Option, { value: "active", children: "Active" }), _jsx(Option, { value: "draft", children: "Draft" }), _jsx(Option, { value: "paused", children: "Paused" }), _jsx(Option, { value: "closed", children: "Closed" })] }) }), _jsxs(Row, { gutter: [16, 16], children: [_jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "budget", label: "Budget", rules: [{ required: true, message: 'Please enter budget' }], children: _jsx(Input, { type: "number", prefix: "$" }) }) }), _jsx(Col, { span: 12, children: _jsx(Form.Item, { name: "budgetType", label: "Budget Type", rules: [{ required: true, message: 'Please select budget type' }], children: _jsxs(Select, { children: [_jsx(Option, { value: "fixed", children: "Fixed Price" }), _jsx(Option, { value: "hourly", children: "Hourly Rate" })] }) }) })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { onClick: () => setIsEditModalVisible(false), children: "Cancel" }), _jsx(Button, { type: "primary", htmlType: "submit", children: "Save Changes" })] })] }) }), _jsx(Modal, { title: `Applications for "${selectedJob?.title}"`, open: isApplicationsModalVisible, onCancel: () => setIsApplicationsModalVisible(false), footer: null, width: 800, children: selectedJob?.applications?.length > 0 ? (_jsx(Table, { columns: applicationColumns, dataSource: selectedJob.applications, rowKey: "id", pagination: false })) : (_jsx("div", { className: "text-center py-8", children: _jsx(Text, { type: "secondary", children: "No applications yet" }) })) })] }));
};
export default ManageJobPage;
