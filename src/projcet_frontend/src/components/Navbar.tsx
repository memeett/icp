import { X, Menu, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNavLink } from "./ui/animated-anchor";
import { useModal } from "../contexts/modal-context";
import { loginBtnClick } from "../controller/userController";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { setOpen } = useModal();

  const navigateToTesting = () =>{
    const nav = useNavigate()
    nav('/testing/ka')
  }

  return (
    <nav className="sticky bg-[#F9F7F7] text-black w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div className="text-4xl font-thin tracking-tighter hover:cursor-pointer">
              <span className="text-[#3F72AF]">E</span>RGASIA.
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex justify-around items-center">
              <AnimatedNavLink href="#">Find Work</AnimatedNavLink>
              <AnimatedNavLink href="#">Post a Job</AnimatedNavLink>
              <AnimatedNavLink href="#">Browse Freelancers</AnimatedNavLink>
              <AnimatedNavLink href="#">How it Works</AnimatedNavLink>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => setOpen(true)}
                className="w-full bg-transparent hover:bg-opacity-90 hover:border-2 px-4 py-2 rounded-2xl text-sm font-medium border-solid border border-black"
              >
                <div className="flex items-center justify-center text-center">
                  Sign in <PenLine className="inline stroke-2 w-4" />
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
