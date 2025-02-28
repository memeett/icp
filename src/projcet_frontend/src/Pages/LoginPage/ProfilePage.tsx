import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaEdit, FaGoogle } from "react-icons/fa"; // Icons for rating
import Navbar from "../../components/Navbar.js";
import { ModalProvider } from "../../contexts/modal-context.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import { User } from "../../interface/User.js";
import { fetchUserBySession, updateUserProfile } from "../../controller/userController.js";
import Footer from "../../components/Footer.js";

export default function ProfilePage() {
    const [activeSection, setActiveSection] = useState("biodata");
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [tempUsername, setTempUsername] = useState("");
    const [tempDescription, setTempDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [faceRecognitionOn, setFaceRecognitionOn] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Show preview
        }
    };


    useEffect(() => {
        fetchUserBySession().then((user) => {
            if (user) {
                setUser(user as User);
                setUsername(user.username);
                setDescription(user.description);
                setFaceRecognitionOn(user.isFaceRecognitionOn)
            }
        });
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setTempUsername(username);
        setTempDescription(description);
    };


    const handleSave = async () => {
        try {
            if (selectedImage) {
                URL.createObjectURL(selectedImage)
            }

            // await updateUserProfile(tempUsername, tempDescription, imageData);
            window.location.reload();
        } catch (err) {
            console.error("Error saving profile:", err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTempUsername(username);
        setTempDescription(description);
        // setPreviewImage(user?.profilePicture || null);
    };

    const handleToggle = () => {
        setFaceRecognitionOn((prev) => !prev);
      };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) =>
            i < Math.floor(rating) ? (
                <FaStar key={i} className="text-yellow-400" />
            ) : (
                <FaRegStar key={i} className="text-gray-400" />
            )
        );
    };

    return (
        <ModalProvider>
            <div className="flex flex-col h-screen">
                <div className="flex-none w-full bg-white shadow-md z-50">
                    <Navbar />
                </div>

                <div className="flex flex-grow overflow-hidden scrollbar-hide pt-10 px-6 lg:px-20">
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

                    <div className="w-full overflow-x-hidden scrollbar-hide lg:w-5/6 pl-6">
                        {activeSection === "biodata" ? (
                            user ? (
                                <>
                                    <h2 className="text-3xl font-bold mb-4">My Information</h2>

                                    <div
                                        className={`relative bg-white shadow rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border ${isEditing ? "border-blue-500 shadow-lg" : "border-gray-300"}`}
                                    >
                                        <div className="relative flex flex-col items-center">
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(user.profilePicture)}
                                                    alt="Profile"
                                                    className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-gray-300 object-cover"
                                                />

                                            </div>

                                            {isEditing && (
                                                <>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        id="imageUpload"
                                                    />
                                                    <label
                                                        htmlFor="imageUpload"
                                                        className="mt-5 bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-300"
                                                    >
                                                        Change Image
                                                    </label>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex-1 w-full">
                                            <div className="grid gap-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1 text-sm">Username</label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        value={isEditing ? tempUsername : username}
                                                        onChange={(e) => setTempUsername(e.target.value)}
                                                        disabled={!isEditing}
                                                        placeholder="Enter your username"
                                                        className={`w-full text-base font-medium text-gray-900 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${isEditing ? "border-blue-400 focus:ring-blue-400" : "border-gray-300 bg-gray-100"}`}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                                                    <button
                                                        className="flex items-center justify-center w-1/4 text-gray-600 border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-100 transition-all duration-200"
                                                        onClick={() => alert("Implement Google Login")}
                                                    >
                                                        <FaGoogle className="mr-2" />
                                                        Bind with Google
                                                    </button>
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1 text-sm">About Me</label>
                                                    <textarea
                                                        name="description"
                                                        value={isEditing ? tempDescription : description}
                                                        onChange={(e) => setTempDescription(e.target.value)}
                                                        disabled={!isEditing}
                                                        placeholder="Enter your description..."
                                                        className={`w-full text-gray-700 text-sm border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 ${isEditing ? "border-blue-400 focus:ring-blue-400" : "border-gray-300 bg-gray-100"}`}
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className="flex justify-end mt-4">
                                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2" onClick={handleSave}>
                                                        Save
                                                    </button>
                                                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg" onClick={handleCancel}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {!isEditing && (
                                            <FaEdit
                                                className="text-green-500 text-2xl cursor-pointer hover:text-green-700 transition-all duration-200"
                                                onClick={handleEdit}
                                            />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Rating</h3>
                                            <div className="flex space-x-1 text-xl">{renderStars(user.rating)}</div>
                                            <p className="text-gray-500 text-sm mt-1">{user.rating.toFixed(1)} / 5</p>
                                        </div>

                                        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Balance</h3>
                                            <p className="text-3xl font-bold text-green-600">$120</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between bg-white shadow rounded-lg mt-3 p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Face Recognition</h3>
                                        <div
                                            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition ${faceRecognitionOn ? "bg-green-600" : "bg-gray-300"
                                                }`}
                                            onClick={handleToggle}
                                        >
                                            <div
                                                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${faceRecognitionOn ? "translate-x-6" : "translate-x-0"
                                                    }`}
                                            ></div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-500 text-lg text-center">No user data available. Please log in.</div>
                            )
                        ) : (
                            <p className="text-gray-500">Loading user data...</p>
                        )}
                    </div>
                </div>

                <AuthenticationModal />
            </div>
            <Footer />
        </ModalProvider>
    );
}
