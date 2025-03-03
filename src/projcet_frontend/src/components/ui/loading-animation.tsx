import React from "react";
import { motion } from "framer-motion";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center m-0">
      {/* Semi-transparent backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md"></div>

      {/* Content container */}
      <motion.div
        className="relative z-10 bg-white shadow-xl rounded-2xl px-10 py-8 flex flex-col items-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Loading animation */}
        <div className="flex items-center space-x-3 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-[#3F72AF] rounded-full"
              animate={{
                y: ["0%", "-100%", "0%"],
                scale: [1, 1.2, 1],
                backgroundColor:
                  i === 0 ? ["#3F72AF", "#5e8fc9", "#3F72AF"] : undefined,
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          className="text-[#3F72AF] font-medium text-lg"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingOverlay;
