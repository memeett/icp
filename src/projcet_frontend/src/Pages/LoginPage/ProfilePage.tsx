import { useState } from "react";
import Navbar from "../../components/Navbar.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import Footer from "../../components/Footer.js";
import ProfileBiodata from "../../components/sections/ProfileBiodata.js";
import { LogOut } from "lucide-react";

import { NestedModalProvider } from "../../contexts/nested-modal-context.js";
import { logout } from "../../controller/userController.js";
import ProfileInvitationSection from "../../components/sections/ProfileInvitationSection.js";
import { Job } from "../../../../declarations/job/job.did.js";
import { job } from "../../../../declarations/job/index.js";
import JobDetailModal from "../../components/modals/JobDetailModal.js";
import ProfileFreelancerSection from "../../components/sections/ProfileFreelancerSection.js";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<string>("biodata");
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [isJobDetailModal, setIsJobDetailModal] = useState<boolean>(false)
  const [jobDetail, setJobDetail] = useState<Job>()

  const logoutBtn = async () => {
    await logout()
    window.location.href = "/";
  };

  const clickJobDetail = async (job : Job) => {
    setIsJobDetailModal(true)
    setJobDetail(job)
  }

  const closeJobDetail = async () => {
    setIsJobDetailModal(false)
  }

  return (
    <NestedModalProvider>
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
                className={`cursor-pointer p-2 ${activeSection === "invitation"
                    ? "font-semibold pl-4 bg-[#DBE2EF] rounded-l-xl"
                    : "hover:font-semibold"
                  }`}
                onClick={() => setActiveSection("invitation")}
              >
                Invitation
              </li>
              <li
                className={`cursor-pointer p-2 ${
                  activeSection === "freelancer"
                    ? "font-semibold pl-4 bg-[#DBE2EF] rounded-l-xl"
                    : "hover:font-semibold"
                }`}
                onClick={() => setActiveSection("freelancer")}
              >
                Freelancer
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
              onClick={logoutBtn}
            >
              <LogOut /> Log out
            </div>
          </div>

          <div className="w-full scrollbar-hide bg-[#F9F7F7] z-10 mb-16">
              {activeSection === "biodata" ? <ProfileBiodata /> : 
              activeSection === "invitation" ? <ProfileInvitationSection onClickDetailJob={clickJobDetail}/> : 
              activeSection == "freelancer" ? <ProfileFreelancerSection/> : <div></div>}
          </div>

      
      {isJobDetailModal && jobDetail && (
              <JobDetailModal job={jobDetail} onClose={closeJobDetail}/>
      )}

      {/* Modal rendered conditionally based on tracking method */}
      {modalIndex !== null ? (
        <AuthenticationModal modalIndex={modalIndex} />
      ) : (
        <AuthenticationModal />
      )}

        </div>
      </div>
      <Footer />
    </div>
    </NestedModalProvider>
  );
}
