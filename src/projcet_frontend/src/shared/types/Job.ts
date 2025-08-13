export interface JobCategory {
  id: string;
  jobCategoryName: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  startdate: bigint;
  deadline: bigint;
  status: string;
  clientId: string;
  freelancerId: string;
  skills: string[];
  experienceLevel: string;
  projectType: string;
  postedAt: string;
  applicants: number;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  categoryId: string;
  budget: number;
  deadline: string;
}

export interface UpdateJobPayload {
  title?: string;
  description?: string;
  categoryId?: string;
  budget?: number;
  deadline?: string;
  status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
}