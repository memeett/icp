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
import { Link } from "react-router-dom";
import { UserClicked } from "../../../../declarations/userclicked/userclicked.did";
import { getUserClickedByUserId } from "../../controller/userClickedController";

const jobTag = ["Full-time", "Part-time", "Contract", "Remote"];

export default function FindJobPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [jobTags, setJobTags] = useState<JobCategory[]>([]);
    const [listJobs, setListJobs] = useState<Job[]>([]);
    const [listUserClickeds, setListUserClickeds] = useState<UserClicked[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<string[]>([]);
    const [recommendationJobs, setRecommendationJobs] = useState<Job[]>([]);

    const nextSlide = () => {
        if (startIndex + 3 < recommendationJobs.length) {
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

    fetchData();

    const handleTagChange = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSalaryRangeChange = (range: string) => {
        setSelectedSalaryRanges(prev =>
            prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
        );
    };

    const filteredJobs = listJobs.filter(job => {
        const matchesSearch = searchQuery === "" || job.jobName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTags = selectedTags.length === 0 || job.jobTags.some(tag => selectedTags.includes(tag.jobCategoryName));

        const matchesSalary = selectedSalaryRanges.length === 0 || selectedSalaryRanges.some(range => {
            switch (range) {
                case "< 100":
                    return job.jobSalary < 100;
                case "100 - 200":
                    return job.jobSalary >= 100 && job.jobSalary <= 200;
                case "> 200":
                    return job.jobSalary > 200;
                default:
                    return true;
            }
        });

        return matchesSearch && matchesTags && matchesSalary;
    });

    const convertBigIntToString = (data: any): any => {
        if (typeof data === 'bigint') {
            return data.toString();
        }
        if (Array.isArray(data)) {
            return data.map(convertBigIntToString);
        }
        if (typeof data === 'object' && data !== null) {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, convertBigIntToString(value)])
            );
        }
        return data;
    };

    const getRecommendationJoblList = async () => {
        const userClickeds = await getUserClickedByUserId();
        if (userClickeds) setListUserClickeds(userClickeds);

        
        if (userClickeds.length === 0) {
            const randomJobs = listJobs.sort(() => 0.5 - Math.random()).slice(0, 5);
            setRecommendationJobs(randomJobs);
            return;
        }

        const data = {
            jobTags: convertBigIntToString(jobTags),
            listJobs: convertBigIntToString(listJobs),
            listUserClickeds: convertBigIntToString(listUserClickeds),
        };

        console.log(data);

        try {
            const response = await fetch("http://localhost:5000/getRecommendation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            console.log("Response from Flask:", result);
            setRecommendationJobs(result.top_jobs);
        } catch (error) {
            console.error("Error sending data to Flask:", error);
        }
    };
    // useEffect(() => {
        getRecommendationJoblList();

        // const intervalId = setInterval(() => {
        //     getRecommendationJoblList();
        // }, 50000); 

        // return () => {
        //     clearInterval(intervalId);
        // };
    // }, []);
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
            {/* <button onClick={getRecommendationJoblList}>Fetch Recommendation</button>
            <button onClick={getUserClickedByUserId}>Get All</button> */}
            <div className="flex overflow-x-hidden scrollbar-hide">
                <div className="flex flex-col bg-brown w-[20vw] h-screen container">
                    <div className="flex flex-col h-screen p-20">
                        <p className="text-2xl font-light mb-5">Job Tag</p>
                        {jobTags && jobTags.length > 0 ? (
                            jobTags.map((tag) => (
                                <div key={tag.id} className="flex gap-5 mb-3">
                                    <input
                                        type="checkbox"
                                        className="scale-150"
                                        value={tag.jobCategoryName}
                                        checked={selectedTags.includes(tag.jobCategoryName)}
                                        onChange={() => handleTagChange(tag.jobCategoryName)}
                                    />
                                    <label className="font-extralight text-l">{tag.jobCategoryName}</label>
                                </div>
                            ))
                        ) : (
                            jobTag.map((tag) => (
                                <div key={tag} className="flex gap-5 mb-3">
                                    <input
                                        type="checkbox"
                                        className="scale-150"
                                        value={tag}
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => handleTagChange(tag)}
                                    />
                                    <label className="font-extralight text-l">{tag}</label>
                                </div>
                            ))
                        )}

                        <p className="text-2xl font-light mb-5">Job Salary</p>
                        <div className="flex gap-5 mb-3">
                            <input
                                type="checkbox"
                                className="scale-150"
                                value={"< 100"}
                                checked={selectedSalaryRanges.includes("< 100")}
                                onChange={() => handleSalaryRangeChange("< 100")}
                            />
                            <label className="font-extralight text-l">{"< 100"} $</label>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <input
                                type="checkbox"
                                className="scale-150"
                                value={"100 - 200"}
                                checked={selectedSalaryRanges.includes("100 - 200")}
                                onChange={() => handleSalaryRangeChange("100 - 200")}
                            />
                            <label className="font-extralight text-l">{"100 - 200"} $</label>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <input
                                type="checkbox"
                                className="scale-150"
                                value={"> 200"}
                                checked={selectedSalaryRanges.includes("> 200")}
                                onChange={() => handleSalaryRangeChange("> 200")}
                            />
                            <label className="font-extralight text-l">{"> 200"} $</label>
                        </div>
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
                            disabled={startIndex + 3 >= recommendationJobs.length}
                        >
                            <ChevronRight />
                        </button>
                    </div>

                    <h2 className="text-3xl font-semibold mt-10 mb-4 text-gray-800">List Jobs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-12">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
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