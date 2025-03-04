import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

export default function ManageJobPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [jobStatus] = useState<string[]>([
    "All",
    "Start",
    "Pending",
    "Completed",
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
    closeModal(0); // Tutup modal dengan index 0
    setSelectedJob(null);
  };
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const jobs = await getUserJobs(currentUser?.id || "");
      if (jobs) {
        const convertedJobs = jobs.map(job => ({
          ...job,
          createdAt: Number(job.createdAt),
          updatedAt: Number(job.updatedAt),
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Your Jobs</h1>
          <Link
            to="/PostJobPage"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-200"
          >
            <FiPlus /> Create New Job
          </Link>
        </div>

        <div className="flex items-center gap-8 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your jobs..."
              className="w-full px-12 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            {searchQuery && (
              <FiX
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer hover:text-gray-600"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex overflow-x-hidden scrollbar-hide">
        <div className="flex flex-col bg-brown w-[20vw] h-screen container">
          <div className="flex flex-col h-screen p-20">
            <p className="text-2xl font-light mb-5">Job Status</p>
            {jobStatus.map((status) => (
              <div key={status} className="flex gap-5 mb-3">
                <input
                  type="radio"
                  className="scale-150"
                  name="jobStatus"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={() => setSelectedStatus(status)}
                />
                <label className="font-extralight text-l">{status}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[70vw] mt-10 p-5">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Your Job Listings
          </h2>

          {filteredJobs && filteredJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slots
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {job.jobName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {job.jobTags
                            .map((tag) => tag.jobCategoryName)
                            .join(", ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${
                                                      job.jobStatus === "Start"
                                                        ? "bg-green-100 text-green-800"
                                                        : job.jobStatus ===
                                                          "Pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-blue-100 text-blue-800"
                                                    }`}
                        >
                          {job.jobStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${job.jobSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.jobSlots.toString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditJob(job)} className="text-blue-600 hover:text-blue-900">
                            <FiEdit className="h-5 w-5" />
                            </button>                            

                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 mb-4">
                You haven't created any jobs yet
              </p>
              <Link
                to="/post"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
              >
                <FiPlus /> Create Your First Job
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <EditJobForm
        job={selectedJob||null}
        onSave={handleSaveJob}
        onCancel={handleCloseModal}
        

      />
    </div>
  );
}


