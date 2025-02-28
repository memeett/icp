import { motion } from "framer-motion";

export const JobNameStep = ({
  jobName,
  setJobName,
  error,
}: {
  jobName: string;
  setJobName: (value: string) => void;
  error?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 p-2"
  >
    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent ">
      Job Title
    </h2>
    <input
      type="text"
      value={jobName}
      onChange={(e) => setJobName(e.target.value)}
      className={`w-full p-4 rounded-xl border-2 focus:border-transparent focus:ring-4 ${
        error
          ? "border-red-400 focus:ring-red-300/30"
          : "border-gray-200 focus:ring-blue-300/30"
      } bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md`}
      placeholder="Senior Blockchain Developer"
    />
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </motion.div>
);
