import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Info,
  Inbox,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getJobApplier, getJobById } from "../../controller/jobController";
import { authUtils } from "../../utils/authUtils";
import { User } from "../../interface/User";
import { Job } from "../../interface/job/Job";
import { applyJob, hasUserApplied } from "../../controller/applyController";
import LoadingOverlay from "../../components/ui/loading-animation";
import { createSubmission, getAllSubmissionbyUserJobId } from "../../controller/submissionController";
import { ResponseSubmission, Submission } from "../../../../declarations/submission/submission.did";
import HistorySubmissionCard from "../../components/cards/HistorySubmissionCard";

// Mock data for accepted users - replace with actual data fetching
const mockAcceptedUsers: User[] = [
    //   {
    //     id: "550e8400-e29b-41d4-a716-446655440000",
    //     profilePicture: new Blob(),
    //     username: "CloudExpertSarah",
    //     preference: [],
    //     dob: "1985-04-12",
    //     description:
    //       "AWS Certified Solutions Architect with 8+ years experience in cloud infrastructure design and implementation.",
    //     wallet: 24500,
    //     rating: 4.9,
    //     createdAt: BigInt(new Date("2018-03-15").getTime() * 1e6), // Convert to nanoseconds
    //     updatedAt: BigInt(new Date("2023-07-01").getTime() * 1e6),
    //     isFaceRecognitionOn: true,
    //   },
    //   {
    //     id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    //     profilePicture: new Blob(),
    //     preference: [],
    //     username: "FullStackDevMike",
    //     dob: "1992-11-30",
    //     description:
    //       "React/Node.js specialist focused on building scalable web applications with modern best practices.",
    //     wallet: 18250,
    //     rating: 4.7,
    //     createdAt: BigInt(new Date("2019-08-22").getTime() * 1e6),
    //     updatedAt: BigInt(new Date("2023-06-15").getTime() * 1e6),
    //     isFaceRecognitionOn: false,
    //   },
    //   {
    //     id: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
    //     profilePicture: new Blob(),
    //     preference: [],
    //     username: "DistributedSystemsJane",
    //     dob: "1988-07-17",
    //     description:
    //       "Microservices and Kubernetes expert with strong background in high-availability systems.",
    //     wallet: 31200,
    //     rating: 4.95,
    //     createdAt: BigInt(new Date("2017-05-10").getTime() * 1e6),
    //     updatedAt: BigInt(new Date("2023-07-10").getTime() * 1e6),
    //     isFaceRecognitionOn: true,
    //   },
];

