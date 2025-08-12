import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FiX } from "react-icons/fi";
import FreelancerCard from "../../components/cards/FreelancerCard";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../controller/userController";
import LoadingOverlay from "../../components/ui/loading-animation";
import { motion } from "framer-motion";
import { useJobCategories } from "../../utils/useJobCategories";
import { Filter, Search } from "lucide-react";
export default function BrowseFreelancerPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [listUser, setListUser] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { data: jobCategories } = useJobCategories();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getAllUsers();
                if (users)
                    setListUser(users);
                setDataLoading(false);
            }
            catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to load freelancers");
            }
        };
        setDataLoading(true);
        fetchUsers();
    }, []);
    const handleCategoryToggle = (category) => {
        setSelectedCategories((prev) => prev.includes(category)
            ? prev.filter((c) => c !== category)
            : [category] // Cap at 1 category
        );
    };
    const filteredUsers = listUser.filter((user) => {
        const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.preference?.some((cat) => cat.jobCategoryName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategories.length === 0 ||
            user.preference?.some((cat) => selectedCategories.includes(cat.jobCategoryName));
        return matchesSearch && matchesCategory;
    });
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white", children: [dataLoading && _jsx(LoadingOverlay, { message: "Loading data..." }), _jsx(Navbar, {}), _jsxs("div", { className: "container mx-auto px-4 mt-6", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search freelancers or categories", className: "w-full pl-12 pr-10 py-3 rounded-xl \n                                    bg-white/70 backdrop-blur-sm \n                                    border border-purple-100/50 \n                                    focus:ring-2 focus:ring-purple-300 \n                                    transition duration-300 \n                                    text-gray-700 placeholder-gray-400" }), _jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 \n                                    text-purple-400" }), searchQuery && (_jsx(FiX, { className: "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer hover:text-gray-600", onClick: () => setSearchQuery("") }))] }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "bg-purple-100 text-purple-600 p-3 rounded-xl \n                                hover:bg-purple-200 transition", onClick: () => setShowFilters(!showFilters), children: _jsx(Filter, {}) })] }), showFilters && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-700 mb-4", children: "Filter by Job Categories" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: jobCategories?.map((category) => (_jsx(motion.div, { whileHover: { scale: 1.05 }, className: `p-3 rounded-lg cursor-pointer transition 
                    ${selectedCategories.includes(category.jobCategoryName)
                                        ? "bg-purple-200 text-purple-800"
                                        : "bg-gray-100 text-gray-700 hover:bg-purple-100"}`, onClick: () => handleCategoryToggle(category.jobCategoryName), children: category.jobCategoryName }, category.id))) })] }))] }), _jsx("div", { className: "text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 text-center py-6", children: "Find Our Top Featured Freelancers here" }), _jsx("div", { className: "mx-auto px-16 flex-1 min-h-screen", children: error ? (_jsx("p", { className: "text-center text-red-500 text-xl", children: error })) : filteredUsers.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10", children: filteredUsers.map((user) => (_jsx(FreelancerCard, { user: user }, user.id))) })) : (_jsx("p", { className: "text-center text-gray-500 text-xl py-12", children: "No freelancers match your search criteria" })) }), _jsx(Footer, {})] }));
}
