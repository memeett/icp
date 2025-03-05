// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import { FiCheck, FiX } from "react-icons/fi";
// import { getJobDetail } from "../../controller/jobController";
// import { Job } from "../../interface/job/Job";
// import { User } from "../../interface/User";

// interface Submission {
//   id: string;
//   user: User;
//   jobId: string;
//   status: "pending" | "accepted" | "rejected";
//   message?: string;
//   submissionFile?: string;
// }

// export default function ManageJobDetailPage() {
//   const { jobId } = useParams();
//   const [job, setJob] = useState<Job | null>(null);
//   const [applications, setApplications] = useState<Submission[]>([]);
//   const [applicants, setApplicants] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [rejectMessage, setRejectMessage] = useState("");
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async (jobId: string) => {
//       setLoading(true);
//       try {

//         const job = await getJobDetail(jobId);
//         const applications = await getJobApplications(jobId);
//         const applicantsData = await getApplicantsData(applications.map(app => app.userId));

//         if (job) {
//           setJob({
//             ...job,
//             createdAt: job.createdAt,
//             updatedAt: job.updatedAt,
//             jobSlots: BigInt(job.jobSlots),
//           });
          
//           // Combine applications with user data
//           const enhancedApplications = applications.map(app => ({
//             ...app,
//             user: applicantsData.find(user => user.id === app.userId)!
//           }));
          
//           setApplications(enhancedApplications);
//           setApplicants(applicantsData);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (jobId) {
//       fetchData(jobId);
//     }
//   }, [jobId]);

//   const handleAccept = async (applicationId: string) => {
//     try {
//       // Implement your accept logic here
//       // await acceptApplication(applicationId);
//       setApplications(applications.map(app => 
//         app.id === applicationId ? { ...app, status: "accepted" } : app
//       ));
//     } catch (error) {
//       console.error("Error accepting application:", error);
//     }
//   };

//   const handleReject = async (applicationId: string) => {
//     setSelectedApplication(applicationId);
//     setShowRejectModal(true);
//   };

//   const confirmReject = async () => {
//     if (!selectedApplication) return;
    
//     try {
//       setApplications(applications.map(app => 
//         app.id === selectedApplication ? { ...app, status: "rejected", message: rejectMessage } : app
//       ));
//       setShowRejectModal(false);
//       setRejectMessage("");
//       setSelectedApplication(null);
//     } catch (error) {
//       console.error("Error rejecting application:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//       <Navbar />
      
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="container mx-auto px-6 py-8"
//       >
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
//           </div>
//         ) : (
//           <>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
//               Job Applications
//             </h1>

//             <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Applicant</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Username</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rating</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {applications.map((application) => (
//                     <tr key={application.id} className="border-b border-gray-100 hover:bg-white/50">
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div className="flex items-center space-x-3">
//                           <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
//                             {/* Handle profile picture display safely */}
//                             {application.user.profilePicture && (
//                               <img 
//                                 src={URL.createObjectURL(application.user.profilePicture)}
//                                 alt="Profile"
//                                 className="h-full w-full object-cover"
//                               />
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">{application.user.username}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           application.status === "accepted" ? "bg-green-100 text-green-800" :
//                           application.status === "rejected" ? "bg-red-100 text-red-800" :
//                           "bg-yellow-100 text-yellow-800"
//                         }`}>
//                           {application.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {application.user.rating.toFixed(1)}
//                       </td>
//                       <td className="px-6 py-4">
//                         {application.status === "pending" && (
//                           <div className="flex space-x-3">
//                             <button
//                               onClick={() => handleAccept(application.id)}
//                               className="text-green-500 hover:text-green-700"
//                             >
//                               <FiCheck className="h-5 w-5" />
//                             </button>
//                             <button
//                               onClick={() => handleReject(application.id)}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               <FiX className="h-5 w-5" />
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </motion.div>

//       {/* Reject Modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h3 className="text-lg font-semibold mb-4">Reject Application</h3>
//             <textarea
//               className="w-full p-2 border rounded-lg mb-4"
//               rows={4}
//               placeholder="Enter rejection reason..."
//               value={rejectMessage}
//               onChange={(e) => setRejectMessage(e.target.value)}
//             />
//             <div className="flex justify-end space-x-3">
//               <button
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                 onClick={() => setShowRejectModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 onClick={confirmReject}
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }
