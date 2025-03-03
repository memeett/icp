import { useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { BiSlider } from 'react-icons/bi';
import { AiOutlineFolder, AiOutlineHeart, AiOutlineLike } from 'react-icons/ai';
import { IoLocationOutline } from 'react-icons/io5';
import { BsCheckCircleFill, BsStar, BsStarFill } from 'react-icons/bs';
import Navbar from '../../components/Navbar';
import { ModalProvider } from '../../contexts/modal-context';
import { AuthenticationModal } from '../../components/modals/AuthenticationModal';
import { getAllUsers } from '../../controller/userController';

interface JobCategory {
    id: string;
    jobCategoryName: string;
}

interface Job {
    id: string;
    jobName: string;
    jobDescription: string[];
    jobSalary: number;
    jobRating: number;
    jobTags: JobCategory[];
    jobSlots: number;
    createdAt: number;
    updatedAt: number;
}

export default function SearchPage() {
  useEffect(() => {
    const getFreelancers = async () => {
        try {
            const users = await getAllUsers();
            console.log("Users:", users);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };
    getFreelancers();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');

  const jobs: Job[] = [
    {
      id: "1",
      jobName: "Senior Frontend Developer",
      jobDescription: [
        "We are looking for an experienced Frontend Developer",
        "Must have strong knowledge in React and TypeScript",
        "5+ years of experience required"
      ],
      jobSalary: 8000,
      jobRating: 4.5,
      jobTags: [
        { id: "1", jobCategoryName: "React" },
        { id: "2", jobCategoryName: "TypeScript" },
        { id: "3", jobCategoryName: "Frontend" }
      ],
      jobSlots: 2,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    // Add more jobs as needed
  ];

  return (
    <ModalProvider>
        <Navbar />
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex items-center gap-4 mb-6">

      </div>

      {/* Save Search and Saved Jobs */}
      <div className="flex justify-between mb-8">
        <button className="flex items-center gap-2 text-green-600 hover:text-green-700 transition duration-200">
          <AiOutlineFolder />
          <span>Save search</span>
        </button>
        <button className="flex items-center gap-2 text-green-600 hover:text-green-700 transition duration-200">
          <AiOutlineHeart />
          <span>Saved jobs</span>
        </button>
      </div>

      {/* Job Posts */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-300 cursor-pointer group">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <h2 className="text-xl font-semibold mt-1 group-hover:text-green-600 transition duration-200">
                  {job.jobName}
                </h2>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-gray-200 hover:bg-green-50 hover:border-green-500 transition duration-200">
                  <AiOutlineLike className="group-hover:text-green-600" />
                </button>
                <button className="p-2 rounded-full border border-gray-200 hover:bg-green-50 hover:border-green-500 transition duration-200">
                  <AiOutlineHeart className="group-hover:text-green-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(job.jobRating) ? 
                    <BsStarFill key={i} className="text-yellow-400" /> : 
                    <BsStar key={i} className="text-gray-300" />
                ))}
                <span className="ml-1">{job.jobRating}</span>
              </div>
              <span className="text-green-600">Slots: {job.jobSlots}</span>
              <span className="text-green-600">${job.jobSalary}/month</span>
            </div>

            <div className="mb-4">
              {job.jobDescription.map((desc, index) => (
                <p key={index} className="text-gray-700 mb-2">• {desc}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {job.jobTags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-4 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-green-100 hover:text-green-700 transition duration-200"
                >
                  {tag.jobCategoryName}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <AuthenticationModal />
    </ModalProvider>
  );
};