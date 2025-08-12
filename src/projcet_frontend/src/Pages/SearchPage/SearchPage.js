import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { AiOutlineFolder, AiOutlineHeart, AiOutlineLike } from 'react-icons/ai';
import { BsStar, BsStarFill } from 'react-icons/bs';
import Navbar from '../../components/Navbar';
import { ModalProvider } from '../../contexts/modal-context';
import { AuthenticationModal } from '../../components/modals/AuthenticationModal';
import { getAllUsers } from '../../controller/userController';
import { formatDate } from '../../utils/dateUtils';
export default function SearchPage() {
    useEffect(() => {
        const getFreelancers = async () => {
            try {
                const users = await getAllUsers();
                console.log("Users:", users);
            }
            catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        getFreelancers();
    }, []);
    const [searchQuery, setSearchQuery] = useState('');
    const jobs = [];
    return (_jsxs(ModalProvider, { children: [_jsx(Navbar, {}), _jsxs("div", { className: "max-w-6xl mx-auto p-6", children: [_jsx("div", { className: "flex items-center gap-4 mb-6" }), _jsxs("div", { className: "flex justify-between mb-8", children: [_jsxs("button", { className: "flex items-center gap-2 text-green-600 hover:text-green-700 transition duration-200", children: [_jsx(AiOutlineFolder, {}), _jsx("span", { children: "Save search" })] }), _jsxs("button", { className: "flex items-center gap-2 text-green-600 hover:text-green-700 transition duration-200", children: [_jsx(AiOutlineHeart, {}), _jsx("span", { children: "Saved jobs" })] })] }), _jsx("div", { className: "space-y-6", children: jobs.map((job) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-300 cursor-pointer group", children: [_jsxs("div", { className: "flex justify-between mb-4", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-gray-500 text-sm", children: ["Posted ", formatDate(job.createdAt)] }), _jsx("h2", { className: "text-xl font-semibold mt-1 group-hover:text-green-600 transition duration-200", children: job.jobName })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "p-2 rounded-full border border-gray-200 hover:bg-green-50 hover:border-green-500 transition duration-200", children: _jsx(AiOutlineLike, { className: "group-hover:text-green-600" }) }), _jsx("button", { className: "p-2 rounded-full border border-gray-200 hover:bg-green-50 hover:border-green-500 transition duration-200", children: _jsx(AiOutlineHeart, { className: "group-hover:text-green-600" }) })] })] }), _jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [[...Array(5)].map((_, i) => (i < Math.floor(job.jobRating) ?
                                                    _jsx(BsStarFill, { className: "text-yellow-400" }, i) :
                                                    _jsx(BsStar, { className: "text-gray-300" }, i))), _jsx("span", { className: "ml-1", children: job.jobRating })] }), _jsxs("span", { className: "text-green-600", children: ["Slots: ", Number(job.jobSlots)] }), _jsxs("span", { className: "text-green-600", children: ["$", job.jobSalary, "/month"] })] }), _jsx("div", { className: "mb-4", children: job.jobDescription.map((desc, index) => (_jsxs("p", { className: "text-gray-700 mb-2", children: ["\u2022 ", desc] }, index))) }), _jsx("div", { className: "flex flex-wrap gap-2", children: job.jobTags.map((tag) => (_jsx("span", { className: "px-4 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-green-100 hover:text-green-700 transition duration-200", children: tag.jobCategoryName }, tag.id))) })] }, job.id))) })] }), _jsx(AuthenticationModal, {})] }));
}
;
