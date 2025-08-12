import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Card, Row, Col, Input, Select, Button, Avatar, Rate, Tag, Space, Typography, Slider, Empty, Spin, Pagination } from 'antd';
import { SearchOutlined, UserOutlined, EnvironmentOutlined, ClockCircleOutlined, MessageOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
import { useDebounce } from '../shared/hooks/useDebounce';
const { Title, Text } = Typography;
const { Option } = Select;
// Mock freelancer data
const mockFreelancers = [
    {
        id: '1',
        name: 'Sarah Johnson',
        title: 'Full Stack Developer',
        avatar: '',
        rating: 4.9,
        reviewsCount: 47,
        hourlyRate: 85,
        location: 'New York, USA',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        completedJobs: 32,
        responseTime: '1 hour',
        availability: 'Available',
        bio: 'Experienced full-stack developer specializing in modern web applications with React and Node.js.',
        languages: ['English', 'Spanish'],
        lastActive: '2 hours ago'
    },
    {
        id: '2',
        name: 'Michael Chen',
        title: 'UI/UX Designer',
        avatar: '',
        rating: 4.8,
        reviewsCount: 23,
        hourlyRate: 65,
        location: 'San Francisco, USA',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
        completedJobs: 18,
        responseTime: '30 minutes',
        availability: 'Available',
        bio: 'Creative UI/UX designer with a passion for creating intuitive and beautiful user experiences.',
        languages: ['English', 'Mandarin'],
        lastActive: '1 hour ago'
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        title: 'Mobile App Developer',
        avatar: '',
        rating: 4.7,
        reviewsCount: 31,
        hourlyRate: 75,
        location: 'Austin, USA',
        skills: ['React Native', 'Flutter', 'iOS', 'Android'],
        completedJobs: 25,
        responseTime: '2 hours',
        availability: 'Busy',
        bio: 'Mobile app developer with expertise in cross-platform development using React Native and Flutter.',
        languages: ['English', 'Spanish'],
        lastActive: '4 hours ago'
    }
];
const BrowseFreelancerPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [availability, setAvailability] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [currentPage, setCurrentPage] = useState(1);
    const [savedFreelancers, setSavedFreelancers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const categories = [
        'Web Development',
        'Mobile Development',
        'UI/UX Design',
        'Data Science',
        'Digital Marketing',
        'Content Writing',
        'Graphic Design',
        'Video Editing'
    ];
    const skills = [
        'React', 'Node.js', 'TypeScript', 'Python', 'Java', 'PHP',
        'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
        'React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin'
    ];
    const handleSearch = useCallback(() => {
        setIsLoading(true);
        // TODO: Implement actual search
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [debouncedSearchTerm, selectedCategory, priceRange, selectedSkills, availability, sortBy]);
    const handleSaveFreelancer = useCallback((freelancerId) => {
        setSavedFreelancers(prev => prev.includes(freelancerId)
            ? prev.filter(id => id !== freelancerId)
            : [...prev, freelancerId]);
    }, []);
    const handleContactFreelancer = useCallback((freelancerId) => {
        // TODO: Implement contact functionality
        console.log('Contacting freelancer:', freelancerId);
    }, []);
    const FreelancerCard = ({ freelancer }) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: _jsxs(Card, { hoverable: true, className: "h-full", actions: [
                _jsx(Button, { type: "text", icon: savedFreelancers.includes(freelancer.id) ? _jsx(HeartFilled, {}) : _jsx(HeartOutlined, {}), onClick: () => handleSaveFreelancer(freelancer.id), className: savedFreelancers.includes(freelancer.id) ? 'text-red-500' : '', children: "Save" }, "save"),
                _jsx(Button, { type: "text", icon: _jsx(MessageOutlined, {}), onClick: () => handleContactFreelancer(freelancer.id), children: "Contact" }, "contact"),
                _jsx(Button, { type: "text", onClick: () => navigate(`/profile/${freelancer.id}`), children: "View Profile" }, "view")
            ], children: [_jsxs("div", { className: "text-center mb-4", children: [_jsx(Avatar, { size: 64, src: freelancer.avatar, icon: _jsx(UserOutlined, {}) }), _jsxs("div", { className: "mt-2", children: [_jsx(Title, { level: 4, className: "mb-1", children: freelancer.name }), _jsx(Text, { type: "secondary", children: freelancer.title })] })] }), _jsx("div", { className: "mb-4", children: _jsxs(Space, { className: "w-full justify-center", children: [_jsx(Rate, { disabled: true, defaultValue: freelancer.rating, allowHalf: true }), _jsxs(Text, { children: ["(", freelancer.reviewsCount, ")"] })] }) }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx(Text, { type: "secondary", children: "Hourly Rate:" }), _jsxs(Text, { strong: true, children: ["$", freelancer.hourlyRate, "/hr"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Text, { type: "secondary", children: "Jobs Completed:" }), _jsx(Text, { children: freelancer.completedJobs })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Text, { type: "secondary", children: "Response Time:" }), _jsx(Text, { children: freelancer.responseTime })] })] }), _jsx("div", { className: "mb-4", children: _jsxs(Space, { children: [_jsx(EnvironmentOutlined, {}), _jsx(Text, { type: "secondary", children: freelancer.location })] }) }), _jsxs("div", { className: "mb-4", children: [_jsx(Text, { type: "secondary", className: "block mb-2", children: "Skills:" }), _jsxs(Space, { wrap: true, children: [freelancer.skills.slice(0, 4).map((skill) => (_jsx(Tag, { color: "blue", children: skill }, skill))), freelancer.skills.length > 4 && (_jsxs(Tag, { children: ["+", freelancer.skills.length - 4, " more"] }))] })] }), _jsx("div", { className: "mb-4", children: _jsx(Text, { type: "secondary", className: "text-sm", children: freelancer.bio }) }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(Space, { children: [_jsx("div", { className: `w-2 h-2 rounded-full ${freelancer.availability === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}` }), _jsx(Text, { type: "secondary", className: "text-sm", children: freelancer.availability })] }), _jsxs(Text, { type: "secondary", className: "text-sm", children: [_jsx(ClockCircleOutlined, { className: "mr-1" }), freelancer.lastActive] })] })] }) }));
    const FilterSidebar = () => (_jsx(Card, { title: "Filters", className: "mb-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx(Text, { strong: true, className: "block mb-2", children: "Category" }), _jsx(Select, { placeholder: "Select category", style: { width: '100%' }, value: selectedCategory, onChange: setSelectedCategory, allowClear: true, children: categories.map(category => (_jsx(Option, { value: category, children: category }, category))) })] }), _jsxs("div", { children: [_jsx(Text, { strong: true, className: "block mb-2", children: "Hourly Rate ($)" }), _jsx(Slider, { range: true, min: 0, max: 200, value: priceRange, onChange: (value) => setPriceRange(value), marks: {
                                0: '$0',
                                50: '$50',
                                100: '$100',
                                150: '$150',
                                200: '$200+'
                            } }), _jsx("div", { className: "text-center mt-2", children: _jsxs(Text, { type: "secondary", children: ["$", priceRange[0], " - $", priceRange[1], "/hr"] }) })] }), _jsxs("div", { children: [_jsx(Text, { strong: true, className: "block mb-2", children: "Skills" }), _jsx(Select, { mode: "multiple", placeholder: "Select skills", style: { width: '100%' }, value: selectedSkills, onChange: setSelectedSkills, maxTagCount: 3, children: skills.map(skill => (_jsx(Option, { value: skill, children: skill }, skill))) })] }), _jsxs("div", { children: [_jsx(Text, { strong: true, className: "block mb-2", children: "Availability" }), _jsxs(Select, { placeholder: "Select availability", style: { width: '100%' }, value: availability, onChange: setAvailability, allowClear: true, children: [_jsx(Option, { value: "Available", children: "Available" }), _jsx(Option, { value: "Busy", children: "Busy" })] })] }), _jsx(Button, { type: "primary", block: true, icon: _jsx(SearchOutlined, {}), onClick: handleSearch, loading: isLoading, children: "Apply Filters" })] }) }));
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(Title, { level: 2, children: "Browse Freelancers" }), _jsx(Text, { type: "secondary", children: "Find the perfect freelancer for your project" })] }), _jsx(Card, { className: "mb-6", children: _jsxs(Row, { gutter: [16, 16], align: "middle", children: [_jsx(Col, { xs: 24, sm: 12, md: 8, children: _jsx(Input, { size: "large", placeholder: "Search freelancers...", prefix: _jsx(SearchOutlined, {}), value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }) }), _jsx(Col, { xs: 24, sm: 12, md: 6, children: _jsxs(Select, { size: "large", placeholder: "Sort by", style: { width: '100%' }, value: sortBy, onChange: setSortBy, children: [_jsx(Option, { value: "rating", children: "Highest Rated" }), _jsx(Option, { value: "price-low", children: "Price: Low to High" }), _jsx(Option, { value: "price-high", children: "Price: High to Low" }), _jsx(Option, { value: "recent", children: "Most Recent" })] }) }), _jsx(Col, { xs: 24, sm: 24, md: 10, children: _jsx("div", { className: "flex justify-end", children: _jsxs(Text, { type: "secondary", children: ["Showing ", mockFreelancers.length, " freelancers"] }) }) })] }) }), _jsxs(Row, { gutter: [24, 24], children: [_jsx(Col, { xs: 24, lg: 6, children: _jsx(FilterSidebar, {}) }), _jsx(Col, { xs: 24, lg: 18, children: isLoading ? (_jsx("div", { className: "text-center py-12", children: _jsx(Spin, { size: "large" }) })) : mockFreelancers.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(Row, { gutter: [16, 16], children: mockFreelancers.map(freelancer => (_jsx(Col, { xs: 24, sm: 12, lg: 8, children: _jsx(FreelancerCard, { freelancer: freelancer }) }, freelancer.id))) }), _jsx("div", { className: "text-center mt-8", children: _jsx(Pagination, { current: currentPage, total: 50, pageSize: 9, onChange: setCurrentPage, showSizeChanger: false }) })] })) : (_jsx(Card, { children: _jsx(Empty, { description: "No freelancers found", image: Empty.PRESENTED_IMAGE_SIMPLE }) })) })] })] }) })] }));
};
export default BrowseFreelancerPage;
