import Navbar from "../../components/Navbar";
import { WavyBackground } from "../../components/ui/wavy-background.js";
import { AuroraText } from "../../components/ui/aurora-text.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import { ModalProvider } from "../../contexts/modal-context.js";
import Footer from "../../components/Footer.tsx";
import { ProfileCard } from "../../components/cards/ProfileCard.tsx";
import CardCarousel from "../../components/cards/CardCarousel.tsx";
import image from "../../assets/pic.jpeg";
import { authUtils } from "../../utils/authUtils.js";

export default function LoginPage() {

  authUtils();
  const freelancers = [
    {
      id: "1",
      name: "John Doe",
      category: "Web Development",
      jobsCompleted: 42,
      profileImage: image,
    },
    {
      id: "2",
      name: "Jane Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Mathew Smith",
      category: "Development LO",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Kenneth Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Vicnetn Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Pepe Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Semua Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Im Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Wuhu Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Xav Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },
    {
      id: "2",
      name: "Bibimpap Smith",
      category: "Graphic Design",
      jobsCompleted: 28,
      profileImage: image,
    },

    // Add more freelancers as needed
  ];
  return (
    <ModalProvider>
      <div className="flex flex-col h-screen">
        <div className="flex-none w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        {/* main */}
        <div className="flex-grow overflow-x-hidden [&::-webkit-scrollbar]:hidden">
          <div className="relative bg-[#F9F7F7] min-h-screen">
            <WavyBackground className="w-screen mx-auto pb-40 px-16 align-middle mt-24">
              <p className="inline text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-left">
                With Love, Passion and{" "}
              </p>
              <AuroraText className="inline text-7xl font-bold">
                Talent
              </AuroraText>
              <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-left">
                Empowering Freelancers & Businesses with Web3 Technology.
              </p>
            </WavyBackground>
          </div>
          <h2 className="text-center text-3xl mt-12 mb-6 font-bold">
            Hire our top rated Freelancer.
          </h2>
          <div className="flex w-full justify-center">
            <CardCarousel
              cards={freelancers.map((freelancer) => (
                  <ProfileCard key={freelancer.id} {...freelancer}/>
              ))}
              cardWidth={320}
              gap={24}
            />
          </div>
          <div className="relative my-12 flex flex-col">
            <div className="flex flex-row gap-x-24 justify-center">
              <div className="w-xl h-72 bg-red-500"></div>
              <div className="w-xl h-72 bg-red-500"></div>
            </div>
            <div className="flex flex-row gap-x-24 justify-center mt-24">
              <div className="w-xl h-72 bg-red-500"></div>
              <div className="w-xl h-72 bg-red-500"></div>
            </div>
          </div>
          <Footer />
        </div>
        {/* end main */}
        <AuthenticationModal />
      </div>
    </ModalProvider>
  );
}
