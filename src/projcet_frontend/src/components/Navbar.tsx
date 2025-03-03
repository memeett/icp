import { useMemo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { useModal } from "../contexts/modal-context";
import { AnimatedNavLink } from "./ui/animated-anchor";
import { User } from "../interface/User";
import { authUtils } from "../utils/authUtils";

const Navbar = () => {
  const { setOpen } = useModal();
  const [user, setUser] = useState<User | null>(null);
  const nav = useNavigate();

  const { cookie, session, current_user } = authUtils();

  const profpicClick = useCallback(() => {
    nav("/profile");
  }, [nav]);

  const logoClick = useCallback(() => {
    nav("/");
  }, [nav]);

  useEffect(() => {
    if (current_user && cookie && session) {
      const user = JSON.parse(current_user).ok;
      const profile = user.profilePicture;
      if (profile) {
        const u8 = new Uint8Array(Object.values(profile));
        const blob = new Blob([u8], { type: "image/png" });
        user.profilePicture = blob;
      }
      setUser(user);
    } else {
      setUser(null);
    }
    console.log("User:", user);
  }, [current_user]);

  const navLinks = useMemo(() => {
    if (user) {
      return (
        <div className="hidden md:block">
          <div className="ml-10 flex justify-around items-center">
            <AnimatedNavLink href="/find">Find Work</AnimatedNavLink>
            <AnimatedNavLink href="/manage">Manage Jobs</AnimatedNavLink>
            <AnimatedNavLink href="/post">Post a Job</AnimatedNavLink>
            <AnimatedNavLink href="#">Browse Freelancers</AnimatedNavLink>
          </div>
        </div>
      );
    }
  }, [user]);

  return (
    <nav className="sticky top-0 shadow-md flex-none bg-[#F9F7F7] text-black w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <div
              onClick={logoClick}
              className="text-4xl font-thin tracking-tighter hover:cursor-pointer"
            >
              <span className="text-[#3F72AF]">E</span>RGASIA.
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex justify-around items-center">
              <AnimatedNavLink href="/find">Find Work</AnimatedNavLink>
              <AnimatedNavLink href="/manage">Manage Jobs</AnimatedNavLink>
              <AnimatedNavLink href="/post">Post a Job</AnimatedNavLink>
              <AnimatedNavLink href="#">Browse Freelancers</AnimatedNavLink>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex gap-3 items-center hover:cursor-pointer">
                <a onClick={profpicClick}>{user.username}</a>
                <img
                  onClick={profpicClick}
                  src={
                    user.profilePicture
                      ? URL.createObjectURL(user.profilePicture)
                      : "/default-avatar.png"
                  }
                  alt="Profile Picture"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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
