import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import JobCard from "../../components/JobCard";
import Footer from "../../components/Footer";
import { ModalProvider } from "../../contexts/modal-context";
import { BiSlider } from "react-icons/bi";
import { FiSearch, FiX } from "react-icons/fi";
import { viewAllJobCategories, viewAllJobs } from "../../controller/jobController";
import { Job, JobCategory } from "../../../../declarations/job/job.did";

const recommendationJobs: Job[] = [
    { id: "1", jobName: "Software Engineer", jobTags: [{ id: "1", jobCategoryName: "Full-time" }], jobRating: 4.6, jobSalary: 75000, jobDescription: ["Develop software solutions.", "Collaborate with cross-functional teams."], jobSlots: BigInt(2), createdAt: BigInt(Date.now()), updatedAt: BigInt(Date.now()), jobStatus: "Start", userId: "1" },
    { id: "2", jobName: "Machine Learning Engineer", jobTags: [{ id: "2", jobCategoryName: "Part-time" }], jobRating: 4.3, jobSalary: 85000, jobDescription: ["Build and optimize ML models.", "Work with large datasets and AI frameworks."], jobSlots: BigInt(1), createdAt: BigInt(Date.now()), updatedAt: BigInt(Date.now()), jobStatus: "Start", userId: "1" },
    { id: "7", jobName: "Cybersecurity Engineer", jobTags: [{ id: "7", jobCategoryName: "Full-time" }], jobRating: 4.9, jobSalary: 88000, jobDescription: ["Implement security protocols.", "Monitor and prevent cyber threats."], jobSlots: BigInt(1), createdAt: BigInt(Date.now()), updatedAt: BigInt(Date.now()), jobStatus: "Start", userId: "1" },
];

const jobTag = ["Full-time", "Part-time", "Contract", "Remote"];

export default function FindJobPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [jobTags, setJobTags] = useState<JobCategory[]>();
    const [listJobs, setListJobs] = useState<Job[]>();
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key to trigger refetch

    const nextSlide = () => {
        if (startIndex + 5 < recommendationJobs.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const prevSlide = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const fetchData = async () => {
        try {
            const jobs = await viewAllJobs();
            const categories = await viewAllJobCategories();

            if (jobs) setListJobs(jobs);
            if (categories) setJobTags(categories);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data when the component mounts or refreshKey changes
    }, []); // Add refreshKey as a dependency

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 mt-6">
                <div className="flex items-center gap-8 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search jobs..."
                            className="w-full px-12 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                        />
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        {searchQuery && (
                            <FiX
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer hover:text-gray-600"
                                onClick={() => setSearchQuery('')}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex overflow-x-hidden scrollbar-hide">
                {/* Filter Section */}
                <div className="flex flex-col bg-brown w-[20vw] h-screen container">
                    <div className="flex flex-col h-screen p-20">
                        {/* Job Type Filter Section */}
                        <p className="text-2xl font-light mb-5">Job Tag</p>
                        {jobTags && jobTags.length > 0 ? (
                            jobTags.map((tag) => (
                                <div key={tag.id} className="flex gap-5 mb-3">
                                    <input type="checkbox" className="scale-150" value={tag.jobCategoryName} />
                                    <label className="font-extralight text-l">{tag.jobCategoryName}</label>
                                </div>
                            ))
                        ) : (
                            jobTag.map((tag) => (
                                <div key={tag} className="flex gap-5 mb-3">
                                    <input type="checkbox" className="scale-150" value={tag} />
                                    <label className="font-extralight text-l">{tag}</label>
                                </div>
                            ))
                        )}

                        {/* Job Salary and Slots Filter Sections (unchanged) */}
                    </div>
                </div>

                <div className="w-[70vw] mt-10 p-5">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Recommended Jobs</h2>
                    <div className="relative flex items-center">
                        <button
                            className="absolute left-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
                            onClick={prevSlide}
                            disabled={startIndex === 0}
                        >
                            <ChevronLeft />
                        </button>
                        <div className="flex gap-4 overflow-hidden w-full px-12">
                            {recommendationJobs.slice(startIndex, startIndex + 3).map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                        <button
                            className="absolute right-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
                            onClick={nextSlide}
                            disabled={startIndex + 5 >= recommendationJobs.length}
                        >
                            <ChevronRight />
                        </button>
                    </div>

                    <h2 className="text-3xl font-semibold mt-10 mb-4 text-gray-800">List Jobs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-12">
                        {listJobs && listJobs.length > 0 ? (
                            listJobs.map((job) => <JobCard key={job.id} job={job} />)
                        ) : (
                            <p className="text-center col-span-full text-gray-500">No job listings available</p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}