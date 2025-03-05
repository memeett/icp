import { useState } from "react";
import Navbar from "../../components/Navbar.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import Footer from "../../components/Footer.js";
import ProfileBiodata from "../../components/sections/ProfileBiodata.js";
import { LogOut } from "lucide-react";
import { logout } from "../../controller/userController.js";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<string>("biodata");
  const logout = async () => {
    await logout()
    window.location.href = "/";
  };
  return (
    <div>
      <div className="flex flex-col min-h-screen bg-[#F9F7F7]">
        <Navbar />
        <div className="relative flex flex-grow overflow-hidden scrollbar-hide px-6 pl-20 pt-12">
          <div className="w-1/3 hidden lg:block sticky top-0 left-0 h-screen z-10">
            <div className="text-3xl font-bold mb-4">Settings</div>
            <ul className="text-lg mb-4">
              <li
                className={`cursor-pointer p-2 ${
                  activeSection === "biodata"
                    ? "font-semibold pl-4 bg-[#DBE2EF] rounded-l-xl"
                    : "hover:font-semibold"
                }`}
                onClick={() => setActiveSection("biodata")}
              >
                Biodata
              </li>
              <li
                className={`cursor-pointer p-2 ${
                  activeSection === "freelancer"
                    ? "font-semibold pl-4 bg-[#DBE2EF] rounded-l-xl"
                    : "hover:font-semibold"
                }`}
                onClick={() => setActiveSection("freelancer")}
              >
                Freelancer History
              </li>
              <li
                className={`cursor-pointer p-2 ${
                  activeSection === "client"
                    ? "font-semibold pl-4 bg-[#DBE2EF] rounded-l-xl"
                    : "hover:font-semibold"
                }`}
                onClick={() => setActiveSection("client")}
              >
                Client History
              </li>
            </ul>
            <div
              className="flex items-center gap-2 p-2 hover:font-bold transition-transform rounded-xl cursor-pointer text-red-500 hover:stroke-3"
              onClick={logout}
            >
              <LogOut /> Log out
            </div>
          </div>

          <div className="w-full scrollbar-hide bg-[#F9F7F7] z-10 mb-16">
            {activeSection === "biodata" ? <ProfileBiodata /> : <div></div>}
          </div>

          <AuthenticationModal />
        </div>
      </div>
      <Footer />
    </div>
  );
}
