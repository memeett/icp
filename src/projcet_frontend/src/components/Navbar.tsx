import React, { useState } from "react";
import { X, Menu } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#112D4E] text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold">FreelanceHub</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <a
                href="#"
                className="hover:bg-[#3F72AF] px-3 py-2 rounded-md text-sm font-medium"
              >
                Find Work
              </a>
              <a
                href="#"
                className="hover:bg-[#3F72AF] px-3 py-2 rounded-md text-sm font-medium"
              >
                Post a Job
              </a>
              <a
                href="#"
                className="hover:bg-[#3F72AF] px-3 py-2 rounded-md text-sm font-medium"
              >
                Browse Freelancers
              </a>
              <a
                href="#"
                className="hover:bg-[#3F72AF] px-3 py-2 rounded-md text-sm font-medium"
              >
                How it Works
              </a>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-[#3FAF7D] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
              Sign In
            </button>
            <button className="bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
              Join Now
            </button>
          </div>

          {/* Mobile menu button */}
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
            <button className="w-full bg-[#3FAF7D] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
              Sign In
            </button>
            <button className="w-full bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
