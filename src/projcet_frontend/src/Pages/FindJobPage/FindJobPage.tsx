import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import JobCard from "../../components/JobCard";
import Footer from "../../components/Footer";
import { ModalProvider } from "../../contexts/modal-context";

const recommendationJobs: Job[] = [
    { id: "1", jobName: "Frontend Developer", jobTags: "Full-time", jobRating: 4.5, jobSalary: 60, jobDescription: "Build and maintain web applications.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "2", jobName: "Backend Developer", jobTags: "Part-time", jobRating: 4.2, jobSalary: 70, jobDescription: "Develop APIs and databases.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "3", jobName: "UI/UX Designer", jobTags: "Contract", jobRating: 4.7, jobSalary: 50, jobDescription: "Design user-friendly interfaces.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "4", jobName: "Data Scientist", jobTags: "Full-time", jobRating: 4.6, jobSalary: 90, jobDescription: "Analyze and interpret complex data.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "5", jobName: "DevOps Engineer", jobTags: "Remote", jobRating: 4.4, jobSalary: 80, jobDescription: "Manage CI/CD pipelines.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "6", jobName: "Mobile Developer", jobTags: "Full-time", jobRating: 4.3, jobSalary: 60, jobDescription: "Develop mobile applications.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "7", jobName: "Cybersecurity Analyst", jobTags: "Full-time", jobRating: 4.8, jobSalary: 75, jobDescription: "Ensure system security.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
];

const listJobs: Job[] = [
    { id: "1", jobName: "Frontend Developer", jobTags: "Full-time", jobRating: 4.5, jobSalary: 60, jobDescription: "Build and maintain web applications.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "2", jobName: "Backend Developer", jobTags: "Part-time", jobRating: 4.2, jobSalary: 70, jobDescription: "Develop APIs and databases.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "3", jobName: "UI/UX Designer", jobTags: "Contract", jobRating: 4.7, jobSalary: 50, jobDescription: "Design user-friendly interfaces.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "4", jobName: "Data Scientist", jobTags: "Full-time", jobRating: 4.6, jobSalary: 90, jobDescription: "Analyze and interpret complex data.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "5", jobName: "DevOps Engineer", jobTags: "Remote", jobRating: 4.4, jobSalary: 80, jobDescription: "Manage CI/CD pipelines.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "6", jobName: "Mobile Developer", jobTags: "Full-time", jobRating: 4.3, jobSalary: 60, jobDescription: "Develop mobile applications.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
    { id: "7", jobName: "Cybersecurity Analyst", jobTags: "Full-time", jobRating: 4.8, jobSalary: 75, jobDescription: "Ensure system security.", jobSlots: 1, createdAt: 1, updatedAt: 1 },
];

const jobTag = ["Full-time", "Part-time", "Contract", "Remote"]

export default function FindJobPage() {

    const [startIndex, setStartIndex] = useState(0);

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

    return (
        <ModalProvider>

        
        <div className="flex flex-col min-h-screen ">
            {/* Navbar - Stays on top, does not scroll */}
            <div className="flex-none w-full bg-white shadow-md z-50">
                <Navbar />
            </div>

            {/* Main Content - This is the only scrollable section */}
            <div className="flex overflow-x-hidden scrollbar-hide">

                {/* Filter Section                */}
                <div className="flex flex-col bg-brown w-[20vw] h-screen container ">

                    <div className="flex flex-col h-screen p-20 ">      

                        {/* Job Type Filter Section */}
                        <p className="text-2xl font-light mb-5">Job Tag</p>
                        {jobTag.map((tag) => (
                            <div className="flex gap-5 mb-3">
                                <input type="checkbox" className="scale-150" value={tag} />
                                <label className="font-extralight text-l">{tag}</label>
                            </div>
                        ))}

                        {/* Job Salary Filter Section */}
                        <p className="text-2xl font-light mb-5">Job Slots</p>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"< 50"} />
                            <label className="font-extralight text-l">&lt; 50 Persons</label>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"50 - 100"} />
                            <label className="font-extralight text-l">50 - 100 Persons</label>
                        </div>
                        <div className="flex gap-5 mb-7">
                            <input type="checkbox" className="scale-150" value={"> 100"} />
                            <label className="font-extralight text-l">&gt; 100 Persons</label>
                        </div>

                        {/* Job Salary Filter Section */}
                        <p className="text-2xl font-light mb-5">Job Salary</p>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"< 20"} />
                            <label className="font-extralight text-l">&lt; 100$</label>
                        </div>
                        <div className="flex gap-5 mb-3">
                            <input type="checkbox" className="scale-150" value={"20 - 40"} />
                            <label className="font-extralight text-l">100$ - 300$</label>
                        </div>
                        <div className="flex gap-5 mb-7">
                            <input type="checkbox" className="scale-150" value={"> 40"} />
                            <label className="font-extralight text-l">&gt; 300$</label>
                        </div>



                    </div>

                </div>

                <div className="w-[70vw] mt-10 p-5 ">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-800">Recommended Jobs</h2>

                    <div className="relative flex items-center">
                        {/* Tombol Panah Kiri */}
                        <button
                            className="absolute left-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
                            onClick={prevSlide}
                            disabled={startIndex === 0}
                        >
                            <ChevronLeft />
                        </button>

                        {/* List Card */}
                        <div className="flex gap-4 overflow-hidden w-full px-12">
                            {recommendationJobs.slice(startIndex, startIndex + 3).map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>

                        {/* Tombol Panah Kanan */}
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
                        {listJobs.map((job) => (
                            <JobCard key={job.id} job={job} />

                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div>
                <Footer />
            </div>
        </div>
        </ModalProvider>
    );
}