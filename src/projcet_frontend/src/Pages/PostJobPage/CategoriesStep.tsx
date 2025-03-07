import { motion } from "framer-motion";
import { X, Plus, Search, Check, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { viewAllJobCategories } from "../../controller/jobController";

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
  const [fetchedCategories, setFetchedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tempSelectedCategories, setTempSelectedCategories] =
    useState<string[]>(selectedCategories);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await viewAllJobCategories();
        if (categories) {
          setFetchedCategories(categories.map((cat) => cat.jobCategoryName)); // Assuming JobCategory has a `name` property
        } else {
          setFetchError("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setFetchError("An error occurred while fetching categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = fetchedCategories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );
const handleCategorySelection = (category: string) => {
  // Remove saveCategories() from here
  if (tempSelectedCategories.includes(category)) {
    setTempSelectedCategories(
      tempSelectedCategories.filter((cat) => cat !== category)
    );
  } else if (tempSelectedCategories.length < 3) {
    setTempSelectedCategories([...tempSelectedCategories, category]);
  }
};

// Save button handler remains separate
const saveCategories = () => {
  setSelectedCategories(tempSelectedCategories);
  setIsCategoryModalOpen(false);
};

  // Save selected categories and close the modal

  // Remove a category from the selected list
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
  };

  // Handle custom category submission
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
      className="space-y-6 relative" // Add `relative` here
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Categories
      </h2>

      <div className="space-y-4">
        {isLoading ? (
          <p>Loading categories...</p>
        ) : fetchError ? (
          <p className="text-red-500">{fetchError}</p>
        ) : (
          <>
            {/* Show initial categories */}
            <div className="flex flex-wrap gap-2">
              {fetchedCategories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    if (!selectedCategories.includes(category)) {
                      setSelectedCategories([...selectedCategories, category]);
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all"
                >
                  {category}
                </button>
              ))}
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-4 py-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 transition-all"
              >
                + More
              </button>
            </div>

            {/* Custom category input */}
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
          </>
        )}

        {/* Selected categories */}
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

      {/* Category selection modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-purple-800">
                Select Categories
                <span className="ml-2 text-sm font-normal text-purple-500">
                  (Max 3)
                </span>
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Selected categories in modal */}
            {tempSelectedCategories.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-purple-600 mb-2">Selected:</p>
                <div className="flex flex-wrap gap-2">
                  {tempSelectedCategories.map((category) => (
                    <div
                      key={category}
                      className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                    >
                      {category}
                      <X
                        className="w-4 h-4 cursor-pointer hover:text-purple-900"
                        onClick={() =>
                          setTempSelectedCategories(
                            tempSelectedCategories.filter(
                              (cat) => cat !== category
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category list */}
            <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCategorySelection(category)}
                    className={`cursor-pointer p-3 rounded-lg flex items-center justify-between ${
                      tempSelectedCategories.includes(category)
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    <span className="font-medium">{category}</span>
                    {tempSelectedCategories.includes(category) && (
                      <Check className="w-5 h-5" />
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">
                  {searchTerm
                    ? "No matching categories found"
                    : "Loading categories..."}
                </p>
              )}
            </div>

            {/* Max selection warning */}
            {tempSelectedCategories.length === 3 && (
              <p className="mt-3 text-sm text-yellow-600 flex items-center justify-center">
                <span className="mr-1">
                  <AlertTriangle />
                </span>{" "}
                Maximum selection reached (3)
              </p>
            )}

            {/* Modal actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                onClick={saveCategories}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </motion.div>
  );
};
