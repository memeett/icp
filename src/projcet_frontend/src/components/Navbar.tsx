import { X, Menu, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNavLink } from "./ui/animated-anchor";
import { useModal } from "../contexts/modal-context";
import { fetchUserBySession, getCookie } from "../controller/userController";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../interface/User";

const Navbar = () => {
  const { setOpen } = useModal();
  const [user, setUser] = useState<User | null>(null);
  const [isAlreadyLogin, setIsAlreadyLogin] = useState(false);
  const nav = useNavigate()

  const profpicClick = () => {
    nav('/profile');
  };
  const logoClick = () => {
    nav('/');
  };

  useEffect(() => {
    fetchUserBySession().then((user) => {
      if (user) {
        setUser(user as User);
      }
    });
  }, []);


  return (
    <nav className="sticky top-0 shadow-md flex-none bg-[#F9F7F7] text-black w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div onClick={logoClick} className="text-4xl font-thin tracking-tighter hover:cursor-pointer">
              <span className="text-[#3F72AF]">E</span>RGASIA.
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex justify-around items-center">
              <AnimatedNavLink href="/FindJobPage">Find Work</AnimatedNavLink>
              <AnimatedNavLink href="/PostJobPage">Post a Job</AnimatedNavLink>
              <AnimatedNavLink href="#">Browse Freelancers</AnimatedNavLink>
              <AnimatedNavLink href="#">How it Works</AnimatedNavLink>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex gap-3 items-center">

                <a href="#">{user.username}</a>
                <img onClick={profpicClick} src={URL.createObjectURL(user.profilePicture)} alt="tes" className="w-10 h-10 rounded-full" />
              </div>

            ) : (
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
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
