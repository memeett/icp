import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Edit, Trash2, Plus, Filter, Briefcase, CheckCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getUserJobs, deleteJob } from "../../controller/jobController";
import { useModal } from "../../contexts/modal-context";
import { fetchUserBySession } from "../../controller/userController";
import { User } from "../../interface/User";
import { Job, JobCategory } from "../../interface/job/Job";
import EditJobForm from "../../components/modals/EditJobModal";
import { motion, AnimatePresence } from "framer-motion";
import LoadingOverlay from "../../components/ui/loading-animation";

export default function ManageJobPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [jobStatus] = useState<string[]>([
    "Start",
    "Ongoing",
    "Finished",
    "All"
  ]);
  const [selectedStatus, setSelectedStatus] = useState("Start");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { openModal, closeModal, setOpen } = useModal();
  const navigate = useNavigate();

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setOpen(true);
    const modalIndex = openModal();
  };

  const handleCloseModal = () => {
    setOpen(false);
    closeModal(0);
    setSelectedJob(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobs = await getUserJobs(currentUser?.id || "");
      if (jobs) {
        const convertedJobs = jobs.map(job => ({
          ...job,
          createdAt: BigInt(job.createdAt),
          updatedAt: BigInt(job.updatedAt),
        }));
        setMyJobs(convertedJobs);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetchUserBySession();
      if (user) setCurrentUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, refreshKey]);

  const handleRowClick = (jobId: string, e: React.MouseEvent) => {
    const actionsCell = (e.target as HTMLElement).closest('td:last-child');
    if (!actionsCell) {
      navigate(`/jobs/${jobId}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    setSelectedJob(job);
    setOpen(true);
    const modalIndex = openModal();
  };

  const handleSaveJob = (updatedJob: Job) => {
    const updatedJobs = myJobs.map(job =>
      job.id === updatedJob.id ? updatedJob : job
    );
    setMyJobs(updatedJobs);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(jobId);
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.error("Error deleting job:", err);
      }
    }
  };

  const filteredJobs = myJobs?.filter((job) => {
    const matchesSearch = job.jobName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || job.jobStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingOverlay />;
  }

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Start":
        return "bg-green-100 text-green-800 border-green-200";
      case "Ongoing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Finished":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "All":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Title and Create Job Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Your Jobs
          </h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/post"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl 
                flex items-center gap-2 transition shadow-md hover:bg-purple-700"
            >
              <Plus size={20} /> Create New Job
            </Link>
          </motion.div>
        </motion.div>

        {/* Search Bar and Filter Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search your jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-xl 
                  bg-white/70 backdrop-blur-sm 
                  border border-purple-100/50 
                  focus:ring-2 focus:ring-purple-300 
                  transition duration-300 
                  text-gray-700 placeholder-gray-400
                  shadow-sm"
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
              className={`p-3 rounded-xl transition shadow-sm ${isFilterOpen
                  ? "bg-purple-200 text-purple-700"
                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
            >
              <Filter />
            </motion.button>
          </div>
        </motion.div>

        {/* Redesigned Filter Section */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm overflow-hidden"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                  <Filter size={16} />
                </span>
                Filter by Status
              </h3>

              <div className="flex flex-wrap gap-3">
                {jobStatus.map((status) => (
                  <motion.button
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-200 ${selectedStatus === status
                        ? `${getStatusColor(status)} font-medium`
                        : "bg-white/50 text-gray-600 border-gray-200 hover:border-purple-200"
                      }`}
                  >
                    {selectedStatus === status && <CheckCircle size={16} />}
                    {status}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jobs List Section */}
        <section className="bg-white/50 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
              <Briefcase size={20} />
            </span>
            Your Jobs
          </h2>

          <AnimatePresence>
            {filteredJobs && filteredJobs.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Job Title</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Salary</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Slots</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <motion.tr
                          key={job.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-gray-100 hover:bg-white/50 transition-colors duration-200 cursor-pointer"
                          onClick={(e) => handleRowClick(job.id, e)}
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {job.jobName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {job.jobTags.map((tag) => tag.jobCategoryName).join(", ")}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${job.jobStatus === "Start"
                                  ? "bg-green-100 text-green-800"
                                  : job.jobStatus === "Ongoing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                            >
                              {job.jobStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            ${job.jobSalary.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {job.jobSlots.toString()}
                          </td>
                          <td className="px-6 py-4">
                            {job.jobStatus === "Start" && (
                              <div className="flex space-x-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => handleEditClick(e, job)}
                                  className="text-purple-500 hover:text-purple-700 transition-colors"
                                >
                                  <Edit className="h-5 w-5" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </motion.button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white/70 rounded-xl"
              >
                <p className="text-gray-500 mb-6">You haven't created any jobs yet</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/post"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl transition shadow-md hover:bg-purple-700"
                  >
                    <Plus size={20} /> Create Your First Job
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <Footer />
      <EditJobForm
        job={selectedJob || null}
        onSave={handleSaveJob}
        onCancel={handleCloseModal}
      />
    </div>
  );
}