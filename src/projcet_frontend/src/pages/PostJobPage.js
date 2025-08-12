import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Form, Input, Button, Card, Steps, Select, InputNumber, DatePicker, Upload, Tag, Space, Typography, Row, Col, Divider, message } from 'antd';
import { PlusOutlined, InboxOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useJobs } from '../shared/hooks/useJobs';
const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { Dragger } = Upload;
const PostJobPage = () => {
    const navigate = useNavigate();
    const { isLoading } = useJobs();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const steps = [
        {
            title: 'Basic Info',
            description: 'Job title and category'
        },
        {
            title: 'Details',
            description: 'Description and requirements'
        },
        {
            title: 'Budget & Timeline',
            description: 'Budget and deadline'
        },
        {
            title: 'Review',
            description: 'Review and publish'
        }
    ];
    const categories = [
        'Web Development',
        'Mobile Development',
        'UI/UX Design',
        'Data Science',
        'Digital Marketing',
        'Content Writing',
        'Graphic Design',
        'Video Editing',
        'Translation',
        'Virtual Assistant'
    ];
    const handleNext = useCallback(async () => {
        try {
            const values = await form.validateFields();
            setFormData(prev => ({ ...prev, ...values }));
            setCurrentStep(prev => prev + 1);
        }
        catch (error) {
            console.error('Validation failed:', error);
        }
    }, [form]);
    const handlePrev = useCallback(() => {
        setCurrentStep(prev => prev - 1);
    }, []);
    const handleAddSkill = useCallback(() => {
        if (skillInput && !skills.includes(skillInput)) {
            const newSkills = [...skills, skillInput];
            setSkills(newSkills);
            form.setFieldValue('skills', newSkills);
            setSkillInput('');
        }
    }, [skillInput, skills, form]);
    const handleRemoveSkill = useCallback((skillToRemove) => {
        const newSkills = skills.filter(skill => skill !== skillToRemove);
        setSkills(newSkills);
        form.setFieldValue('skills', newSkills);
    }, [skills, form]);
    const handleSubmit = useCallback(async (isDraft = false) => {
        try {
            const values = await form.validateFields();
            const jobData = {
                ...formData,
                ...values,
                skills,
                status: isDraft ? 'draft' : 'active',
                postedAt: new Date().toISOString(),
                applicants: 0
            };
            // TODO: Implement createJob functionality
            console.log('Creating job:', jobData);
            message.success(`Job ${isDraft ? 'saved as draft' : 'published'} successfully!`);
            navigate('/manage');
        }
        catch (error) {
            console.error('Failed to create job:', error);
            message.error('Failed to create job. Please try again.');
        }
    }, [form, formData, skills, navigate]);
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, children: [_jsx(Form.Item, { name: "title", label: "Job Title", rules: [{ required: true, message: 'Please enter job title' }], children: _jsx(Input, { size: "large", placeholder: "e.g., Full Stack Developer for E-commerce Platform", maxLength: 100, showCount: true }) }), _jsx(Form.Item, { name: "category", label: "Category", rules: [{ required: true, message: 'Please select a category' }], children: _jsx(Select, { size: "large", placeholder: "Select job category", children: categories.map(category => (_jsx(Option, { value: category, children: category }, category))) }) }), _jsx(Form.Item, { name: "projectType", label: "Project Type", rules: [{ required: true, message: 'Please select project type' }], children: _jsxs(Select, { size: "large", placeholder: "Select project type", children: [_jsx(Option, { value: "one-time", children: "One-time Project" }), _jsx(Option, { value: "ongoing", children: "Ongoing Work" })] }) })] }));
            case 1:
                return (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, children: [_jsx(Form.Item, { name: "description", label: "Job Description", rules: [{ required: true, message: 'Please enter job description' }], children: _jsx(TextArea, { rows: 6, placeholder: "Describe your project in detail...", maxLength: 2000, showCount: true }) }), _jsx(Form.Item, { name: "experienceLevel", label: "Experience Level", rules: [{ required: true, message: 'Please select experience level' }], children: _jsxs(Select, { size: "large", placeholder: "Select required experience level", children: [_jsx(Option, { value: "entry", children: "Entry Level" }), _jsx(Option, { value: "intermediate", children: "Intermediate" }), _jsx(Option, { value: "expert", children: "Expert" })] }) }), _jsxs(Form.Item, { label: "Required Skills", children: [_jsxs(Space.Compact, { style: { width: '100%' }, children: [_jsx(Input, { value: skillInput, onChange: (e) => setSkillInput(e.target.value), placeholder: "Add a skill", onPressEnter: handleAddSkill }), _jsx(Button, { type: "primary", onClick: handleAddSkill, icon: _jsx(PlusOutlined, {}), children: "Add" })] }), _jsx("div", { className: "mt-2", children: skills.map(skill => (_jsx(Tag, { closable: true, onClose: () => handleRemoveSkill(skill), className: "mb-1", children: skill }, skill))) })] }), _jsx(Form.Item, { label: "Attachments (Optional)", children: _jsxs(Dragger, { multiple: true, beforeUpload: () => false, className: "upload-area", children: [_jsx("p", { className: "ant-upload-drag-icon", children: _jsx(InboxOutlined, {}) }), _jsx("p", { className: "ant-upload-text", children: "Click or drag files to upload" }), _jsx("p", { className: "ant-upload-hint", children: "Support for documents, images, and other relevant files" })] }) })] }));
            case 2:
                return (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, children: [_jsx(Form.Item, { name: "budgetType", label: "Budget Type", rules: [{ required: true, message: 'Please select budget type' }], children: _jsxs(Select, { size: "large", placeholder: "Select budget type", children: [_jsx(Option, { value: "fixed", children: "Fixed Price" }), _jsx(Option, { value: "hourly", children: "Hourly Rate" })] }) }), _jsx(Form.Item, { name: "budget", label: "Budget Amount ($)", rules: [{ required: true, message: 'Please enter budget amount' }], children: _jsx(InputNumber, { size: "large", min: 1, max: 100000, style: { width: '100%' }, placeholder: "Enter budget amount", formatter: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','), parser: value => Number(value.replace(/\$\s?|(,*)/g, '')) }) }), _jsx(Form.Item, { name: "deadline", label: "Project Deadline", rules: [{ required: true, message: 'Please select deadline' }], children: _jsx(DatePicker, { size: "large", style: { width: '100%' }, placeholder: "Select deadline", disabledDate: (current) => current && current.valueOf() < Date.now() }) })] }));
            case 3:
                return (_jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.3 }, children: _jsxs(Card, { className: "mb-4", children: [_jsx(Title, { level: 4, children: "Job Preview" }), _jsx(Divider, {}), _jsxs(Row, { gutter: [16, 16], children: [_jsxs(Col, { span: 24, children: [_jsx(Title, { level: 5, children: formData.title }), _jsxs(Text, { type: "secondary", children: [formData.category, " \u2022 ", formData.projectType] })] }), _jsxs(Col, { span: 24, children: [_jsx(Text, { strong: true, children: "Description:" }), _jsx("div", { className: "mt-2", children: _jsx(Text, { children: formData.description }) })] }), _jsxs(Col, { span: 12, children: [_jsx(Text, { strong: true, children: "Budget:" }), _jsx("div", { children: _jsxs(Text, { children: ["$", formData.budget, " (", formData.budgetType, ")"] }) })] }), _jsxs(Col, { span: 12, children: [_jsx(Text, { strong: true, children: "Experience Level:" }), _jsx("div", { children: _jsx(Text, { className: "capitalize", children: formData.experienceLevel }) })] }), _jsxs(Col, { span: 24, children: [_jsx(Text, { strong: true, children: "Required Skills:" }), _jsx("div", { className: "mt-2", children: skills.map(skill => (_jsx(Tag, { color: "blue", children: skill }, skill))) })] })] })] }) }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(Title, { level: 2, children: "Post a New Job" }), _jsx(Text, { type: "secondary", children: "Create a detailed job posting to attract the best freelancers" })] }), _jsx(Card, { className: "mb-6", children: _jsx(Steps, { current: currentStep, items: steps }) }), _jsx(Card, { children: _jsxs(Form, { form: form, layout: "vertical", initialValues: formData, onValuesChange: (_, allValues) => setFormData(prev => ({ ...prev, ...allValues })), children: [renderStepContent(), _jsx(Divider, {}), _jsxs("div", { className: "flex justify-between", children: [_jsx(Button, { onClick: handlePrev, disabled: currentStep === 0, size: "large", children: "Previous" }), _jsxs(Space, { children: [currentStep === steps.length - 1 && (_jsx(Button, { onClick: () => handleSubmit(true), loading: isLoading, size: "large", icon: _jsx(SaveOutlined, {}), children: "Save as Draft" })), currentStep < steps.length - 1 ? (_jsx(Button, { type: "primary", onClick: handleNext, size: "large", children: "Next" })) : (_jsx(Button, { type: "primary", onClick: () => handleSubmit(false), loading: isLoading, size: "large", icon: _jsx(SendOutlined, {}), children: "Publish Job" }))] })] })] }) })] }) }) })] }));
};
export default PostJobPage;
