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
    <div className="space-y-2">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
        💰 Salary Per Candidate
      </h2>
      <p className="text-gray-600">
        Specify the total compensation for each selected candidate.
      </p>
    </div>

    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-100 to-pink-200 border-2 border-pink-100">
        <p className="text-sm text-pink-700 mb-2">💡 Common examples:</p>
        <ul className="list-disc list-inside space-y-1 text-pink-800">
          <li>Short-term project: $500 - $5,000</li>
          <li>Monthly contract: $3,000 - $10,000</li>
          <li>Full-time position: $50,000 - $150,000+</li>
        </ul>
      </div>

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
          placeholder="e.g., 5000 for a $5,000 project"
        />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

    </div>
  </motion.div>
);
