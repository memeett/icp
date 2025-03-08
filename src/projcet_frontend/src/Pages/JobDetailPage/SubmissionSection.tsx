import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FiCheck, FiDownload, FiX } from "react-icons/fi";
import { getJobDetail } from "../../controller/jobController";
import { Job } from "../../interface/job/Job";
import { User } from "../../interface/User";
import { Submission } from "../../../../declarations/submission/submission.did";
import {
  getSubmissionByJobId,
  updateSubmissionStatus,
} from "../../controller/submissionController";
import { createInbox } from "../../controller/inboxController";

export default function ManageJobDetailPage({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");

  // State untuk modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchData = async (jobId: string) => {
      try {
        const job = await getJobDetail(jobId);
        const submissions = await getSubmissionByJobId(jobId);
        setSubmissions(submissions);
        setJob(job);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    jobId && fetchData(jobId);
  }, [jobId]);

  // Handle scroll dan overlay
  useEffect(() => {
    if (showDetailModal || showRejectModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
    }
  }, [showDetailModal, showRejectModal]);

  const handleAccept = async (submission: Submission) => {
    try {
      await updateSubmissionStatus(submission.id, "Accepted", "");
      setSubmissions(submissions.map(sub =>
        sub.id === submission.id ? { ...sub, status: "Accepted" } : sub
      ));
      job && await createInbox(submission.user.id, job.userId, "submission", "accepted");
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const handleRejectClick = (submission: Submission, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedApplication(submission);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedApplication) return;

    try {
      await updateSubmissionStatus(selectedApplication.id, "Rejected", rejectMessage);
      setSubmissions(submissions.map(sub =>
        sub.id === selectedApplication.id ? { ...sub, status: "Rejected" } : sub
      ));
      job && await createInbox(selectedApplication.id, job.userId, "submission", "rejected");
      setShowRejectModal(false);
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="max-w-2xl w-full mx-4 bg-white rounded-2xl shadow-xl">
            <div className="space-y-6 px-8 pt-8 pb-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-800">Submission Details</h3>
                <p className="mt-2 text-gray-600">Applicant: {selectedSubmission.user.username}</p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full ${selectedSubmission.submissionStatus.toLowerCase() === "accepted"
                    ? "bg-green-100 text-green-800"
                    : selectedSubmission.submissionStatus.toLowerCase() === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {selectedSubmission.submissionStatus}
                  </span>
                </div>

                {selectedSubmission.submissionMessage && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Message</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {selectedSubmission.submissionMessage}
                    </p>
                  </div>
                )}

                {selectedSubmission.submissionFile && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-center"
                  >
                    <a
                      href={URL.createObjectURL(new Blob([new Uint8Array(selectedSubmission.submissionFile)]))}
                      download={`submission-${selectedSubmission.id}.zip`}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      <FiDownload className="w-5 h-5" />
                      Download Submission
                    </a>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="border-t py-4 flex justify-center">
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="max-w-md w-full mx-4 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Application</h3>
            <textarea
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Reason for rejection..."
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 flex-1"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
              Job Submissions
            </h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Applicant</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Username</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                    {/* Conditionally render the Actions column header */}
                    {job?.jobStatus !== "Finished" && (
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {submissions.length === 0 ? (
                    // Display this row if there are no submissions
                    <tr>
                      <td colSpan={job?.jobStatus === "Finished" ? 3 : 4} className="px-6 py-4 text-center text-gray-500">
                        No submissions have been made.
                      </td>
                    </tr>
                  ) : (
                    // Display submissions if they exist
                    submissions.map((application) => (
                      <tr
                        key={application.id}
                        onClick={() => {
                          setSelectedSubmission(application);
                          setShowDetailModal(true);
                        }}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                              {application.user.profilePicture && (
                                <img
                                  src={URL.createObjectURL(
                                    new Blob([new Uint8Array(application.user.profilePicture)])
                                  )}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <span className="font-medium text-gray-900">
                              {application.user.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{application.user.username}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${application.submissionStatus.toLowerCase() === "accepted"
                            ? "bg-green-100 text-green-800"
                            : application.submissionStatus.toLowerCase() === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {application.submissionStatus}
                          </span>
                        </td>
                        {/* Conditionally render the Actions column cell */}
                        {job?.jobStatus !== "Finished" && (
                          <td className="px-6 py-4">
                            {application.submissionStatus.toLowerCase() === "waiting" && (
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAccept(application);
                                  }}
                                  className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                                >
                                  <FiCheck className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={(e) => handleRejectClick(application, e)}
                                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                                >
                                  <FiX className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>

    </div>
  );
}