import { MotionValue } from "motion";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GlareCard from "./GlareCard";

interface ProfileCardProps {
  id: string;
  name: string;
  category: string;
  jobsCompleted: number;
  profileImage: string;
}

export const ProfileCard = ({
  id,
  name,
  category,
  jobsCompleted,
  profileImage,
}: ProfileCardProps) => {
  const nav = useNavigate();
  return (
    <GlareCard>
      <div className="w-full h-[50%] overflow-hidden rounded-t-xl">
        <img
          src={profileImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>


      <div className="group relative text-left w-full pl-4 pt-2">
        <h3 className="text-xl font-bold text-gray-800 transition-colors duration-200 w-full">
          <a
            href={`/profile/${id}`}
            onClick={() => nav(`/profile/${id}`)}
            className="before:absolute before:inset-0 before:z-10 hover:text-blue-600 hover:underline"
          >
            {name}
          </a>
        </h3>
        <span className="text-sm text-gray-500">{category}</span>
      </div>

      <div className="mt-4 w-full text-left pl-4">
        <p className="text-sm font-semibold text-gray-700">
          {jobsCompleted}+ Jobs Completed
        </p>
      </div>
    </GlareCard>
  );
};
