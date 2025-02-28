import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";

const predefinedCategories = [
  "Front-end Developer",
  "Backend Developer",
  "AI Engineer",
  "Game Development",
  "Graphic Designer",
];

export const CategoriesStep = ({
  selectedCategories,
  setSelectedCategories,
  customCategory,
  setCustomCategory,
  error,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  customCategory: string;
  setCustomCategory: (value: string) => void;
  error?: string;
}) => {
  const addCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const handleCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCategory.trim() && !selectedCategories.includes(customCategory)) {
      setSelectedCategories([...selectedCategories, customCategory.trim()]);
      setCustomCategory("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
         Categories
      </h2>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {predefinedCategories.map((category) => (
            <button
              key={category}
              onClick={() => addCategory(category)}
              className="px-4 py-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all"
            >
              {category}
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomCategory} className="flex gap-2">
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-transparent focus:ring-4 focus:ring-blue-300/30 bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
            placeholder="Add custom category"
          />
          <button
            type="submit"
            className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all"
          >
            <Plus size={24} />
          </button>
        </form>

        {selectedCategories.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-gray-50 border-2 border-gray-100">
            <h3 className="text-lg font-semibold mb-2">Selected Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center gap-2"
                >
                  {category}
                  <button
                    onClick={() => removeCategory(category)}
                    className="hover:text-purple-200"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </motion.div>
  );
};
