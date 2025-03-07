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
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  getAcceptedFreelancer,
  getJobApplier,
  getJobById,
  startJob,
} from "../../controller/jobController";
import { authUtils } from "../../utils/authUtils";
import { User } from "../../interface/User";
import { Job } from "../../interface/job/Job";
import {
  acceptApplier,
  applyJob,
  hasUserApplied,
  rejectApplier,
} from "../../controller/applyController";
import LoadingOverlay from "../../components/ui/loading-animation";
import { ApplierPayload } from "../../interface/Applier";
import OngoingSection from "../../components/sections/OngoingSection";

import { JobDetailContent } from "./JobDetailContent";
import { ApplicantActions } from "./ApplicationActions";
import { OwnerActions } from "./OwnerActions";
import { ApplicantsModal } from "./ApplicationModal";
import ManageJobDetailPage from "./SubmissionSection";
import Modal from "./startModal";

// Mock data for accepted users - replace with actual data fetching
const mockAcceptedUsers: User[] = [
  // {
  //   id: "550e8400-e29b-41d4-a716-446655440000",
  //   profilePicture: new Blob(),
  //   username: "CloudExpertSarah",
  //   dob: "1985-04-12",
  //   description:
  //     "AWS Certified Solutions Architect with 8+ years experience in cloud infrastructure design and implementation.",
  //   wallet: 24500,
  //   rating: 4.9,
  //   createdAt: BigInt(new Date("2018-03-15").getTime() * 1e6), // Convert to nanoseconds
  //   updatedAt: BigInt(new Date("2023-07-01").getTime() * 1e6),
  //   isFaceRecognitionOn: true,
  // },
  // {
  //   id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  //   profilePicture: new Blob(),
  //   username: "FullStackDevMike",
  //   dob: "1992-11-30",
  //   description:
  //     "React/Node.js specialist focused on building scalable web applications with modern best practices.",
  //   wallet: 18250,
  //   rating: 4.7,
  //   createdAt: BigInt(new Date("2019-08-22").getTime() * 1e6),
  //   updatedAt: BigInt(new Date("2023-06-15").getTime() * 1e6),
  //   isFaceRecognitionOn: false,
  // },
  // {
  //   id: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
  //   profilePicture: new Blob(),
  //   username: "DistributedSystemsJane",
  //   dob: "1988-07-17",
  //   description:
  //     "Microservices and Kubernetes expert with strong background in high-availability systems.",
  //   wallet: 31200,
  //   rating: 4.95,
  //   createdAt: BigInt(new Date("2017-05-10").getTime() * 1e6),
  //   updatedAt: BigInt(new Date("2023-07-10").getTime() * 1e6),
  //   isFaceRecognitionOn: true,
  // },
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
                  {new Date(Number(user?.createdAt / 1_000_000n)).toLocaleDateString()}
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
  
  const [appliers, setAppliers] = useState<ApplierPayload[]>([]);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  
  const [acceptedAppliers, setAccAppliers] = useState<User[]>([]);
  const currentApplicants = BigInt(acceptedAppliers.length);
  const maxApplicants = BigInt(Number(job?.jobSlots || 0));
  const isApplicationClosed = currentApplicants >= maxApplicants;
  // ka
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);

  const handleClose = () => {
    setIsModalOpen(false); // Close the modal
};

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

  const handleAccept = async (userid: string): Promise<void> => {
    if (jobId) {
      await acceptApplier(userid, jobId);
      getJobApplier(jobId).then((users) => {
        setAppliers(users);
      });
      getAcceptedFreelancer(jobId).then((users) => {
        setAccAppliers(users);
      });
    }
  };

  useEffect(() => {
    if (jobId) {
        getAcceptedFreelancer(jobId).then((users) => {
            setAccAppliers(users);
        });
        getJobApplier(jobId).then((users) => {
          setAppliers(users);
        });
    }
  }, [jobId])

  const handleReject = async (userid: string): Promise<void> => {
    if (jobId) {
      await rejectApplier(userid, jobId);
      getJobApplier(jobId).then((users) => {
        setAppliers(users);
      });
      getAcceptedFreelancer(jobId).then((users) => {
        setAccAppliers(users);
      });
    }
  };

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

  const handleStart = () => {
    // Start the job
    setIsModalOpen(true)
    const length = acceptedAppliers.length
    const amount = Number.parseFloat(jobDetails!.salary) * length;
    setRequiredAmount(amount)
  };

  if (!job) return null;



const handlePay = async() => {
    setIsModalOpen(false);
    if (jobId) {
        const userData = localStorage.getItem("current_user");
        const parsedData = JSON.parse(userData ? userData : "");
        if (userData && jobDetails) {
            const length = acceptedAppliers.length
            const amount = Number.parseFloat(jobDetails.salary) * length;
            await startJob(parsedData.ok.id, jobId, amount)
        }

        }
    };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {loading && <LoadingOverlay message="Loading Job..." />}
      <Navbar />

      {showAcceptedUsersModal && (
        <AcceptedUsersModal
          users={acceptedAppliers}
          onClose={() => setShowAcceptedUsersModal(false)}
        />
      )}

      {showApplicantsModal && (
        <ApplicantsModal
          appliers={appliers}
          onClose={() => setShowApplicantsModal(false)}
          handleAccept={handleAccept}
          handleReject={handleReject}
        />
      )}

      <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                onPay={handlePay}
                amount={requiredAmount}
                />


      <motion.div className="container mx-auto px-4 mt-6 flex-grow">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
              Job Detail
            </h1>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <JobDetailContent 
            onOpen={() => setShowAcceptedUsersModal(true)}
            job={job}
            currentApplicants={currentApplicants}
            maxApplicants={maxApplicants} 
            acceptedAppliers={acceptedAppliers}
          />

          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 h-fit sticky top-6">
            {isOwner ? (
              <OwnerActions
                job={job}
                appliersCount={appliers.length}
                onViewApplicants={() => setShowApplicantsModal(true)}
                onStartJob={handleStart}
              />
            ) : (
              <ApplicantActions
                salary={jobDetails?.salary || ""}
                termsAccepted={termsAccepted}
                responsibilityAccepted={responsibilityAccepted}
                isApplicationClosed={isApplicationClosed}
                remainingPositions={(maxApplicants - currentApplicants).toString()}
                applied={applied}
                onApply={handleApply}
                onTermsChange={setTermsAccepted}
                onResponsibilityChange={setResponsibilityAccepted}
              />
            )}
          </div>
        </div>

        {job.jobStatus === "Ongoing" && !isOwner && (
          <OngoingSection jobId={job.id} />
        )}


        {isOwner && job.jobStatus === "Ongoing" &&(
          <ManageJobDetailPage jobId={job.id} />
        )}
      </motion.div>
      
      <Footer />
    </div>
  );
}