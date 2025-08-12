import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Navbar from "../../components/Navbar.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import Footer from "../../components/Footer.js";
import ProfileBiodata from "../../components/sections/ProfileBiodata.js";
import { LogOut } from "lucide-react";
import { NestedModalProvider } from "../../contexts/nested-modal-context.js";
import { logout } from "../../controller/userController.js";
import ProfileInvitationSection from "../../components/sections/ProfileInvitationSection.js";
import JobDetailModal from "../../components/modals/JobDetailModal.js";
import ProfileFreelancerSection from "../../components/sections/ProfileFreelancerSection.js";
import ProfileTransactionsSection from "../../components/sections/ProfileTransactionHistory.tsx";
import ProfileClientHistory from "../../components/sections/ClientHistory.tsx";
export default function ProfilePage() {
    const [activeSection, setActiveSection] = useState("biodata");
    const [modalIndex, setModalIndex] = useState(null);
    const [isJobDetailModal, setIsJobDetailModal] = useState(false);
    const [jobDetail, setJobDetail] = useState();
    const [isClientHistoryModalOpen, setIsClientHistoryModalOpen] = useState(false);
    const user = localStorage.getItem("current_user");
    const userData = user ? JSON.parse(user).ok : null;
    const id = userData ? userData.id : null;
    const logoutBtn = async () => {
        await logout();
        window.location.href = "/";
    };
    const clickJobDetail = async (job) => {
        setIsJobDetailModal(true);
        setJobDetail(job);
    };
    const closeJobDetail = async () => {
        setIsJobDetailModal(false);
    };
    return (_jsx(NestedModalProvider, { children: _jsxs("div", { children: [_jsxs("div", { className: "flex flex-col min-h-screen bg-[#F9F7F7]", children: [_jsx(Navbar, {}), _jsxs("div", { className: "relative flex flex-grow overflow-hidden scrollbar-hide px-6 pl-20 pt-12", children: [_jsxs("div", { className: "w-1/3 hidden lg:block sticky top-0 left-0 h-screen z-10", children: [_jsx("div", { className: "text-xl font-bold mb-2 text-purple-700", children: "About You" }), _jsxs("ul", { className: "text-lg mb-4", children: [_jsx("li", { className: `cursor-pointer text-purple-950 p-2 ${activeSection === "biodata"
                                                        ? "font-semibold pl-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-l-xl"
                                                        : "hover:font-semibold"}`, onClick: () => setActiveSection("biodata"), children: "Biodata" }), _jsx("li", { className: `cursor-pointer text-purple-950 p-2 ${activeSection === "transaction"
                                                        ? "font-semibold pl-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-l-xl"
                                                        : "hover:font-semibold"}`, onClick: () => setActiveSection("transaction"), children: "Transaction History" })] }), _jsx("div", { className: "text-xl font-bold mb-2 text-purple-700", children: "Freelancer Options" }), _jsxs("ul", { className: "text-lg mb-4", children: [_jsx("li", { className: `cursor-pointer text-purple-950 p-2 ${activeSection === "invitation"
                                                        ? "font-semibold pl-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-l-xl"
                                                        : "hover:font-semibold"}`, onClick: () => setActiveSection("invitation"), children: "Invitation" }), _jsx("li", { className: `cursor-pointer text-purple-950 p-2 ${activeSection === "freelancer"
                                                        ? "font-semibold pl-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-l-xl"
                                                        : "hover:font-semibold"}`, onClick: () => setActiveSection("freelancer"), children: "Your Jobs" })] }), _jsx("div", { className: "text-xl font-bold mb-2 text-purple-700", children: "Client Options" }), _jsx("ul", { className: "text-lg mb-4", children: _jsx("li", { className: `cursor-pointer text-purple-950 p-2 ${activeSection === "client"
                                                    ? "font-semibold pl-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-l-xl"
                                                    : "hover:font-semibold"}`, onClick: () => setActiveSection("client"), children: "Client History" }) }), _jsxs("div", { className: "flex items-center gap-2 p-2 hover:font-bold transition-transform rounded-xl cursor-pointer text-red-500 hover:stroke-3", onClick: logoutBtn, children: [_jsx(LogOut, {}), " Log out"] })] }), _jsx("div", { className: "w-full scrollbar-hide bg-[#F9F7F7] z-10 mb-16", children: activeSection === "biodata" ? (_jsx(ProfileBiodata, {})) : activeSection === "invitation" ? (_jsx(ProfileInvitationSection, { onClickDetailJob: clickJobDetail })) : activeSection == "freelancer" ? (_jsx(ProfileFreelancerSection, {})) : activeSection === "client" ? (_jsx(ProfileClientHistory, {})) : activeSection === "transaction" ? (_jsx(ProfileTransactionsSection, { userId: id })) : (_jsx("div", {})) }), isJobDetailModal && jobDetail && (_jsx(JobDetailModal, { job: jobDetail, onClose: closeJobDetail })), modalIndex !== null ? (_jsx(AuthenticationModal, { modalIndex: modalIndex })) : (_jsx(AuthenticationModal, {}))] })] }), _jsx(Footer, {})] }) }));
}
