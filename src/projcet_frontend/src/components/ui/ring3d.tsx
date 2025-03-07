import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { AuroraText } from "../../components/ui/aurora-text.js";
import { TypingAnimation } from "../../components/ui/typing-text.tsx";

interface VantaRingsProps {
  className?: string;
}

const VantaRingsBackground: React.FC<VantaRingsProps> = ({ className }) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVanta = async () => {
      try {
        if (!vantaEffect && vantaRef.current) {
          // Dynamically import Three.js and Vanta
          const THREE = await import("three");
          const VANTA = await import("vanta/dist/vanta.rings.min.js");

          // Initialize the effect with light theme colors
          const effect = VANTA.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 400.0,
            minWidth: 400.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0xf9f7f7, // Light background to match your theme
            color: 0x41b8aa, // Your brand color
            backgroundAlpha: 0.8, // Slight transparency
            ringColor: 0x41b8aa, // Match your brand color
          });

          setVantaEffect(effect);
        }
      } catch (err) {
        console.error("Error initializing Vanta:", err);
      }
    };

    loadVanta();

    // Clean up effect on component unmount
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Vanta background */}
      <div
        ref={vantaRef}
        className={`absolute inset-0 w-full h-full ${className || ""}`}
      />

      {/* Text overlay - dark text for light background */}
      <div className="relative z-10 w-full h-full items-center px-6 lg:px-16 text-center lg:text-left">
        <div className="max-w-4xl mx-auto lg:mx-0 mt-12">
          <motion.div
            className="flex flex-wrap items-center justify-start flex-row"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            <motion.p
              className="text-2xl md:text-4xl lg:text-7xl text-gray-800 font-bold inter-var"
              custom={0}
              variants={textVariants}
            >
              Redefining Freelancing with{" "}
            </motion.p>
            <motion.div custom={1} variants={textVariants}>
              <AuroraText className="text-2xl md:text-4xl lg:text-7xl font-bold">
                Ergasia
              </AuroraText>
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-6 text-xl font-semibold text-gray-800"
            custom={4}
            variants={textVariants}
          >
            <TypingAnimation className="inline">
              Join Ergasia today and transform how you work.
            </TypingAnimation>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VantaRingsBackground;
