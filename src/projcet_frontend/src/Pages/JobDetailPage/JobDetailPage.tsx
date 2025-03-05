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
import { ResponseSubmission } from "../../../../declarations/submission/submission.did";
import HistorySubmissionCard from "../../components/cards/HistorySubmissionCard";
import OngoingSection from "../../components/sections/OngoingSection";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showAcceptedUsersModal, setShowAcceptedUsersModal] = useState(false);
  const { current_user } = authUtils();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [responsibilityAccepted, setResponsibilityAccepted] = useState(false);
  const currentApplicants = BigInt(0); // Replace with actual data
  const maxApplicants = BigInt(Number(job?.jobSlots || 0));
  const isApplicationClosed = currentApplicants >= maxApplicants;

  const [appliers, setAppliers] = useState<User[]>([]);

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
      if (job && job.userId === parsedData.ok.id) {
        setIsOwner(true);
      }
    }

    const checkApplied = async () => {
      if (!current_user) return;
      const result = await hasUserApplied(parsedData.ok.id, jobId!);
      setApplied(result);
    };
    checkApplied();
    setLoading(false);
  }, [job]);

  

  const fetchJob = useCallback(async () => {
    if (!jobId) {
      setError("Job ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const jobData = await getJobById(jobId);
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

  const jobDetails = useMemo(() => {
    if (!job) return null;
    return {
      salary: job.jobSalary.toLocaleString(),
      rating: job.jobRating.toFixed(1),
      postedDate: new Date(Number(job.createdAt)).toLocaleDateString(),
    };
  }, [job]);

  

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

        {/* Ongoing Section */}
        {job.jobStatus === "Ongoing" && (
          <OngoingSection jobId={job.id} />
        )}
      </motion.div>
      <Footer />
    </div>
  );
}