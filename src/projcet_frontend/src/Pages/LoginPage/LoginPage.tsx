import Navbar from "../../components/Navbar";
import { WavyBackground } from "../../components/ui/wavy-background.js";
import { AuroraText } from "../../components/ui/aurora-text.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import { ModalProvider, useModal } from "../../contexts/modal-context.js";
import { NestedModalProvider } from "../../contexts/nested-modal-context.js"; // Import new provider
import Footer from "../../components/Footer.tsx";
import { ProfileCard } from "../../components/cards/ProfileCard.tsx";
import CardCarousel from "../../components/cards/CardCarousel.tsx";
import image from "../../assets/pic.jpeg";
import { authUtils } from "../../utils/authUtils.js";
import { PenLine } from "lucide-react";
import { TypingAnimation } from "../../components/ui/typing-text.tsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProcessFlow from "../../components/cards/TransactionStepCard.tsx";
import WhyChoose from "../../components/cards/ChooseErgasia.tsx";
import JobCategories from "../../components/cards/CategoriesCard.tsx";
import { User } from "../../interface/User.ts";
import { getAllUsers } from "../../controller/userController.ts";
import LoadingOverlay from "../../components/ui/loading-animation.tsx";
import VantaRingsBackground from "../../components/ui/ring3d.tsx";
import { Vortex } from "../../components/ui/vortex.tsx";
import CallToAction from "../../components/buttons/DualAction.tsx";

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

function LoginPageContent() {
  const { current_user } = authUtils();
  const [isHovered, setIsHovered] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const { setOpen, openModal } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const users = await getAllUsers();
        if (users) {
          setFreelancers(users);
        } else {
          setFreelancers([]);
          console.error("No users found or error fetching users");
        }
      } catch (error) {
        console.error("Error fetching freelancers:", error);
        setFreelancers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreelancers();
  }, [current_user]);

  // Option 1: Use the simple modal toggle
  const handleSimpleModalOpen = () => {
    setOpen(true);
  };

  // Option 2: Use the more advanced modal system with index tracking
  const handleModalOpen = () => {
    const index = openModal();
    setModalIndex(index);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f7f7f9]">
      <Navbar />
      {/* main */}
      {isLoading && <LoadingOverlay message="Loading freelancers..." />}
      <div className="flex-grow overflow-x-hidden [&::-webkit-scrollbar]:hidden">
        <div className="relative min-h-screen">
          <VantaRingsBackground />
        </div>

        <div className="relative my-12 flex flex-col border-2 mx-6 border-blue-400 px-8 py-8  rounded-4xl">
          <div className="w-full max-w-6xl mx-auto pb-12">
            <h2 className="text-4xl text-center mb-8 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Start Your Crypto Journey
            </h2>
            <p className="text-center text-purple-700 text-xl mb-12 max-w-2xl mx-auto">
              Join the decentralized workforce marketplace where payments are
              secure, instant, and borderless.
            </p>
            <CallToAction />
          </div>
          <ProcessFlow />
        </div>
          <WhyChoose />
        <div className="relative flex flex-col items-center justify-center mt-12">
          <motion.div
            className="relative overflow-hidden bg-gradient-to-br from-blue-400  to-purple-400 w-[85%] h-72 px-12 py-8 text-4xl rounded-4xl font-bold shadow-lg"
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
                onClick={handleSimpleModalOpen} // Using the simple method here
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
        <JobCategories />
        <Footer />
      </div>
      {/* end main */}

      {/* Modal rendered conditionally based on tracking method */}
      {modalIndex !== null ? (
        <AuthenticationModal modalIndex={modalIndex} />
      ) : (
        <AuthenticationModal />
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <ModalProvider>
      <NestedModalProvider>
        <LoginPageContent />
      </NestedModalProvider>
    </ModalProvider>
  );
}
