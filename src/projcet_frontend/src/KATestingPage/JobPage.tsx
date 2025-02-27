import React, { useState } from "react";
import { createJob, updateJob,viewAllJobs } from "../controller/jobController";
import { CreateJobPayload, JobTags } from "../../../declarations/job/job.did";

const CreateJobForm = () => {
    const [jobName, setJobName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobSalary, setJobSalary] = useState(0);
    const [jobTags, setJobTags] = useState<JobTags>({ ai: null }); 
    const [jobSlots, setJobSlots] = useState<bigint>(BigInt(0));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: CreateJobPayload = {
            jobName,
            jobDescription,
            jobSalary,
            jobTags,
            jobSlots,
        };

        const newJob = await createJob(payload);
        if (newJob) {
            alert("Job created successfully!");
        } else {
            alert("Failed to create job.");
        }
    };

    const viewJobs = async () => {
        const jobs = await viewAllJobs();
        if (jobs) {
            console.log("Jobs:", jobs);
        } else {
            console.error("Failed to get all jobs.");
        }
    }

    // Map of available job tags
    const jobTagOptions: { label: string; value: JobTags }[] = [
        { label: "AI", value: { ai: null } },
        { label: "IoT", value: { iot: null } },
        { label: "Web", value: { web: null } },
        { label: "Desktop", value: { desktop: null } },
        { label: "Game", value: { game: null } },
        { label: "Mobile", value: { mobile: null } },
    ];

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Job Name"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            />
            <input
                type="number"
                placeholder="Job Salary"
                value={jobSalary}
                onChange={(e) => setJobSalary(Number(e.target.value))}
            />
            <select
                value={Object.keys(jobTags)[0]} // Get the selected tag key
                onChange={(e) => {
                    const selectedTag = jobTagOptions.find(
                        (option) => option.label === e.target.value
                    );
                    if (selectedTag) {
                        setJobTags(selectedTag.value);
                    }
                }}
            >
                {jobTagOptions.map((option) => (
                    <option key={option.label} value={option.label}>
                        {option.label}
                    </option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Job Slots"
                value={jobSlots.toString()}
                onChange={(e) => setJobSlots(BigInt(e.target.value))}
            />
            <button type="submit">Create Job</button>
            <button onClick={viewJobs}>View Jobs</button>
        </form>
        // read jobs
        // delete jobs
        // update jobs
    );
};

export default CreateJobForm;