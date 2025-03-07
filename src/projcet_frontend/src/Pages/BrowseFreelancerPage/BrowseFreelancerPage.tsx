import { FiSearch, FiX, FiFilter } from "react-icons/fi";
import FreelancerCard from "../../components/cards/FreelancerCard";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { User } from "../../interface/User";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../controller/userController";
import LoadingOverlay from "../../components/ui/loading-animation";
import { motion } from "framer-motion";
import { useJobCategories } from "../../utils/useJobCategories";
import { Filter, Search } from "lucide-react";

export default function BrowseFreelancerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listUser, setListUser] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { data: jobCategories } = useJobCategories();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        if (users) setListUser(users);
        setDataLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load freelancers");
      }
    };

    setDataLoading(true);
    fetchUsers();
  }, []);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [category] // Cap at 1 category
    );
  };

  const filteredUsers = listUser.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.preference?.some((cat) =>
        cat.jobCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategories.length === 0 ||
      user.preference?.some((cat) =>
        selectedCategories.includes(cat.jobCategoryName)
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      {dataLoading && <LoadingOverlay message="Loading data..." />}
      <Navbar />
      <div className="container mx-auto px-4 mt-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search freelancers or categories"
              className="w-full pl-12 pr-10 py-3 rounded-xl 
                                    bg-white/70 backdrop-blur-sm 
                                    border border-purple-100/50 
                                    focus:ring-2 focus:ring-purple-300 
                                    transition duration-300 
                                    text-gray-700 placeholder-gray-400"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 
                                    text-purple-400"
            />
            {searchQuery && (
              <FiX
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-100 text-purple-600 p-3 rounded-xl 
                                hover:bg-purple-200 transition"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter />
          </motion.button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Filter by Job Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {jobCategories?.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 rounded-lg cursor-pointer transition 
                    ${
                      selectedCategories.includes(category.jobCategoryName)
                        ? "bg-purple-200 text-purple-800"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-100"
                    }`}
                  onClick={() => handleCategoryToggle(category.jobCategoryName)}
                >
                  {category.jobCategoryName}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 text-center py-6">
        Find Our Top Featured Freelancers here
      </div>

      {/* Freelancer Cards Grid */}
      <div className="mx-auto px-16 flex-1 min-h-screen">
        {error ? (
          <p className="text-center text-red-500 text-xl">{error}</p>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10">
            {filteredUsers.map((user) => (
              <FreelancerCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl py-12">
            No freelancers match your search criteria
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}
