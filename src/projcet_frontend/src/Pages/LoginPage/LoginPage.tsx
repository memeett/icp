import Navbar from "../../components/Navbar";
import { WavyBackground } from "../../components/ui/wavy-background.js";
import { AuroraText } from "../../components/ui/aurora-text.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import { ModalProvider, useModal } from "../../contexts/modal-context.js";
import Footer from "../../components/Footer.tsx";
import { ProfileCard } from "../../components/cards/ProfileCard.tsx";
import CardCarousel from "../../components/cards/CardCarousel.tsx";
import image from "../../assets/pic.jpeg";
import { authUtils } from "../../utils/authUtils.js";
import { PenLine } from "lucide-react";
import { TypingAnimation } from "../../components/ui/typing-text.tsx";
import { motion } from "framer-motion";
import { useState } from "react";
import ProcessFlow from "../../components/cards/TransactionStepCard.tsx";
import WhyChoose from "../../components/cards/ChooseErgasia.tsx";
import JobCategories from "../../components/cards/CategoriesCard.tsx";

const BackgroundPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const FloatingBubbles = () => {
  // Generate random bubbles
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-white opacity-10"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

export default function LoginPage() {
  authUtils();
  const [isHovered, setIsHovered] = useState(false);
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
  const { setOpen } = useModal();
  return (

    <div className="flex flex-col h-screen bg-[#F9F7F7]">

        <Navbar />
      {/* main */}
      <div className="flex-grow overflow-x-hidden [&::-webkit-scrollbar]:hidden">
        <div className="relative  min-h-screen">
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

        <div className="relative flex flex-col items-center justify-center mt-24">
          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-[#41b8aa] to-[#2a8f84] w-[85%] h-72 px-12 py-8 text-4xl rounded-4xl font-bold shadow-lg"
            initial={{ opacity: 0.9 }}
            animate={{
              boxShadow: isHovered
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                : "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              y: isHovered ? -5 : 0,
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ duration: 0.3 }}
          >
            {/* Background elements */}
            <BackgroundPattern />
            <FloatingBubbles />

            {/* Glowing accent */}
            <motion.div
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white"
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Border accent */}
            <motion.div
              className="absolute inset-0 rounded-4xl border border-white opacity-20"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                className="text-white"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Why bother with traditional payment methods?
              </motion.div>

              <motion.div
                className="text-white"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Behold the power of Cryptocurrency, only in{" "}
                <TypingAnimation className="inline">Ergasia.</TypingAnimation>
              </motion.div>

              <motion.button
                onClick={() => setOpen(true)}
                className="bg-white px-8 py-4 rounded-2xl font-medium border-solid border-2 border-white hover:text-black text-[#41b8aa] mt-4 relative overflow-hidden group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                  animate={{
                    x: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <div className="flex items-center justify-center text-center text-xl relative z-10 ">
                  Sign in <PenLine className="inline stroke-2 w-4 ml-2" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="relative my-12 flex flex-col">
          <ProcessFlow />
          <WhyChoose />
        </div>

        <JobCategories />


        <div className="flex flex-col w-full justify-center text-center mt-12 mb-24">
        <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
          Hire our Top Rated Freelancers
        </h2>
          <CardCarousel
            cards={freelancers.map((freelancer) => (
              <motion.div whileHover={{ scale: 1.02 }}>
                <ProfileCard key={freelancer.id} {...freelancer} />
              </motion.div>
            ))}
            cardWidth={320}
            gap={24}
          />
        </div>
        <Footer />
      </div>
      {/* end main */}
      <AuthenticationModal />
    </div>
  );
}
