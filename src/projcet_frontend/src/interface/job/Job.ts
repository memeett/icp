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
  jobSlots: bigint;
  jobStatus: string;
  createdAt: bigint;
  updatedAt: bigint;
  userId: string;
}
