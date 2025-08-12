import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { X, Plus, Search, Check, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { viewAllJobCategories } from "../../controller/jobController";
export const CategoriesStep = ({ selectedCategories, setSelectedCategories, customCategory, setCustomCategory, error, }) => {
    const [fetchedCategories, setFetchedCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSelectedCategories, setTempSelectedCategories] = useState(selectedCategories);
    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await viewAllJobCategories();
                if (categories) {
                    setFetchedCategories(categories.map((cat) => cat.jobCategoryName)); // Assuming JobCategory has a `name` property
                }
                else {
                    setFetchError("Failed to fetch categories.");
                }
            }
            catch (error) {
                console.error("Error fetching categories:", error);
                setFetchError("An error occurred while fetching categories.");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);
    // Filter categories based on search term
    const filteredCategories = fetchedCategories.filter((category) => category.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleCategorySelection = (category) => {
        // Remove saveCategories() from here
        if (tempSelectedCategories.includes(category)) {
            setTempSelectedCategories(tempSelectedCategories.filter((cat) => cat !== category));
        }
        else if (tempSelectedCategories.length < 3) {
            setTempSelectedCategories([...tempSelectedCategories, category]);
        }
    };
    // Save button handler remains separate
    const saveCategories = () => {
        setSelectedCategories(tempSelectedCategories);
        setIsCategoryModalOpen(false);
    };
    // Save selected categories and close the modal
    // Remove a category from the selected list
    const removeCategory = (category) => {
        setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    };
    // Handle custom category submission
    const handleCustomCategory = (e) => {
        e.preventDefault();
        if (customCategory.trim() && !selectedCategories.includes(customCategory)) {
            setSelectedCategories([...selectedCategories, customCategory.trim()]);
            setCustomCategory("");
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6 relative" // Add `relative` here
        , children: [_jsx("h2", { className: "text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent", children: "Categories" }), _jsxs("div", { className: "space-y-4", children: [isLoading ? (_jsx("p", { children: "Loading categories..." })) : fetchError ? (_jsx("p", { className: "text-red-500", children: fetchError })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-wrap gap-2", children: [fetchedCategories.slice(0, 5).map((category) => (_jsx("button", { onClick: () => {
                                            if (!selectedCategories.includes(category)) {
                                                setSelectedCategories([...selectedCategories, category]);
                                            }
                                        }, className: "px-4 py-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all", children: category }, category))), _jsx("button", { onClick: () => setIsCategoryModalOpen(true), className: "px-4 py-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all", children: "+ More" })] }), _jsxs("form", { onSubmit: handleCustomCategory, className: "flex gap-2", children: [_jsx("input", { type: "text", value: customCategory, onChange: (e) => setCustomCategory(e.target.value), className: "flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-transparent focus:ring-4 focus:ring-blue-300/30 bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md", placeholder: "Add custom category" }), _jsx("button", { type: "submit", className: "px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all", children: _jsx(Plus, { size: 24 }) })] })] })), selectedCategories.length > 0 && (_jsxs("div", { className: "mt-4 p-4 rounded-xl bg-gray-50 border-2 border-gray-100", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Selected Categories:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedCategories.map((category) => (_jsxs("span", { className: "px-4 py-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center gap-2", children: [category, _jsx("button", { onClick: () => removeCategory(category), className: "hover:text-purple-200", children: _jsx(X, { size: 16 }) })] }, category))) })] }))] }), isCategoryModalOpen && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "bg-white p-6 rounded-2xl shadow-xl w-full max-w-md", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h3", { className: "text-lg font-bold text-purple-800", children: ["Select Categories", _jsx("span", { className: "ml-2 text-sm font-normal text-purple-500", children: "(Max 3)" })] }), _jsx("button", { onClick: () => setIsCategoryModalOpen(false), className: "text-gray-500 hover:text-gray-800", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-3 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search categories...", className: "w-full pl-10 pr-4 py-2 border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200" })] }), tempSelectedCategories.length > 0 && (_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm text-purple-600 mb-2", children: "Selected:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: tempSelectedCategories.map((category) => (_jsxs("div", { className: "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1", children: [category, _jsx(X, { className: "w-4 h-4 cursor-pointer hover:text-purple-900", onClick: () => setTempSelectedCategories(tempSelectedCategories.filter((cat) => cat !== category)) })] }, category))) })] })), _jsx("div", { className: "max-h-64 overflow-y-auto pr-2 space-y-2", children: filteredCategories.length > 0 ? (filteredCategories.map((category) => (_jsxs(motion.div, { whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, onClick: () => handleCategorySelection(category), className: `cursor-pointer p-3 rounded-lg flex items-center justify-between ${tempSelectedCategories.includes(category)
                                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"}`, children: [_jsx("span", { className: "font-medium", children: category }), tempSelectedCategories.includes(category) && (_jsx(Check, { className: "w-5 h-5" }))] }, category)))) : (_jsx("p", { className: "text-center py-4 text-gray-500", children: searchTerm
                                    ? "No matching categories found"
                                    : "Loading categories..." })) }), tempSelectedCategories.length === 3 && (_jsxs("p", { className: "mt-3 text-sm text-yellow-600 flex items-center justify-center", children: [_jsx("span", { className: "mr-1", children: _jsx(AlertTriangle, {}) }), " ", "Maximum selection reached (3)"] })), _jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [_jsx("button", { onClick: () => setIsCategoryModalOpen(false), className: "px-4 py-2 text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50", children: "Cancel" }), _jsx("button", { onClick: saveCategories, className: "px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700", children: "Save" })] })] }) })), error && _jsx("p", { className: "text-red-500 mt-2", children: error })] }));
};
