import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Card, Button, Space, Tag, Pagination, Empty, Spin, Drawer, Checkbox, Slider, Select, Typography } from 'antd';
import { FilterOutlined, AppstoreOutlined, UnorderedListOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Navbar, SearchBar, JobCard } from '../ui/components';
import { useJobs } from '../shared/hooks/useJobs';
import { useDebouncedSearch } from '../shared/hooks/useDebounce';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';
const { Title, Text } = Typography;
const { Option } = Select;
// Price range options
const PRICE_RANGES = [
    { label: "Under $100", value: "0-100", min: 0, max: 100 },
    { label: "$100 - $500", value: "100-500", min: 100, max: 500 },
    { label: "$500 - $1000", value: "500-1000", min: 500, max: 1000 },
    { label: "$1000 - $2000", value: "1000-2000", min: 1000, max: 2000 },
    { label: "$2000+", value: "2000+", min: 2000, max: Infinity },
];
const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Highest Pay', value: 'salary_high' },
    { label: 'Lowest Pay', value: 'salary_low' },
    { label: 'Deadline Soon', value: 'deadline' },
];
const FindJobPage = memo(() => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useLocalStorage('job-view-mode', 'grid');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [salaryRange, setSalaryRange] = useState([0, 5000]);
    const [sortBy, setSortBy] = useState('newest');
    const { jobs, jobCategories, filteredJobs, paginatedJobs, currentPage, setCurrentPage, setSearchQuery, updateFilters, isLoading } = useJobs();
    const { searchValue, debouncedSearchValue, setSearchValue } = useDebouncedSearch('', 300);
    // Update search query when debounced value changes
    useEffect(() => {
        setSearchQuery(debouncedSearchValue);
    }, [debouncedSearchValue, setSearchQuery]);
    // Update filters when local state changes
    useEffect(() => {
        updateFilters({
            categories: selectedCategories,
            priceRanges: selectedPriceRanges,
            sortBy
        });
    }, [selectedCategories, selectedPriceRanges, sortBy, updateFilters]);
    // Memoized filter handlers
    const handleCategoryChange = useCallback((checkedValues) => {
        setSelectedCategories(checkedValues);
    }, []);
    const handlePriceRangeChange = useCallback((checkedValues) => {
        setSelectedPriceRanges(checkedValues);
    }, []);
    const handleSalaryRangeChange = useCallback((value) => {
        if (Array.isArray(value) && value.length === 2) {
            setSalaryRange([value[0], value[1]]);
        }
    }, []);
    const handleSortChange = useCallback((value) => {
        setSortBy(value);
    }, []);
    const toggleFilters = useCallback(() => {
        setFiltersVisible(prev => !prev);
    }, []);
    const clearFilters = useCallback(() => {
        setSelectedCategories([]);
        setSelectedPriceRanges([]);
        setSalaryRange([0, 5000]);
        setSortBy('newest');
    }, []);
    // Memoized filter content
    const filterContent = useMemo(() => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx(Title, { level: 5, className: "mb-3", children: "Job Categories" }), _jsx(Checkbox.Group, { value: selectedCategories, onChange: handleCategoryChange, className: "flex flex-col space-y-2", children: jobCategories.map(category => (_jsx(Checkbox, { value: category.jobCategoryName, children: category.jobCategoryName }, category.id))) })] }), _jsxs("div", { children: [_jsx(Title, { level: 5, className: "mb-3", children: "Budget Range" }), _jsx(Checkbox.Group, { value: selectedPriceRanges, onChange: handlePriceRangeChange, className: "flex flex-col space-y-2", children: PRICE_RANGES.map(range => (_jsx(Checkbox, { value: range.value, children: range.label }, range.value))) })] }), _jsxs("div", { children: [_jsxs(Title, { level: 5, className: "mb-3", children: ["Salary Range: $", salaryRange[0], " - $", salaryRange[1]] }), _jsx(Slider, { range: true, min: 0, max: 5000, step: 100, value: salaryRange, onChange: handleSalaryRangeChange, tooltip: { formatter: (value) => `$${value}` } })] }), _jsx(Button, { block: true, onClick: clearFilters, children: "Clear All Filters" })] })), [
        jobCategories,
        selectedCategories,
        selectedPriceRanges,
        salaryRange,
        handleCategoryChange,
        handlePriceRangeChange,
        handleSalaryRangeChange,
        clearFilters
    ]);
    // Memoized job grid
    const jobGrid = useMemo(() => {
        if (isLoading) {
            return (_jsx("div", { className: "flex justify-center items-center py-20", children: _jsx(Spin, { size: "large", tip: "Loading jobs..." }) }));
        }
        if (paginatedJobs.length === 0) {
            return (_jsx(Empty, { description: "No jobs found matching your criteria", image: Empty.PRESENTED_IMAGE_SIMPLE, className: "py-20", children: _jsx(Button, { type: "primary", onClick: clearFilters, children: "Clear Filters" }) }));
        }
        return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: _jsx(Row, { gutter: [16, 16], children: paginatedJobs.map((job, index) => (_jsx(Col, { xs: 24, sm: viewMode === 'grid' ? 12 : 24, lg: viewMode === 'grid' ? 8 : 24, xl: viewMode === 'grid' ? 6 : 24, children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1, duration: 0.3 }, children: _jsx(JobCard, { job: job, variant: viewMode === 'list' ? 'compact' : 'default' }) }) }, job.id))) }) }, `${viewMode}-${currentPage}`) }));
    }, [isLoading, paginatedJobs, viewMode, currentPage, clearFilters]);
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Navbar, {}), _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "mb-8", children: [_jsx(Title, { level: 2, className: "mb-4", children: "Find Your Perfect Job" }), _jsx(SearchBar, { placeholder: "Search jobs, skills, companies...", onSearch: setSearchValue, onFilterClick: toggleFilters, className: "mb-6" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "flex flex-wrap items-center justify-between mb-6 gap-4", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Text, { type: "secondary", children: [filteredJobs.length, " jobs found"] }), (selectedCategories.length > 0 || selectedPriceRanges.length > 0) && (_jsxs("div", { className: "flex flex-wrap gap-2", children: [selectedCategories.map(category => (_jsx(Tag, { closable: true, onClose: () => handleCategoryChange(selectedCategories.filter(c => c !== category)), children: category }, category))), selectedPriceRanges.map(range => (_jsx(Tag, { closable: true, onClose: () => handlePriceRangeChange(selectedPriceRanges.filter(r => r !== range)), children: PRICE_RANGES.find(p => p.value === range)?.label }, range)))] }))] }), _jsxs(Space, { children: [_jsx(Select, { value: sortBy, onChange: handleSortChange, style: { width: 150 }, suffixIcon: _jsx(SortAscendingOutlined, {}), children: SORT_OPTIONS.map(option => (_jsx(Option, { value: option.value, children: option.label }, option.value))) }), _jsxs(Button.Group, { children: [_jsx(Button, { type: viewMode === 'grid' ? 'primary' : 'default', icon: _jsx(AppstoreOutlined, {}), onClick: () => setViewMode('grid') }), _jsx(Button, { type: viewMode === 'list' ? 'primary' : 'default', icon: _jsx(UnorderedListOutlined, {}), onClick: () => setViewMode('list') })] }), _jsx(Button, { icon: _jsx(FilterOutlined, {}), onClick: toggleFilters, className: "md:hidden", children: "Filters" })] })] }), _jsxs(Row, { gutter: 24, children: [_jsx(Col, { xs: 0, md: 6, children: _jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, children: _jsx(Card, { title: "Filters", className: "sticky", children: filterContent }) }) }), _jsx(Col, { xs: 24, md: 18, children: _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.3 }, children: [jobGrid, paginatedJobs.length > 0 && (_jsx("div", { className: "flex justify-center mt-8", children: _jsx(Pagination, { current: currentPage, total: filteredJobs.length, pageSize: 12, onChange: setCurrentPage, showSizeChanger: false, showQuickJumper: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} jobs` }) }))] }) })] }), _jsx(Drawer, { title: "Filters", placement: "right", onClose: () => setFiltersVisible(false), open: filtersVisible, width: 300, className: "md:hidden", children: filterContent })] })] }));
});
FindJobPage.displayName = 'FindJobPage';
export default FindJobPage;
