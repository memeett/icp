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
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  clientId: string;
  freelancerId?: string;
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