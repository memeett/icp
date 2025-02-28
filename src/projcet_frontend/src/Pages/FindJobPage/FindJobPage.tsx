import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import JobCard from "../../components/JobCard";
import Footer from "../../components/Footer";
import { ModalProvider } from "../../contexts/modal-context";
import { Job } from "../../interface/job/Job";

const recommendationJobs: Job[] = [
    { id: "1", jobName: "Software Engineer", jobTags: [{ id: "1", jobCategoryName: "Full-time" }], jobRating: 4.6, jobSalary: 75000, jobDescription: ["Develop software solutions.", "Collaborate with cross-functional teams."], jobSlots: 2, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "2", jobName: "Machine Learning Engineer", jobTags: [{ id: "2", jobCategoryName: "Part-time" }], jobRating: 4.3, jobSalary: 85000, jobDescription: ["Build and optimize ML models.", "Work with large datasets and AI frameworks."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "3", jobName: "Product Manager", jobTags: [{ id: "3", jobCategoryName: "Contract" }], jobRating: 4.7, jobSalary: 90000, jobDescription: ["Define product vision.", "Coordinate between stakeholders and developers."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "4", jobName: "Cloud Architect", jobTags: [{ id: "4", jobCategoryName: "Full-time" }], jobRating: 4.8, jobSalary: 95000, jobDescription: ["Design and maintain cloud infrastructure.", "Ensure security and scalability of cloud services."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "5", jobName: "Marketing Analyst", jobTags: [{ id: "5", jobCategoryName: "Remote" }], jobRating: 4.2, jobSalary: 60000, jobDescription: ["Analyze market trends.", "Optimize marketing campaigns using data insights."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "6", jobName: "Systems Administrator", jobTags: [{ id: "6", jobCategoryName: "Full-time" }], jobRating: 4.5, jobSalary: 70000, jobDescription: ["Manage IT infrastructure.", "Ensure system uptime and performance."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "7", jobName: "Cybersecurity Engineer", jobTags: [{ id: "7", jobCategoryName: "Full-time" }], jobRating: 4.9, jobSalary: 88000, jobDescription: ["Implement security protocols.", "Monitor and prevent cyber threats."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
];

const listJobs: Job[] = [
    { id: "8", jobName: "Graphic Designer", jobTags: [{ id: "8", jobCategoryName: "Contract" }], jobRating: 4.6, jobSalary: 55000, jobDescription: ["Create visual content.", "Work with branding and digital design."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "9", jobName: "Database Administrator", jobTags: [{ id: "9", jobCategoryName: "Part-time" }], jobRating: 4.3, jobSalary: 75000, jobDescription: ["Maintain and optimize databases.", "Ensure data security and integrity."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "10", jobName: "AI Research Scientist", jobTags: [{ id: "10", jobCategoryName: "Full-time" }], jobRating: 4.8, jobSalary: 120000, jobDescription: ["Conduct AI research.", "Develop cutting-edge AI models and applications."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "11", jobName: "HR Manager", jobTags: [{ id: "11", jobCategoryName: "Remote" }], jobRating: 4.4, jobSalary: 70000, jobDescription: ["Manage hiring processes.", "Ensure employee well-being and development."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "12", jobName: "Data Engineer", jobTags: [{ id: "12", jobCategoryName: "Full-time" }], jobRating: 4.5, jobSalary: 80000, jobDescription: ["Design and maintain data pipelines.", "Ensure efficient data storage and processing."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "13", jobName: "Mobile App Designer", jobTags: [{ id: "13", jobCategoryName: "Contract" }], jobRating: 4.7, jobSalary: 65000, jobDescription: ["Design mobile-friendly UI/UX.", "Optimize designs for various platforms."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
    { id: "14", jobName: "Network Engineer", jobTags: [{ id: "14", jobCategoryName: "Full-time" }], jobRating: 4.6, jobSalary: 78000, jobDescription: ["Ensure network security and connectivity.", "Manage enterprise networking solutions."], jobSlots: 1, createdAt: Date.now(), updatedAt: Date.now() },
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
    );
}