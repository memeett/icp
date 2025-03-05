import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, DollarSign, Users } from "lucide-react";
import { addIncrementUserClicked } from "../controller/userClickedController";
import { Job } from "../interface/job/Job";

export default function JobCard({ job }: { job: Job }) {
  const nav = useNavigate();

  const viewDetails = useCallback(() => {
    addIncrementUserClicked(job.id);
    nav("/jobs/" + job.id);
  }, [nav, job.id]);

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(128, 90, 213, 0.1)",
      }}
      className="bg-white/70 backdrop-blur-sm 
                border border-purple-100/50 
                rounded-xl 
                overflow-hidden 
                shadow-sm 
                transition-all 
                duration-300 
                hover:border-purple-200
                w-full"
    >
      <div className="p-6">
        {/* Job Title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center truncate">
            <Briefcase
              className="mr-3 text-purple-500 flex-shrink-0"
              size={24}
            />
            <span className="truncate">{job.jobName}</span>
          </h3>
          {/* Optional: Job Tag/Category Chip */}
          {job.jobTags && job.jobTags.length > 0 && (
            <span
              className="text-xs font-medium 
                            bg-purple-100 text-purple-700 
                            px-3 py-1 rounded-full ml-2"
            >
              {job.jobTags[0].jobCategoryName}
            </span>
          )}
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-gray-600">
          <div className="flex items-center">
            <DollarSign className="mr-2 text-green-500" size={20} />
            <span className="font-medium">{job.jobSalary}$</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 text-blue-500" size={20} />
            <span className="font-medium">{Number(job.jobSlots)} Slots</span>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Job Description
          </h4>
          <ul className="text-gray-600 space-y-1 text-sm">
            {job.jobDescription.slice(0, 2).map((desc, index) => (
              <li key={index} className="flex items-center overflow-hidden">
                <span className="w-2 h-2 mr-2 bg-purple-300 rounded-full flex-shrink-0"></span>
                <span className="truncate">{desc}</span>
              </li>
            ))}
            {job.jobDescription.length > 2 && (
              <li className="text-xs text-gray-500">
                + {job.jobDescription.length - 2} more details
              </li>
            )}
          </ul>
        </div>

        {/* View Details Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={viewDetails}
          className="w-full flex items-center justify-center 
                        bg-gradient-to-r from-purple-500 to-blue-500 
                        text-white 
                        py-3 
                        rounded-lg 
                        hover:from-purple-600 hover:to-blue-600 
                        transition-all 
                        duration-300"
        >
          View Details
          <ArrowRight className="ml-2" size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}
