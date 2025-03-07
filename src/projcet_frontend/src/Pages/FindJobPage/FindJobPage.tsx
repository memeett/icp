import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import JobCard from "../../components/cards/JobCard";
import Footer from "../../components/Footer";
import { FiSearch, FiX } from "react-icons/fi";
import {
  viewAllJobCategories,
  viewAllJobs,
} from "../../controller/jobController";
import { UserClicked } from "../../../../declarations/userclicked/userclicked.did";
import { getUserClickedByUserId } from "../../controller/userClickedController";
import { Job, JobCategory } from "../../interface/job/Job";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingOverlay from "../../components/ui/loading-animation";
const JOB_CATEGORIES: JobCategory[] = [
  { id: "1", jobCategoryName: "Software Engineering" },
  { id: "2", jobCategoryName: "Design" },
  { id: "3", jobCategoryName: "Product Management" },
  { id: "4", jobCategoryName: "Marketing" },
  { id: "5", jobCategoryName: "Sales" },
  { id: "6", jobCategoryName: "Customer Support" },
  { id: "7", jobCategoryName: "Data Science" },
  { id: "8", jobCategoryName: "Finance" },
];

const PRICE_RANGES = [
  { label: "< $50", value: "0-50" },
  { label: "$50 - $100", value: "50-100" },
  { label: "$100 - $200", value: "100-200" },
  { label: "$200 - $500", value: "200-500" },
  { label: "> $2000", value: "2000+" },
];

export default function FindJobPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [jobTags, setJobTags] = useState<JobCategory[]>([]);
  const [listJobs, setListJobs] = useState<Job[]>([]);
  const [listUserClickeds, setListUserClickeds] = useState<UserClicked[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [recommendationJobs, setRecommendationJobs] = useState<Job[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("categories") || []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [recommendationStartIndex, setRecommendationStartIndex] = useState(0);

  const nextRecommendationSlide = () => {
    if (recommendationStartIndex + 5 < recommendationJobs.length) {
      setRecommendationStartIndex(recommendationStartIndex + 5);
    }
  };

  const prevRecommendationSlide = () => {
    if (recommendationStartIndex > 0) {
      setRecommendationStartIndex(recommendationStartIndex - 5);
    }
  };
  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };
  const handlePriceRangeToggle = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const fetchData = async () => {
    try {
      const jobs = await viewAllJobs();
      const categories = await viewAllJobCategories();

      if (jobs) setListJobs(jobs);
      if (categories) setJobTags(categories);

      await getRecommendationJoblList(jobs || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredJobs = listJobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.jobName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategories =
      selectedCategories.length === 0 ||
      job.jobTags.some((tag) =>
        selectedCategories.includes(tag.jobCategoryName)
      );

    const matchesPriceRanges =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((range) => {
        const [min, max] =
          range === "2000+" ? [2000, Infinity] : range.split("-").map(Number);
        return job.jobSalary >= min && job.jobSalary < max;
      });

    return matchesSearch && matchesCategories && matchesPriceRanges;
  });

  const convertBigIntToString = (data: any): any => {
    if (typeof data === "bigint") {
      return data.toString();
    }
    if (Array.isArray(data)) {
      return data.map(convertBigIntToString);
    }
    if (typeof data === "object" && data !== null) {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          convertBigIntToString(value),
        ])
      );
    }
    return data;
  };

  const getRecommendationJoblList = async (jobs: Job[]) => {
    const userClickeds = await getUserClickedByUserId();
    if (userClickeds) setListUserClickeds(userClickeds);

    if (userClickeds.length === 0) {
      const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
      setRecommendationJobs(randomJobs);
      return;
    }

    const data = {
      jobTags: convertBigIntToString(jobTags),
      listJobs: convertBigIntToString(jobs),
      listUserClickeds: convertBigIntToString(userClickeds),
    };

    if (
      data.jobTags.length === 0 ||
      data.listJobs.length === 0 ||
      data.listUserClickeds.length === 0
    ) {
      const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
      setRecommendationJobs(randomJobs);
      setLoading(false);
      return;
    }

    console.log(data);

    try {
      const response = await fetch("http://localhost:5000/getRecommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
        setRecommendationJobs(randomJobs);
        setLoading(false);
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Response from Flask:", result);
      setRecommendationJobs(result.top_jobs);
    } catch (error) {
      const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 5);
      setRecommendationJobs(randomJobs);
      setLoading(false);
      console.error("Error sending data to Flask:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      {loading && <LoadingOverlay />}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar with Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search jobs, titles, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                <X
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 
                                        text-gray-400 cursor-pointer 
                                        hover:text-purple-500 transition"
                />
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-purple-100 text-purple-600 p-3 rounded-xl 
                                hover:bg-purple-200 transition"
            >
              <Filter />
            </motion.button>
          </div>
        </motion.div>

        {/* Category Selection */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm"
            >
              {/* Job Categories */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Select Job Categories
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {jobTags.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      className={`p-3 rounded-lg cursor-pointer transition 
                                                ${selectedCategories.includes(
                        category.jobCategoryName
                      )
                          ? "bg-purple-200 text-purple-800"
                          : "bg-gray-100 text-gray-700 hover:bg-purple-100"
                        }`}
                      onClick={() =>
                        handleCategoryToggle(category.jobCategoryName)
                      }
                    >
                      {category.jobCategoryName}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Select Price Ranges
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PRICE_RANGES.map((range) => (
                    <motion.div
                      key={range.value}
                      whileHover={{ scale: 1.05 }}
                      className={`p-3 rounded-lg cursor-pointer transition 
                                                ${selectedPriceRanges.includes(
                        range.value
                      )
                          ? "bg-purple-200 text-purple-800"
                          : "bg-gray-100 text-gray-700 hover:bg-purple-100"
                        }`}
                      onClick={() => handlePriceRangeToggle(range.value)}
                    >
                      {range.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Listings Section */}
        <div className="space-y-8">
          {/* Recommended Jobs */}
          <div className="mb-8 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recommended Jobs
            </h2>

            <div className="relative flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevRecommendationSlide}
                disabled={recommendationStartIndex === 0}
                className="absolute left-0 z-10 bg-purple-500/20 text-purple-700 p-2 rounded-full 
                                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft />
              </motion.button>

              <div className="flex gap-4 overflow-hidden w-full px-12">
                {recommendationJobs
                  .slice(recommendationStartIndex, recommendationStartIndex + 5)
                  .map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextRecommendationSlide}
                disabled={
                  recommendationStartIndex + 5 >= recommendationJobs.length
                }
                className="absolute right-0 z-10 bg-purple-500/20 text-purple-700 p-2 rounded-full 
                                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight />
              </motion.button>
            </div>
          </div>

          {/* All Jobs */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Jobs</h2>
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/70 rounded-xl">
                <p className="text-gray-500">
                  No jobs found matching your search
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
