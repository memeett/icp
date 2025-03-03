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

const recommendationJobs: Job[] = [
    { id: "1", jobName: "Software Engineer", jobTags: [{ id: "1", jobCategoryName: "Full-time" }], jobRating: 4.6, jobSalary: 75000, jobDescription: ["Develop software solutions.", "Collaborate with cross-functional teams."], jobSlots: BigInt(2), createdAt: BigInt(Date.now()), updatedAt: BigInt(Date.now()), jobStatus: "Start", userId: "1" },
    { id: "2", jobName: "Machine Learning Engineer", jobTags: [{ id: "2", jobCategoryName: "Part-time" }], jobRating: 4.3, jobSalary: 85000, jobDescription: ["Build and optimize ML models.", "Work with large datasets and AI frameworks."], jobSlots: BigInt(1), createdAt: BigInt(Date.now()), updatedAt: BigInt(Date.now()), jobStatus: "Start", userId: "1" },
    { id: "7", jobName: "Cybersecurity Engineer", jobTags: [{ id: "7", jobCategoryName: "Full-time" }], jobRating: 4.9, jobSalary: 88000, jobDescription: ["Implement security protocols.", "Monitor and prevent cyber threats."], jobSlots: BigInt(1), createdAt: BigInt(Date.now()), updatedAt: BigInt(Date.now()), jobStatus: "Start", userId: "1" },
];

const jobTag = ["Full-time", "Part-time", "Contract", "Remote"];

export default function BrowseFreelancer() {
    const [searchQuery, setSearchQuery] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [jobTags, setJobTags] = useState<JobCategory[]>([]);
    const [listJobs, setListJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<string[]>([]);


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


    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Footer />
        </div>
    );
}