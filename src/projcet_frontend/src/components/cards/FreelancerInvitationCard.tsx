import { motion } from "framer-motion";
import { UserInvitationPayload } from "../../../../declarations/invitation/invitation.did";

export default function FreelancerInvitationCard({ invitation }: { invitation: UserInvitationPayload }) {
    const invitedAtDate = new Date(Number(invitation.invitedAt));

    // Format the date to a human-readable string
    const formattedDate = invitedAtDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-purple-100 mb-4 hover:shadow-lg transition-shadow duration-300"
        >
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                            {invitation.job.jobName}
                        </h2>
                        <div className="flex items-center text-gray-500 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {formattedDate}
                        </div>
                    </div>
                  
                </div>

                
                <div className="mt-4 flex space-x-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 flex-1">
                        Accept
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 flex-1">
                        Decline
                    </button>
                </div>
            </div>
        </motion.div>
    );
}