import { JobCategory } from "./Job";

export interface UpdateJobPayload {
    jobName?: string;
    jobDescription?: string[];
    jobSalary?: number;
    jobTags?: JobCategory[];
    jobSlots?: number;
}
