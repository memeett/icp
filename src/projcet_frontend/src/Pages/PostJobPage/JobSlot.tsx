import { motion } from "framer-motion";

export const JobSlotsStep = ({
  jobSlots,
  setJobSlots,
  error,
}: {
  jobSlots: number | null;
  setJobSlots: (value: number | null) => void;
  error?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
      👥 Applicants
    </h2>
    <input
      type="number"
      min={1}
      value={jobSlots ?? ''}
      onChange={(e) => setJobSlots(e.target.valueAsNumber || null)}
      className={`w-full p-4 rounded-xl border-2 focus:border-transparent focus:ring-4 ${
        error
          ? "border-red-400 focus:ring-red-300/30"
          : "border-gray-200 focus:ring-blue-300/30"
      } bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md`}
      placeholder="Number of applicants needed"
    />
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </motion.div>
);
