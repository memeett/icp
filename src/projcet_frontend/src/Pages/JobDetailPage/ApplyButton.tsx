import { motion } from "framer-motion";

export const ApplyButton = ({
  applied,
  disabled,
  Ongoing,
  Finished,
  onClick,
  label
}: {
  applied: boolean;
  disabled: boolean;
  Ongoing?: boolean;
  Finished?: boolean;
  onClick: () => void;
  label?: string;
}) => (
  <motion.button
    className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 ${disabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
      }`}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.02 } : undefined}
    whileTap={!disabled ? { scale: 0.98 } : undefined}
    onClick={onClick}
  >
    {label ? label : Ongoing ? "Ongoing" : Finished ? "Finished" : applied ? "Applied" : "Apply Now"}
  </motion.button>
);