import Navbar from "../../components/Navbar";
import { WavyBackground } from "../../components/ui/wavy-background.js";
import { AuroraText } from "../../components/ui/aurora-text.js";
import { AuthenticationModal } from "../../components/modals/AuthenticationModal.js";
import { ModalProvider } from "../../contexts/modal-context.js";

export default function LoginPage() {


  return (
    <ModalProvider>
      <div className="flex flex-col h-screen">
        <div className="flex-none w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="flex-grow overflow-x-hidden scrollbar-hide">
          <div className="relative bg-[#F9F7F7] min-h-screen">
            <WavyBackground className="w-screen mx-auto pb-40 px-16 align-middle mt-24">
              <p className="inline text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-left">
                With Love, Passion and{" "}
              </p>
              <AuroraText className="inline text-7xl font-bold">
                Talent
              </AuroraText>
              <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-left">
                Leverage the power of canvas to create a beautiful hero section
              </p>
            </WavyBackground>
          </div>
        </div>

        {/* Add the AnimatedModal here */}
        <AuthenticationModal />
      </div>
    </ModalProvider>
  );
}
