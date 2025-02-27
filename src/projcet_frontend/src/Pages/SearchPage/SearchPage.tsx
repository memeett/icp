import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { BiSlider } from 'react-icons/bi';
import { AiOutlineFolder, AiOutlineHeart, AiOutlineLike } from 'react-icons/ai';
import { IoLocationOutline } from 'react-icons/io5';
import { BsCheckCircleFill, BsStar, BsStarFill } from 'react-icons/bs';

interface JobPost {
  id: number;
  title: string;
  timePosted: string;
  paymentVerified: boolean;
  rating: number;
  spent: string;
  location: string;
  price: string;
  level: string;
  budget: string;
  description: string;
  skills: string[];
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const jobPosts: JobPost[] = [
    {
      id: 1,
      title: 'HTML Code Integration for Google Search Console',
      timePosted: '2 minutes ago',
      paymentVerified: true,
      rating: 4.2,
      spent: '$200K+',
      location: 'United Kingdom',
      price: 'Fixed price',
      level: 'Intermediate',
      budget: '$10.00',
      description: 'We are looking for a skilled freelancer to add HTML code to our website to verify it with Google Search Console. The ideal candidate will have a strong understanding of HTML, website structure, and SEO principles. You will be responsible for ensuring the code is correctly implemented to facilitate smooth...',
      skills: ['HTML', 'JavaScript', 'PHP', 'CSS', 'WordPress']
    },

  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="front end developer"
            className="w-full px-12 py-3 rounded-full border border-gray-300"
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          {searchQuery && (
            <FiX
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer"
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>
        <button className="flex items-center gap-2 text-green-600">
          <BiSlider className="text-xl" />
          <span>Advanced search</span>
        </button>
      </div>

      {/* Save Search and Saved Jobs */}
      <div className="flex justify-between mb-8">
        <button className="flex items-center gap-2 text-green-600">
          <AiOutlineFolder />
          <span>Save search</span>
        </button>
        <button className="flex items-center gap-2 text-green-600">
          <AiOutlineHeart />
          <span>Saved jobs</span>
        </button>
      </div>

      {/* Job Posts */}
      <div className="space-y-6">
        {jobPosts.map((job) => (
          <div key={job.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">Posted {job.timePosted}</p>
                <h2 className="text-xl font-semibold mt-1">{job.title}</h2>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-gray-200">
                  <AiOutlineLike />
                </button>
                <button className="p-2 rounded-full border border-gray-200">
                  <AiOutlineHeart />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              {job.paymentVerified && (
                <div className="flex items-center gap-1">
                  <BsCheckCircleFill className="text-green-600" />
                  <span>Payment verified</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(job.rating) ? 
                    <BsStarFill key={i} className="text-yellow-400" /> : 
                    <BsStar key={i} className="text-gray-300" />
                ))}
                <span>{job.rating}</span>
              </div>
              <span>{job.spent} spent</span>
              <div className="flex items-center gap-1">
                <IoLocationOutline />
                <span>{job.location}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              {job.price} - {job.level} - Est. budget: {job.budget}
            </p>

            <p className="text-gray-700 mb-4">{job.description}</p>

            <div className="flex gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-1 bg-gray-100 rounded-full text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
