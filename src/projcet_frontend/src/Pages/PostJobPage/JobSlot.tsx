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
    <div className="space-y-2">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
        👥 Applicants Needed
      </h2>
      <p className="text-gray-600">
        Specify how many candidates you're looking to hire for this position.
      </p>
    </div>

    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-green-50 border-2 border-green-100">
        <p className="text-sm text-green-700 mb-2">
          💡 Typical applicant numbers:
        </p>
        <ul className="list-disc list-inside space-y-1 text-green-800">
          <li>Small project: 1-3 applicants</li>
          <li>Medium team: 5-10 applicants</li>
          <li>Large recruitment: 10+ applicants</li>
        </ul>
      </div>

      <input
        type="number"
        min={1}
        value={jobSlots ?? ""}
        onChange={(e) => setJobSlots(e.target.valueAsNumber || null)}
        className={`w-full p-4 rounded-xl border-2 focus:border-transparent focus:ring-4 ${
          error
            ? "border-red-400 focus:ring-red-300/30"
            : "border-gray-200 focus:ring-blue-300/30"
        } bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md`}
        placeholder="Enter number (e.g., 5)"
      />

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  </motion.div>
);
