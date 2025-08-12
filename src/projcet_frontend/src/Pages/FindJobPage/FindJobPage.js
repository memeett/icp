import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Briefcase, ChevronLeft, ChevronRight, Filter, Search, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import JobCard from "../../components/cards/JobCard";
import Footer from "../../components/Footer";
import { viewAllJobCategories, viewAllJobs, } from "../../controller/jobController";
import { getUserClickedByUserId } from "../../controller/userClickedController";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingOverlay from "../../components/ui/loading-animation";
const PRICE_RANGES = [
    { label: "< $50", value: "0-50" },
    { label: "$50 - $100", value: "50-100" },
    { label: "$100 - $200", value: "100-200" },
    { label: "$200 - $500", value: "200-500" },
    { label: "> $2000", value: "2000+" },
];
export default function FindJobPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [jobTags, setJobTags] = useState([]);
    const [listJobs, setListJobs] = useState([]);
    const [listUserClickeds, setListUserClickeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [recommendationJobs, setRecommendationJobs] = useState([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [selectedCategories, setSelectedCategories] = useState(searchParams.getAll("categories") || []);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [recommendationStartIndex, setRecommendationStartIndex] = useState(0);
    // Show 3 cards per recommendation page
    const cardsPerPage = 3;
    const nextRecommendationSlide = () => {
        if (recommendationStartIndex + cardsPerPage < recommendationJobs.length) {
            setRecommendationStartIndex(recommendationStartIndex + cardsPerPage);
        }
    };
    const prevRecommendationSlide = () => {
        if (recommendationStartIndex > 0) {
            setRecommendationStartIndex(recommendationStartIndex - cardsPerPage);
        }
    };
    const handleCategoryToggle = (categoryName) => {
        setSelectedCategories((prev) => prev.includes(categoryName)
            ? prev.filter((cat) => cat !== categoryName)
            : [...prev, categoryName]);
    };
    const handlePriceRangeToggle = (range) => {
        setSelectedPriceRanges((prev) => prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]);
    };
    const fetchData = async () => {
        try {
            const [jobs, categories] = await Promise.all([
                viewAllJobs(),
                viewAllJobCategories(),
            ]);
            const filteredJobs = jobs
                ? jobs.filter((job) => job.jobStatus !== "Finished")
                : [];
            if (filteredJobs.length > 0)
                setListJobs(filteredJobs);
            if (categories)
                setJobTags(categories);
            // await getRecommendationJoblList(filteredJobs); // dijalankan setelah filteredJobs siap
        }
        catch (err) {
            console.error("Error fetching data:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if (jobTags.length > 0) {
            getRecommendationJoblList(listJobs);
        }
    }, [jobTags]);
    const filteredJobs = listJobs.filter((job) => {
        const matchesSearch = searchQuery === "" ||
            job.jobName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategories = selectedCategories.length === 0 ||
            job.jobTags.some((tag) => selectedCategories.includes(tag.jobCategoryName));
        const matchesPriceRanges = selectedPriceRanges.length === 0 ||
            selectedPriceRanges.some((range) => {
                const [min, max] = range === "2000+" ? [2000, Infinity] : range.split("-").map(Number);
                return job.jobSalary >= min && job.jobSalary < max;
            });
        return matchesSearch && matchesCategories && matchesPriceRanges;
    });
    const convertBigIntToString = (data) => {
        if (typeof data === "bigint") {
            return data.toString();
        }
        if (Array.isArray(data)) {
            return data.map(convertBigIntToString);
        }
        if (typeof data === "object" && data !== null) {
            return Object.fromEntries(Object.entries(data).map(([key, value]) => [
                key,
                convertBigIntToString(value),
            ]));
        }
        return data;
    };
    const getRecommendationJoblList = async (jobs) => {
        const userClickeds = await getUserClickedByUserId();
        if (userClickeds)
            setListUserClickeds(userClickeds);
        if (userClickeds.length === 0) {
            const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
            setRecommendationJobs(randomJobs);
            return;
        }
        const data = {
            jobTags: convertBigIntToString(jobTags),
            listJobs: convertBigIntToString(jobs),
            listUserClickeds: convertBigIntToString(userClickeds),
        };
        if (data.jobTags.length === 0 || data.listJobs.length === 0 || data.listUserClickeds.length === 0) {
            const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
            setRecommendationJobs(randomJobs);
            setLoading(false);
            return;
        }
        try {
            const response = await fetch("http://localhost:5001/getRecommendation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
                setRecommendationJobs(randomJobs);
                setLoading(false);
                throw new Error("Network response was not ok");
            }
            console.log("csxadas");
            const result = await response.json();
            console.log(result.top_jobs);
            setRecommendationJobs(result.top_jobs);
        }
        catch (error) {
            const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
            setRecommendationJobs(randomJobs);
            setLoading(false);
            console.error("Error sending data to Flask:", error);
        }
    };
    // Determine if we need navigation buttons based on recommendation count
    const showRecommendationNav = recommendationJobs.length > cardsPerPage;
    // For centered layout when fewer than 3 cards
    const getRecommendationLayout = () => {
        const visibleCards = recommendationJobs.slice(recommendationStartIndex, recommendationStartIndex + cardsPerPage);
        if (visibleCards.length === 0) {
            return _jsx("div", { className: "text-center py-8 text-gray-500", children: "No recommended jobs available" });
        }
        if (visibleCards.length < cardsPerPage) {
            // Center cards when fewer than cardsPerPage
            return (_jsx("div", { className: "flex justify-center gap-6 w-full px-4", children: visibleCards.map((job) => (_jsx("div", { className: "w-full max-w-[320px]", children: _jsx(JobCard, { job: job }) }, job.id))) }));
        }
        // Regular layout for 3 or more cards
        return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4", children: visibleCards.map((job) => (_jsx(JobCard, { job: job }, job.id))) }));
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white", children: [loading && _jsx(LoadingOverlay, {}), _jsx(Navbar, {}), _jsxs("div", { className: "container mx-auto px-4 py-8 max-w-6xl", children: [_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "relative mb-8", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex-grow relative", children: [_jsx("input", { type: "text", placeholder: "Search jobs, titles, or keywords...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-12 pr-10 py-3 rounded-xl \n                  bg-white/70 backdrop-blur-sm \n                  border border-purple-100/50 \n                  focus:ring-2 focus:ring-purple-300 \n                  transition duration-300 \n                  text-gray-700 placeholder-gray-400\n                  shadow-sm" }), _jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 \n                  text-purple-400" }), searchQuery && (_jsx(X, { onClick: () => setSearchQuery(""), className: "absolute right-4 top-1/2 -translate-y-1/2 \n                    text-gray-400 cursor-pointer \n                    hover:text-purple-500 transition" }))] }), _jsx(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setIsFilterOpen(!isFilterOpen), className: "bg-purple-100 text-purple-600 p-3 rounded-xl \n                hover:bg-purple-200 transition shadow-sm", children: _jsx(Filter, {}) })] }) }), _jsx(AnimatePresence, { children: isFilterOpen && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "mb-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-700 mb-4", children: "Select Job Categories" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: jobTags.map((category) => (_jsx(motion.div, { whileHover: { scale: 1.05 }, className: `p-3 rounded-lg cursor-pointer transition text-center
                        ${selectedCategories.includes(category.jobCategoryName)
                                                    ? "bg-purple-200 text-purple-800"
                                                    : "bg-gray-100 text-gray-700 hover:bg-purple-100"}`, onClick: () => handleCategoryToggle(category.jobCategoryName), children: category.jobCategoryName }, category.id))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-700 mb-4", children: "Select Price Ranges" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: PRICE_RANGES.map((range) => (_jsx(motion.div, { whileHover: { scale: 1.05 }, className: `p-3 rounded-lg cursor-pointer transition text-center
                        ${selectedPriceRanges.includes(range.value)
                                                    ? "bg-purple-200 text-purple-800"
                                                    : "bg-gray-100 text-gray-700 hover:bg-purple-100"}`, onClick: () => handlePriceRangeToggle(range.value), children: range.label }, range.value))) })] })] })) }), _jsxs("div", { className: "space-y-10", children: [_jsxs("section", { className: "bg-white/50 rounded-xl shadow-sm p-6", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-6 flex items-center", children: [_jsx("span", { className: "bg-purple-100 text-purple-600 p-2 rounded-lg mr-3", children: _jsx(Users, { size: 20 }) }), "Recommended Jobs"] }), _jsxs("div", { className: "relative", children: [showRecommendationNav && (_jsxs(_Fragment, { children: [_jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, onClick: prevRecommendationSlide, disabled: recommendationStartIndex === 0, className: "absolute left-0 top-1/2 -translate-y-1/2 z-10 \n                      bg-purple-500/20 text-purple-700 p-2 rounded-full \n                      disabled:opacity-30 disabled:cursor-not-allowed", children: _jsx(ChevronLeft, {}) }), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, onClick: nextRecommendationSlide, disabled: recommendationStartIndex + cardsPerPage >= recommendationJobs.length, className: "absolute right-0 top-1/2 -translate-y-1/2 z-10 \n                      bg-purple-500/20 text-purple-700 p-2 rounded-full \n                      disabled:opacity-30 disabled:cursor-not-allowed", children: _jsx(ChevronRight, {}) })] })), getRecommendationLayout()] })] }), _jsxs("section", { className: "bg-white/50 rounded-xl shadow-sm p-6", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-800 mb-6 flex items-center", children: [_jsx("span", { className: "bg-purple-100 text-purple-600 p-2 rounded-lg mr-3", children: _jsx(Briefcase, { size: 20 }) }), "All Jobs"] }), filteredJobs.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredJobs.map((job) => (_jsx(JobCard, { job: job }, job.id))) })) : (_jsx("div", { className: "text-center py-12 bg-white/70 rounded-xl", children: _jsx("p", { className: "text-gray-500", children: "No jobs found matching your search" }) }))] })] })] }), _jsx(Footer, {})] }));
}
