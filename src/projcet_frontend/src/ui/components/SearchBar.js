import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button, Dropdown, Tag, Divider, Typography, Empty } from 'antd';
import { SearchOutlined, FilterOutlined, CloseOutlined, HistoryOutlined, RiseOutlined } from '@ant-design/icons';
import { useDebouncedSearch } from '../../shared/hooks/useDebounce';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
const { Text } = Typography;
const SearchBar = memo(({ placeholder = "Search jobs, skills, or companies...", onSearch, onFilterClick, showFilters = true, className = '', size = 'large', suggestions = [], recentSearches: propRecentSearches }) => {
    const [focused, setFocused] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useLocalStorage('recent-searches', []);
    const inputRef = useRef(null);
    const { searchValue, debouncedSearchValue, setSearchValue, isSearching } = useDebouncedSearch('', 300);
    // Use prop recent searches if provided, otherwise use local storage
    const displayRecentSearches = propRecentSearches || recentSearches;
    // Mock trending searches
    const trendingSearches = [
        'React Developer',
        'UI/UX Designer',
        'Full Stack',
        'Mobile App',
        'Data Science'
    ];
    useEffect(() => {
        if (debouncedSearchValue && onSearch) {
            onSearch(debouncedSearchValue);
        }
    }, [debouncedSearchValue, onSearch]);
    const handleSearch = useCallback((value) => {
        if (value.trim()) {
            // Add to recent searches
            const newRecentSearches = [
                value,
                ...recentSearches.filter(search => search !== value)
            ].slice(0, 5);
            setRecentSearches(newRecentSearches);
            onSearch?.(value);
            setDropdownVisible(false);
            inputRef.current?.blur();
        }
    }, [recentSearches, setRecentSearches, onSearch]);
    const handleRecentSearchClick = useCallback((search) => {
        setSearchValue(search);
        handleSearch(search);
    }, [setSearchValue, handleSearch]);
    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
    }, [setRecentSearches]);
    const removeRecentSearch = useCallback((searchToRemove) => {
        setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
    }, [setRecentSearches]);
    const handleFocus = useCallback(() => {
        setFocused(true);
        setDropdownVisible(true);
    }, []);
    const handleBlur = useCallback(() => {
        setFocused(false);
        // Delay hiding dropdown to allow clicks
        setTimeout(() => setDropdownVisible(false), 200);
    }, []);
    const dropdownContent = (_jsxs("div", { className: "w-full max-w-md p-4 bg-white rounded-lg shadow-lg border", children: [displayRecentSearches.length > 0 && (_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(HistoryOutlined, { className: "text-gray-400" }), _jsx(Text, { type: "secondary", className: "text-sm font-medium", children: "Recent Searches" })] }), _jsx(Button, { type: "text", size: "small", onClick: clearRecentSearches, className: "text-xs", children: "Clear" })] }), _jsx("div", { className: "space-y-1", children: displayRecentSearches.map((search, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, className: "flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group", onClick: () => handleRecentSearchClick(search), children: [_jsx(Text, { className: "text-sm", children: search }), _jsx(Button, { type: "text", size: "small", icon: _jsx(CloseOutlined, {}), className: "opacity-0 group-hover:opacity-100 transition-opacity", onClick: (e) => {
                                        e.stopPropagation();
                                        removeRecentSearch(search);
                                    } })] }, search))) })] })), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(RiseOutlined, { className: "text-orange-500" }), _jsx(Text, { type: "secondary", className: "text-sm font-medium", children: "Trending" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: trendingSearches.map((trend, index) => (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.1 }, children: _jsx(Tag, { className: "cursor-pointer hover:bg-primary hover:text-white transition-colors", onClick: () => handleRecentSearchClick(trend), children: trend }) }, trend))) })] }), suggestions.length > 0 && (_jsxs(_Fragment, { children: [_jsx(Divider, { className: "my-3" }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", className: "text-sm font-medium mb-2 block", children: "Suggestions" }), _jsx("div", { className: "space-y-1", children: suggestions.map((suggestion, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "p-2 hover:bg-gray-50 rounded cursor-pointer", onClick: () => handleRecentSearchClick(suggestion), children: _jsx(Text, { className: "text-sm", children: suggestion }) }, suggestion))) })] })] })), displayRecentSearches.length === 0 && suggestions.length === 0 && (_jsx(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE, description: "Start typing to search", className: "my-4" }))] }));
    return (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: `relative ${className}`, children: [_jsx(Dropdown, { open: dropdownVisible && focused, dropdownRender: () => dropdownContent, trigger: [], placement: "bottomLeft", overlayClassName: "search-dropdown", children: _jsxs("div", { className: "relative", children: [_jsx(Input.Search, { ref: inputRef, size: size, placeholder: placeholder, value: searchValue, onChange: (e) => setSearchValue(e.target.value), onSearch: handleSearch, onFocus: handleFocus, onBlur: handleBlur, loading: isSearching, enterButton: _jsx(Button, { type: "primary", icon: _jsx(SearchOutlined, {}), className: "h-full", children: "Search" }), className: `
              transition-all duration-300
              ${focused ? 'shadow-lg ring-2 ring-primary/20' : 'shadow-sm'}
            `, style: {
                                borderRadius: '12px',
                            } }), showFilters && (_jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "absolute right-2 top-1/2 -translate-y-1/2 z-10", style: { right: size === 'large' ? '100px' : '80px' }, children: _jsx(Button, { type: "text", icon: _jsx(FilterOutlined, {}), onClick: onFilterClick, className: "hover:bg-gray-100 rounded-lg" }) }))] }) }), _jsx(AnimatePresence, { children: isSearching && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "absolute -bottom-8 left-0 flex items-center space-x-2 text-sm text-gray-500", children: [_jsx("div", { className: "w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" }), _jsx("span", { children: "Searching..." })] })) })] }));
});
SearchBar.displayName = 'SearchBar';
export default SearchBar;
