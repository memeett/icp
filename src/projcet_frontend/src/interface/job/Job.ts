export interface JobCategory {
  id: string;
  jobCategoryName: string;
}

export interface Job {
    id: string;
    jobName: string;
    jobDescription: string[];
    jobSalary: number;
    jobRating: number;
    jobTags: JobCategory[];
    jobSlots: BigInt;
    jobStatus: string;
    createdAt: number;
    updatedAt: number;
    userId: string;
    wallet: number;

}