const AcceptedUsersModal: React.FC<{
    users: User[];
    onClose: () => void;
}> = ({ users, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-indigo-800">Accepted Users</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {users.map((user) => (
                        <motion.div
                            key={user.id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-indigo-800">
                                    {user?.username}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {new Date(Number(user?.createdAt) / 1_000_000).toLocaleDateString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [submission, setSubmission] = useState<ResponseSubmission[] | []>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showAcceptedUsersModal, setShowAcceptedUsersModal] = useState(false);
  const { current_user } = authUtils();
 

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [responsibilityAccepted, setResponsibilityAccepted] = useState(false);
    const currentApplicants = BigInt(mockAcceptedUsers.length);
    const maxApplicants = BigInt(Number(job?.jobSlots || 0));
    const isApplicationClosed = currentApplicants >= maxApplicants;

    const [appliers, setAppliers] = useState<User[]>([])

    useEffect(() => {
        if (jobId) {
            getJobApplier(jobId).then((users) => {
                setAppliers(users);
            });
        }
    }, [jobId]);

    useEffect(() => {
        setLoading(true);
        const userData = localStorage.getItem("current_user");
        const parsedData = JSON.parse(userData ? userData : "");
        if (userData) {
            // Check if current user is the job owner
            if (job && job.userId === parsedData.ok.id) {
                setIsOwner(true);

            }
        }

        const checkApplied = async () => {
            if (!current_user) return;
            // Check if user has already applied to this job
            // const hasApplied = await checkIfUserApplied(jobId, current_user.id);
            // setApplied(hasApplied);
            const result = await hasUserApplied(parsedData.ok.id, jobId!);
            setApplied(result);
        };
        checkApplied();
        setLoading(false);
    }, [job]);

  const fetchHistorySubmission = useCallback(async () => {
    if (!jobId) {
      setError("Job ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userData = localStorage.getItem("current_user");
      const parsedData = JSON.parse(userData ? userData : "");
      getAllSubmissionbyUserJobId(parsedData.ok, jobId).then((res) => {
        setSubmission(res)
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    } catch (err) {
      console.error("Error fetching submission:", err);
      setError("Failed to load job details");
    } finally {
      setError("");
      setLoading(false);
    }
  }, [jobId])

  useEffect(() => {
    fetchHistorySubmission();
  }, [fetchHistorySubmission]);

  const jobDetails = useMemo(() => {
    if (!job) return null;

    const fetchJob = useCallback(async () => {
        if (!jobId) {
            setError("Job ID is missing");
            setLoading(false);
            return;
        }


        try {
            setLoading(true);
            const jobData = await getJobById(jobId);
            console.log(jobData);
            if (jobData) {
                setJob(jobData);
            } else {
                setError("Job not found");
            }
        } catch (err) {
            console.error("Error fetching job:", err);
            setError("Failed to load job details");
        } finally {
            setError("");
            setLoading(false);
        }
    }, [jobId]);

    useEffect(() => {
        fetchJob();
    }, [fetchJob]);

    


  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [additionalMessage, setAdditionalMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
        setErrorMessage(null);
      } else {
        setFile(null);
        setError('Please upload a valid ZIP file.');
      }
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalMessage(event.target.value);
  };

  const makeSubmission = () => {
    if (file == null) {
      setErrorMessage("Please submit your file!")
      return;
    }
    const fileBlob = new Blob([file], { type: file.type });
    const userData = localStorage.getItem("current_user");
    const parsedData = JSON.parse(userData ? userData : "");
    console.log(parsedData.ok)
    if (jobId) {
      createSubmission(jobId, parsedData.ok, fileBlob, additionalMessage).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })

      fetchHistorySubmission();

    } else {
      console.log("no job id")
    }

  }

  //   if (loading) {
  //     return (
  //       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
  //         <motion.div
  //           className="w-16 h-16 border-4 border-transparent border-b-indigo-500 rounded-full"
  //           animate={{ rotate: 360 }}
  //           transition={{
  //             duration: 1,
  //             repeat: Infinity,
  //             ease: "linear",
  //           }}
  //         />
  //       </div>
  //     );
  //   }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navbar />
        <div className="container mx-auto px-4 mt-6 text-center py-20">
          <h1 className="text-2xl text-red-500">{error}</h1>
        </div>
        <Footer />
      </div>
    );
  }
  const jobDetails = useMemo(() => {
        if (!job) return null;
        return {
            salary: job.jobSalary.toLocaleString(),
            rating: job.jobRating.toFixed(1),
            postedDate: new Date(Number(job.createdAt)).toLocaleDateString(),
        };
    }, [job]);

    // handle apply button click
    const handleApply = useCallback(async () => {
        setLoading(true);
        const userData = localStorage.getItem("current_user");
        if (!userData) {
            console.error("User data not found");
            setLoading(false);
            return;
        }

        try {
            const parsedData = JSON.parse(userData);
            const result = await applyJob(parsedData.ok.id, jobId!);
            if (result) {
                console.log("Applied for the job");
                setApplied(true);
            } else {
                console.error("Failed to apply for the job");
            }
        } catch (err) {
            console.error("Error applying for job:", err);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    //   if (loading) {
    //     return (
    //       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    //         <motion.div
    //           className="w-16 h-16 border-4 border-transparent border-b-indigo-500 rounded-full"
    //           animate={{ rotate: 360 }}
    //           transition={{
    //             duration: 1,
    //             repeat: Infinity,
    //             ease: "linear",
    //           }}
    //         />
    //       </div>
    //     );
    //   }


      
    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <Navbar />
                <div className="container mx-auto px-4 mt-6 text-center py-20">
                    <h1 className="text-2xl text-red-500">{error}</h1>

                </div>
                <Footer />
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {loading && <LoadingOverlay message="Loading Job..." />}
            <Navbar />

            {/* Accepted Users Modal */}
            {showAcceptedUsersModal && (
                <AcceptedUsersModal
                    users={appliers}
                    onClose={() => setShowAcceptedUsersModal(false)}
                />
            )}

            <motion.div
                className="container mx-auto px-4 mt-6 flex-grow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Section (2/3 width) */}
                    <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
                        {/* Job Header */}
                        <div className="mb-8">
                            <motion.h1
                                className="text-3xl font-bold text-indigo-800 mb-4"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                            >
                                {job.jobName}
                            </motion.h1>
                            <div className="mt-8 border-t pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                                            Current Applicants
                                        </h3>
                                        <p className="text-gray-600">
                                            {currentApplicants.toString()} /{" "}
                                            {maxApplicants.toString()} positions filled
                                        </p>
                                    </div>
                                    <motion.div
                                        className="flex -space-x-3 cursor-pointer"
                                        onClick={() => setShowAcceptedUsersModal(true)}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {appliers.slice(0, 3).map((user, index) => (
                                            <div
                                                key={user.id}
                                                className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold"
                                                style={{ zIndex: 3 - index }}
                                            >
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                        {appliers.length > 3 && (
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-white text-sm">
                                                +{appliers.length - 3}
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <motion.div
                            className="mb-8 bg-blue-50/30 p-6 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-indigo-500" />
                                Job Description
                            </h2>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {job.jobDescription.map((desc, index) => (
                                    <li key={index}>{desc}</li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right Section (1/3 width) */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 h-fit sticky top-6">
                        <div className="space-y-6">
                            {/* Reward Section */}
                            <div className="bg-blue-50/30 p-4 rounded-xl">
                                <h3 className="text-3xl font-semibold text-indigo-800 mb-2">
                                    Job Reward
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-green-600">
                                        ${jobDetails?.salary}/person
                                    </span>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="mt-1 w-5 h-5 accent-indigo-500"
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-700">
                                        I have fully understood and meet all job requirements
                                    </label>
                                </div>

                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="responsibility"
                                        checked={responsibilityAccepted}
                                        onChange={(e) =>
                                            setResponsibilityAccepted(e.target.checked)
                                        }
                                        className="mt-1 w-5 h-5 accent-indigo-500"
                                    />
                                    <label
                                        htmlFor="responsibility"
                                        className="text-sm text-gray-700"
                                    >
                                        I apply to this job voluntarily and take full responsibility
                                    </label>
                                </div>
                            </div>


                            {/* Application Status */}
                            {isApplicationClosed ? (
                                <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm">
                                    ❌ This job has reached the maximum number of applicants
                                </div>
                            ) : (
                                <div className="bg-green-50 p-4 rounded-xl text-green-600 text-sm">
                                    ✅ {(maxApplicants - currentApplicants).toString()} positions
                                    remaining
                                </div>
                            )}

                            {/* Apply Button */}
                            <motion.button
                                className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 ${isOwner ||
                                        !termsAccepted ||
                                        !responsibilityAccepted ||
                                        isApplicationClosed ||
                                        applied
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                    }`}
                                disabled={
                                    isOwner ||
                                    !termsAccepted ||
                                    !responsibilityAccepted ||
                                    isApplicationClosed ||
                                    applied
                                }
                                whileHover={!isOwner || applied ? { scale: 1.02 } : undefined}
                                whileTap={!isOwner || applied ? { scale: 0.98 } : undefined}
                                onClick={() => handleApply()}
                            >
                                {isOwner
                                    ? "You are the job owner"
                                    : applied
                                        ? "Applied"
                                        : "Apply"}
                            </motion.button>

                            {/* Info Text */}
                            <p className="text-xs text-gray-500 text-center">
                                By applying, you agree to our terms of service and privacy
                                policy
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Footer />
        </div>



        {/* Ongoing Section */}
        {job.jobStatus === "Ongoing" && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Section (2/3 width) */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
              {/* History Header */}
              <div className="mb-8">
                <motion.h1
                  className="text-3xl font-bold text-indigo-800 mb-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  History Submission
                </motion.h1>
                <div className="mt-8 border-t pt-6">
                  <div className="flex flex-col items-center justify-between">
                    {submission.length === 0 ? (
                      <motion.div
                        className="w-full flex flex-col items-center justify-center py-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Inbox className="w-16 h-16 text-indigo-300 mb-4" />
                        <h3 className="text-xl font-semibold text-indigo-800 mb-2">No submissions yet</h3>
                        <p className="text-gray-600 max-w-md">
                          Your submission history will appear here once you've made your first submission.
                        </p>
                      </motion.div>
                    ) : (
                      submission.map((sub) => (
                        <HistorySubmissionCard key={sub.id} submission={sub} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section (1/3 width) */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 h-fit sticky top-6 border border-indigo-100">
              <div className="space-y-6">
                {/* Reward Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
                  <h3 className="text-3xl font-bold text-indigo-800 mb-2 tracking-tight">
                    Submit Your Task
                  </h3>
                  <p className="text-sm text-indigo-600 opacity-80">
                    Please upload your completed work as a ZIP file
                  </p>
                </div>

                <div className="space-y-4">
                  {/* New Message Input Section */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      onChange={handleMessageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      placeholder="Add any additional notes or comments about your submission..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      You must zip the files you want to submit
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="relative w-full">
                      <input
                        type="file"
                        accept=".zip"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center border-2 border-dashed border-indigo-200 rounded-lg p-3 hover:border-indigo-400 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {file ? file.name : 'Select ZIP file'}
                        </span>
                      </div>
                    </div>

                    <button
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={makeSubmission}
                    >
                      Submit
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {file && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">File selected: {file.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </motion.div>
      <Footer />
    </div>
  );

}