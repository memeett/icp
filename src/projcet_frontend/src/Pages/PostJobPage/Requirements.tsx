import { motion, AnimatePresence } from "framer-motion";
import { Trash, Plus, AlertCircle } from "lucide-react";

export const RequirementsStep = ({
  requirements,
  setRequirements,
  error,
}: {
  requirements: string[];
  setRequirements: (requirements: string[]) => void;
  error?: string;
}) => {
  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const updateRequirement = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      const updatedRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(updatedRequirements);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-2"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Job Requirements
      </h2>

      <AnimatePresence>
        <div className="space-y-4">
          {requirements.map((req, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
            >
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-purple-100 bg-white/80 backdrop-blur-sm focus:border-transparent focus:ring-4 focus:ring-purple-300/30 placeholder:text-purple-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder={`Requirement #${index + 1}`}
                />
              </div>

              {requirements.length > 1 && (
                <motion.button
                  onClick={() => removeRequirement(index)}
                  className="p-2 text-purple-500 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Trash size={24} className="stroke-current" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <motion.button
        onClick={addRequirement}
        className="flex items-center gap-2 w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl border-2 border-dashed border-purple-200 text-purple-600 hover:text-purple-700 transition-all"
        whileHover={{ scale: 1.005 }}
      >
        <Plus size={24} className="text-purple-500" />
        <span className="font-medium">Add New Requirement</span>
      </motion.button>

      {error && (
        <motion.p
          className="text-pink-600 mt-2 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={18} />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
