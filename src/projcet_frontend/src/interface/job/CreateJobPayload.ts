import { JobCategory } from "./Job";

export interface CreateJobPayload{
    jobName: string;
    jobDescription: string[];
    jobSalary: number;
    jobTags: JobCategory[];
    jobSlots: number;
}
