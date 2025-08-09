export interface JobCategory {
  id: string;
  jobCategoryName: string;
}

export interface Job {
  id: string;
  jobName: string;
  jobDescription: string[];
  jobSalary: number;
  jobSlots: bigint;
  jobTags: JobCategory[];
  jobStatus: 'Open' | 'In Progress' | 'Completed' | 'Cancelled' | 'Finished';
  clientId: string;
  createdAt: bigint;
  updatedAt: bigint;
  deadline?: string;
  requirements?: string[];
  skillsRequired?: string[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Expert';
  jobType?: 'Fixed Price' | 'Hourly';
}

export interface CreateJobPayload {
  jobName: string;
  jobDescription: string[];
  jobSalary: number;
  jobSlots: number;
  jobTags: JobCategory[];
  deadline?: string;
  requirements?: string[];
  skillsRequired?: string[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Expert';
  jobType?: 'Fixed Price' | 'Hourly';
}

export interface UpdatedJobPayload {
  jobName?: string;
  jobDescription?: string[];
  jobSalary?: number;
  jobSlots?: number;
  jobTags?: JobCategory[];
  jobStatus?: 'Open' | 'In Progress' | 'Completed' | 'Cancelled' | 'Finished';
  deadline?: string;
  requirements?: string[];
  skillsRequired?: string[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Expert';
  jobType?: 'Fixed Price' | 'Hourly';
}

export interface JobApplication {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  proposedRate?: number;
  estimatedDuration?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  createdAt: bigint;
  updatedAt: bigint;
}

export interface JobSubmission {
  id: string;
  jobId: string;
  freelancerId: string;
  submissionContent: string;
  attachments?: string[];
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  feedback?: string;
  rating?: number;
  createdAt: bigint;
  updatedAt: bigint;
}