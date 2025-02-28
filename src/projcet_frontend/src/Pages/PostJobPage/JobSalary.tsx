import { motion } from "framer-motion";

export const JobSalaryStep = ({
  jobSalary,
  setJobSalary,
  error,
}: {
  jobSalary: number | null;
  setJobSalary: (value: number | null) => void;
  error?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
      💰 Salary
    </h2>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        $
      </span>
      <input
        type="number"
        min={0}
        value={jobSalary?.toString() || ""}
        onChange={(e) => setJobSalary(e.target.valueAsNumber || null)}
        className={`w-full p-4 pl-10 rounded-xl border-2 focus:border-transparent focus:ring-4 ${
          error
            ? "border-red-400 focus:ring-red-300/30"
            : "border-gray-200 focus:ring-blue-300/30"
        } bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md`}
        placeholder="Enter total salary"
      />
    </div>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    <p className="text-gray-600 mt-2">
      This amount will be equally divided among selected freelancers
    </p>
  </motion.div>
);
