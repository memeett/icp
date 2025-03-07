import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { User } from "../../interface/User";
import { Job } from "../../interface/job/Job";

export const JobDetailContent = ({
  job,
  currentApplicants,
  maxApplicants,
  acceptedAppliers,
  onOpen,
}: {
  job: Job;
  currentApplicants: bigint;
  maxApplicants: bigint;
  acceptedAppliers: User[];
  onOpen: () => void;
}) => {
  // const [showAcceptedUsersModal, setShowAcceptedUsersModal] = useState(false);

  const mockAcceptedUsers: User[] = acceptedAppliers;

  return (
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
                {acceptedAppliers.length} / {maxApplicants.toString()} positions
                filled
              </p>
            </div>
            <motion.div
              className="flex -space-x-3 cursor-pointer"
              onClick={onOpen}
              whileHover={{ scale: 1.05 }}
            >
              {mockAcceptedUsers.slice(0, 3).map((user, index) => (
                <div
                  key={user.id}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold"
                  style={{ zIndex: 3 - index }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              ))}
              {mockAcceptedUsers.length > 3 && (
                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-white text-sm">
                  +{mockAcceptedUsers.length - 3}
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
  );
};
