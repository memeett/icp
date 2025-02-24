import React, { useState } from "react";
import { X, Menu } from "lucide-react";
import { AnimatedNavLink } from "./ui/animated-anchor";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <button className="bg-transparent hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
              Log in
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#3F72AF]"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-[#112D4E]`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            className="block hover:bg-[#3F72AF] px-3 py-2 rounded-md text-base font-medium"
          >
            Find Work
          </a>
          <a
            href="#"
            className="block hover:bg-[#3F72AF] px-3 py-2 rounded-md text-base font-medium"
          >
            Post a Job
          </a>
          <a
            href="#"
            className="block hover:bg-[#3F72AF] px-3 py-2 rounded-md text-base font-medium"
          >
            Browse Freelancers
          </a>
          <a
            href="#"
            className="block hover:bg-[#3F72AF] px-3 py-2 rounded-md text-base font-medium"
          >
            How it Works
          </a>
          <div className="pt-4 space-y-2">
            <button className="w-full bg-transparent hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
