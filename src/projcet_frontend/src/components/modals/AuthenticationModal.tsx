"use client";
import React, { useState } from "react";
import { ModalBody, ModalContent, ModalFooter } from "../ui/animated-modal";
import { motion } from "framer-motion";
import { CameraIcon, GlobeIcon } from "lucide-react";
import { useModal } from "../../contexts/modal-context";
import {
  login,
  loginWithInternetIdentity,
} from "../../controller/userController";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoadingOverlay from "../ui/loading-animation";

import { useNestedModal } from "../../contexts/nested-modal-context";

import { FaceVerificationModal } from "./FaceVerificationModal";

export function AuthenticationModal({ modalIndex }: { modalIndex?: number }) {
  const { open, setOpen, closeModal } = useModal();
  const { openNestedModal } = useNestedModal();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const [key, setKey] = useState(0);

  const handleOpenFaceVerification = () => {
    openNestedModal(
      <FaceVerificationModal parentIndex={modalIndex || 0} index={0} />
    );
  };

  const handleClose = () => {
    if (modalIndex !== undefined) {
      closeModal(modalIndex);
    } else {
      setOpen(false);
    }
  };

  if (!open && modalIndex === undefined) return null;

  return (
    <div className="hidden md:flex flex-column items-center space-x-4">
      {loading && <LoadingOverlay message="Logging You In" />}
      <ModalBody className="flex flex-column items-center space-x-4">
        <ModalContent className="max-w-2xl mx-auto bg-[#F9F7F7]">
          <div className="space-y-8  px-8 pt-8 pb-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-[#112D4E]">
                Sign in to ERGASIA
              </h3>
              <p className="mt-3 text-[#112D4E] text-lg">
                Choose your authentication method
              </p>
            </div>

            <div className="space-y-5">
              {/* Internet Identity */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  setLoading(true);
                  const success = await loginWithInternetIdentity();
                  if (success) {
                    setOpen(false);
                    setLoading(false);
                  }
                  await navigate("/profile");
                }}
              >
                <button
                  className="relative w-full flex items-center justify-center space-x-2 bg-transparent border-2 border-[#112D4E] px-24 py-4 text-lg rounded-4xl transition-all hover:bg-[#112D4E] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#112D4E] focus:ring-offset-2"
                  onClick={loginWithInternetIdentity}
                >
                  <GlobeIcon className="w-6 h-6" />
                  <span>Internet Identity</span>
                </button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Option 1: Open nested modal */}
                <button
                  className="relative w-full flex items-center justify-center space-x-2 bg-transparent border-2 border-[#112D4E] px-24 py-2 text-lg rounded-4xl transition-all hover:bg-[#112D4E] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#112D4E] focus:ring-offset-2"
                  onClick={handleOpenFaceVerification}
                >
                  <CameraIcon className="w-6 h-6" />
                  <span>Camera Authentication</span>
                </button>
              </motion.div>
            </div>

            {/* <div className="text-center text-md text-black">
              <p>
                Don't have an account?
                <button
                  className="ml-1 text-blue-600 hover:text-blue-600 dark:text-blue-400 cursor-pointer"
                  onClick={async () => {
                    // const res = await login("gzs612n");
                    //const res = await login("43djee4");
                    const res = await login("q1tsvi");
                    // const res = await login("gzs612n");
                    // const res = await login("q1tsvi");
                    if (res) {
                      setOpen(false);
                    }
                  }}
                >
                  Secret Sign In
                </button>
              </p>
            </div> */}
          </div>

          <ModalFooter className="flex items-center justify-center mt-2 p-0 ">
            <div
              onClick={handleClose}
              className="w-full h-full text-lg text-center font-semibold rounded-b-2xl border-b border-b-[#112D4E] text-black transition-colors hover:text-white hover:bg-[#D9534F] hover:border-[#D9534F] py-4 "
            >
              Cancel
            </div>
          </ModalFooter>
        </ModalContent>
      </ModalBody>
    </div>
  );
}
