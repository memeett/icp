import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaMapMarkerAlt, FaMoneyBillWave, FaUsers, FaCalendarAlt } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ModalProvider } from "../../contexts/modal-context";
import { Job } from "../../interface/job/Job";
import { formatDistanceToNow } from "date-fns";

// Mock data retrieval function - replace with your actual data fetching
const getJobById = (id: string): Job | undefined => {
  const allJobs = [

    { id: "1", jobName: "Software Engineer", jobTags: [{ id: "1", jobCategoryName: "Full-time" }], jobRating: 4.6, jobSalary: 75000, jobDescription: ["Develop software solutions.", "Collaborate with cross-functional teams."], jobSlots: 2, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "2", jobName: "Machine Learning Engineer", jobTags: [{ id: "2", jobCategoryName: "Part-time" }], jobRating: 4.3, jobSalary: 85000, jobDescription: ["Build and optimize ML models.", "Work with large datasets and AI frameworks."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },

  ];
  
  return allJobs.find(job => job.id === id);
};


const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const totalStars = 5;
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400" />
      ))}
      {hasHalfStar && <FaStar className="text-yellow-400" />}
      {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
      ))}
      <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [isApplying, setIsApplying] = useState(false);

  const job = getJobById(jobId || "");
  
  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-none w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Job not found</h2>
          <p className="mt-4">The job you're looking for doesn't exist or has been removed.</p>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    );
  }
  
  const formattedDate = formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true });
  
  return (
    <ModalProvider>
      <div className="flex flex-col min-h-screen">
        <div className="flex-none w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{job.jobName}</h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.jobTags.map((tag) => (
                    <span 
                      key={tag.id} 
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {tag.jobCategoryName}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <RatingStars rating={job.jobRating} />
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => setIsApplying(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Job Details and Application */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section - Job Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Overview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Job Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-green-600 mr-3 text-xl" />
                    <div>
                      <p className="text-gray-600 text-sm">Salary</p>
                      <p className="font-medium">${job.jobSalary.toLocaleString()} / year</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-blue-600 mr-3 text-xl" />
                    <div>
                      <p className="text-gray-600 text-sm">Positions</p>
                      <p className="font-medium">{job.jobSlots} {job.jobSlots > 1 ? "slots" : "slot"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-purple-600 mr-3 text-xl" />
                    <div>
                      <p className="text-gray-600 text-sm">Posted</p>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Job Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {job.jobDescription.map((desc, index) => (
                    <li key={index} className="text-gray-700">{desc}</li>
                  ))}
                </ul>
              </div>
              

              

            </div>
            
            {/* Right Section - Application Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-2xl font-semibold mb-4">Quick Apply</h2>
                {isApplying ? (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Your email"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Resume</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex flex-col items-center justify-center pt-7">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="pt-1 text-sm text-gray-500">Upload your resume</p>
                          </div>
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Cover Letter (Optional)</label>
                      <textarea 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        rows={4}
                        placeholder="Why you're interested in this position"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                    >
                      Submit Application
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-700 mb-4">Interested in applying for this position?</p>
                    <button 
                      onClick={() => setIsApplying(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                    >
                      Start Application
                    </button>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold mb-2">Share this job:</h3>
                  <div className="flex space-x-3">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-100 text-blue-400 rounded-full hover:bg-blue-200">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar Jobs Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Similar Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* You could map similar jobs here based on job tags or categories */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800">Backend Developer</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Full-time</span>
                  </div>
                  <div className="mt-2 text-gray-600">$70,000 / year</div>
                  <div className="mt-3 flex">
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                      <FaRegStar className="text-yellow-400" />
                      <span className="ml-1 text-gray-700">4.0</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-600">2 positions</span>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">View Details</a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800">Frontend Developer</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Full-time</span>
                  </div>
                  <div className="mt-2 text-gray-600">$65,000 / year</div>
                  <div className="mt-3 flex">
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                      <FaRegStar className="text-yellow-400" />
                      <span className="ml-1 text-gray-700">4.2</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-600">3 positions</span>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">View Details</a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800">UI/UX Designer</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Full-time</span>
                  </div>
                  <div className="mt-2 text-gray-600">$72,000 / year</div>
                  <div className="mt-3 flex">
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                      <FaRegStar className="text-yellow-400" />
                      <span className="ml-1 text-gray-700">4.4</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-600">1 position</span>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">View Details</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </ModalProvider>
  );
}