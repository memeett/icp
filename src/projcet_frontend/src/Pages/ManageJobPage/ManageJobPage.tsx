import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getUserJobs, deleteJob } from "../../controller/jobController";
import { useModal } from "../../contexts/modal-context";
import { fetchUserBySession } from "../../controller/userController";
import { User } from "../../interface/User";

import { Job, JobCategory } from "../../interface/job/Job";
import { Edit } from "lucide-react";
import EditJobForm from "../../components/modals/EditJobModal";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageJobPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [jobStatus] = useState<string[]>([
    "Start",
    "Ongoing",
    "Finished",
  ]);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableCategories, setAvailableCategories] = useState<JobCategory[]>([]);

  const { openModal, closeModal, setOpen } = useModal();

  
  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setOpen(true);     
    const modalIndex = openModal();   };

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

  const navigate = useNavigate();



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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-6 mt-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Manage Your Jobs
          </h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}

          >
            <Link
              to="/post"
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="text-lg" /> Create New Job
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-lg bg-white/70 rounded-2xl p-6 shadow-xl mb-8"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your jobs..."
              className="w-full px-12 py-4 rounded-full border-2 border-transparent bg-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700 placeholder-gray-400"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <FiX className="text-gray-400 text-xl hover:text-gray-600" />
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="flex gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg h-fit"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Job Status</h2>
            {jobStatus.map((status) => (
              <motion.div
                key={status}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 mb-4"
              >
                <input
                  type="radio"
                  className="w-4 h-4 text-purple-500 focus:ring-purple-400"
                  name="jobStatus"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={() => setSelectedStatus(status)}
                />
                <label className="text-gray-700 font-medium">{status}</label>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <AnimatePresence>
              {filteredJobs && filteredJobs.length > 0 ? (
                <motion.div 
                  className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden"
                  layout
                >
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
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
                          className="border-b border-gray-100 hover:bg-white/50 transition-colors duration-200"
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
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          job.jobStatus === "Start"
            ? "bg-green-100 text-green-800"
            : job.jobStatus === "Pending"
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
                            <div className="flex space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleEditClick(e, job)}
                                className="text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                <FiEdit className="h-5 w-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteJob(job.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/70 backdrop-blur-lg rounded-2xl p-12 text-center shadow-lg"
                >
                  <p className="text-gray-600 mb-6 text-lg">You haven't created any jobs yet</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/post"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FiPlus /> Create Your First Job
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
      <EditJobForm
        job={selectedJob||null}
        onSave={handleSaveJob}
        onCancel={handleCloseModal}
      />
    </div>
  );
}


