import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; // Icons for rating
import Navbar from "../../components/Navbar";

export default function BiodataPage() {
    const [activeSection, setActiveSection] = useState("biodata"); // Default section
    const [user, setUser] = useState({
        profilePicture: "https://via.placeholder.com/100", // Replace with actual image URL
        username: "Kenneth Andrew",
        email: "k***8@gmail.com",
        description: "A passionate software developer with experience in full-stack development.",
        rating: 4.2, // Rating out of 5
        balance: 120.50, // User balance
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    // Generate star rating
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= Math.floor(rating) ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-gray-400" />);
        }
        return stars;
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <div className="flex-none w-full bg-white shadow-md z-50">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="flex flex-grow overflow-hidden scrollbar-hide pt-10 px-6 lg:px-20">
                {/* Sidebar */}
                <div className="w-1/6 pr-6 hidden lg:block sticky top-0 h-screen">
                    <h2 className="text-3xl font-bold mb-6">Settings</h2>
                    <ul className="space-y-4 text-lg">
                        <li
                            className={`cursor-pointer ${activeSection === "biodata" ? "font-semibold border-l-2 border-black pl-2" : "hover:font-semibold"}`}
                            onClick={() => setActiveSection("biodata")}
                        >
                            Biodata
                        </li>
                        <li
                            className={`cursor-pointer ${activeSection === "freelancer" ? "font-semibold border-l-2 border-black pl-2" : "hover:font-semibold"}`}
                            onClick={() => setActiveSection("freelancer")}
                        >
                            Freelancer History
                        </li>
                        <li
                            className={`cursor-pointer ${activeSection === "client" ? "font-semibold border-l-2 border-black pl-2" : "hover:font-semibold"}`}
                            onClick={() => setActiveSection("client")}
                        >
                            Client History
                        </li>
                    </ul>
                </div>

                {/* Content Area */}
                <div className="w-full overflow-x-hidden scrollbar-hide lg:w-5/6 pl-6">
                    {activeSection === "biodata" && (
                        <>
                            <h2 className="text-3xl font-bold mb-4">My Information</h2>

                            {/* Profile Card */}
                            <div className="relative bg-white shadow rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-300">
                                {/* Profile Image */}
                                <div className="relative">
                                    <img src={user.profilePicture} alt="Profile" className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-gray-300 object-cover" />
                                </div>

                                {/* User Information */}
                                <div className="flex-1 w-full">
                                    <div className="grid gap-4">
                                        {/* Username */}
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1 text-sm">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={user.username}
                                                onChange={handleChange}
                                                className="w-full text-base font-medium text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={user.email}
                                                onChange={handleChange}
                                                className="w-full text-base text-gray-600 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1 text-sm">About Me</label>
                                            <textarea
                                                name="description"
                                                value={user.description}
                                                onChange={handleChange}
                                                className="w-full text-gray-700 text-sm border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>


                            {/* Rating & Balance Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {/* Rating */}
                                <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Rating</h3>
                                    <div className="flex space-x-1 text-xl">{renderStars(user.rating)}</div>
                                    <p className="text-gray-500 text-sm mt-1">{user.rating.toFixed(1)} / 5</p>
                                </div>

                                {/* Balance */}
                                <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Balance</h3>
                                    <p className="text-3xl font-bold text-green-600">${user.balance.toFixed(2)}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
