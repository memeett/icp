import { useDebugValue, useEffect, useState } from "react";
import { FaStar, FaRegStar, FaEdit, FaGoogle } from "react-icons/fa";
import Navbar from "../../components/Navbar.js";
import { ModalProvider } from "../../contexts/modal-context.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import { UpdateUserPayload, User } from "../../interface/User.js";
import {
  fetchUserBySession,
  updateUserProfile,
} from "../../controller/userController.js";
import Footer from "../../components/Footer.js";
import { authUtils } from "../../utils/authUtils.js";
import ProfileBiodata from "../../components/sections/ProfileBiodata.js";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<string>("biodata");
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex flex-grow overflow-hidden scrollbar-hide pt-10 px-6 pl-20">
          <div className="w-1/6 pr-6 hidden lg:block sticky top-0 h-screen">
            <h2 className="text-3xl font-bold mb-6">Settings</h2>
            <ul className="space-y-4 text-lg">
              <li
                className={`cursor-pointer ${
                  activeSection === "biodata"
                    ? "font-semibold border-l-2 border-black pl-2"
                    : "hover:font-semibold"
                }`}
                onClick={() => setActiveSection("biodata")}
              >
                Biodata
              </li>
              <li
                className={`cursor-pointer ${
                  activeSection === "freelancer"
                    ? "font-semibold border-l-2 border-black pl-2"
                    : "hover:font-semibold"
                }`}
                onClick={() => setActiveSection("freelancer")}
              >
                Freelancer History
              </li>
              <li
                className={`cursor-pointer ${
                  activeSection === "client"
                    ? "font-semibold border-l-2 border-black pl-2"
                    : "hover:font-semibold"
                }`}
                onClick={() => setActiveSection("client")}
              >
                Client History
              </li>
            </ul>
          </div>
          <div className="w-full scrollbar-hide">
            {activeSection === "biodata" ? <ProfileBiodata /> : <div></div>}
          </div>

          <AuthenticationModal />
        </div>
      </div>
      <Footer />
    </div>
  );
}
