import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import {
  jobsAtom,
  jobCategoriesAtom,
  selectedJobAtom,
  filteredJobsAtom,

  jobFiltersAtom,
  jobSearchQueryAtom,
  jobsCurrentPageAtom,
  jobActionsAtom,
  recommendedJobsAtom,
  savedJobsAtom,
  isSavedJobAtom,
  jobStatsAtom,
  paginatedJobsAtom
} from '../../app/store/jobs';
import { notificationActionsAtom } from '../../app/store/ui';
import { Job, JobCategory } from '../types/Job';
import { 
  viewAllJobs, 
  viewAllJobCategories,
  getJobById 
} from '../../controller/jobController';

export interface UseJobsReturn {
  // Data
  jobs: Job[];
  jobCategories: JobCategory[];
  selectedJob: Job | null;
  filteredJobs: Job[];
  paginatedJobs: Job[];
  recommendedJobs: Job[];
  jobStats: any;
  
  // State
  filters: any;
  searchQuery: string;
  currentPage: number;
  isLoading: boolean;
  
  // Actions
  fetchJobs: () => Promise<void>;
  fetchJobCategories: () => Promise<void>;
  fetchJobById: (jobId: string) => Promise<void>;
  updateFilters: (filters: any) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  isSaved: (jobId: string) => boolean;
  clearFilters: () => void;
}

export const useJobs = (): UseJobsReturn => {
  const [jobs] = useAtom(jobsAtom);
  const [jobCategories] = useAtom(jobCategoriesAtom);
  const [selectedJob] = useAtom(selectedJobAtom);
  const [filteredJobs] = useAtom(filteredJobsAtom);
  const [paginatedJobs] = useAtom(paginatedJobsAtom);
  const [recommendedJobs] = useAtom(recommendedJobsAtom);
  const [jobStats] = useAtom(jobStatsAtom);
  
  const [filters] = useAtom(jobFiltersAtom);
  const [searchQuery, setSearchQueryAtom] = useAtom(jobSearchQueryAtom);
  const [currentPage, setCurrentPageAtom] = useAtom(jobsCurrentPageAtom);
  const [savedJobs] = useAtom(savedJobsAtom);
  const [, saveJobAction] = useAtom(isSavedJobAtom);
  
  const [, jobActions] = useAtom(jobActionsAtom);
  const [, notificationActions] = useAtom(notificationActionsAtom);

  // Helper function to convert backend status to frontend status
  const convertJobStatus = (backendStatus: string): 'open' | 'in_progress' | 'completed' | 'cancelled' => {
    switch (backendStatus.toLowerCase()) {
      case 'start':
      case 'open':
        return 'open';
      case 'ongoing':
      case 'in_progress':
        return 'in_progress';
      case 'finished':
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'open';
    }
  };

  // Fetch all jobs
  const fetchJobs = useCallback(async () => {
    try {
      const jobsData = await viewAllJobs();
      if (jobsData) {
        // Convert backend job format to frontend format
        const convertedJobs = jobsData.map((backendJob: any) => ({
          ...backendJob,
          // Map backend properties to frontend properties
          title: backendJob.jobName,
          description: backendJob.jobDescription.join(' '),
          budget: backendJob.jobSalary,
          status: convertJobStatus(backendJob.jobStatus),
          clientId: backendJob.userId,
          category: backendJob.jobTags[0] || { id: '', jobCategoryName: 'General' },
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
        }));
        jobActions({ type: 'SET_JOBS', jobs: convertedJobs });
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      notificationActions({
        type: 'ADD',
        notification: {
          type: 'error',
          title: 'Error',
          message: 'Failed to load jobs. Please try again.',
        }
      });
    }
  }, [jobActions, notificationActions]);

  // Fetch job categories
  const fetchJobCategories = useCallback(async () => {
    try {
      const categories = await viewAllJobCategories();
      if (categories) {
        jobActions({ type: 'SET_CATEGORIES', categories });
      }
    } catch (error) {
      console.error('Failed to fetch job categories:', error);
      notificationActions({
        type: 'ADD',
        notification: {
          type: 'error',
          title: 'Error',
          message: 'Failed to load job categories.',
        }
      });
    }
  }, [jobActions, notificationActions]);

  // Fetch job by ID
  const fetchJobById = useCallback(async (jobId: string) => {
    try {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        jobActions({ type: 'SET_SELECTED_JOB', job });
      } else {
        // If not in current jobs list, fetch from API
        const jobData = await getJobById(jobId);
        if (jobData) {
          // Convert backend job format to frontend format
          const convertedJob = {
            ...jobData,
            title: jobData.jobName,
            description: jobData.jobDescription.join(' '),
            budget: jobData.jobSalary,
            status: convertJobStatus(jobData.jobStatus),
            clientId: jobData.userId,
            category: jobData.jobTags[0] || { id: '', jobCategoryName: 'General' },
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          };
          jobActions({ type: 'SET_SELECTED_JOB', job: convertedJob });
        }
      }
    } catch (error) {
      console.error('Failed to fetch job:', error);
      notificationActions({
        type: 'ADD',
        notification: {
          type: 'error',
          title: 'Error',
          message: 'Failed to load job details.',
        }
      });
    }
  }, [jobs, jobActions, notificationActions]);

  // Update filters
  const updateFilters = useCallback((newFilters: any) => {
    jobActions({ type: 'UPDATE_FILTERS', filters: newFilters });
    setCurrentPageAtom(1); // Reset to first page when filters change
  }, [jobActions, setCurrentPageAtom]);

  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryAtom(query);
    setCurrentPageAtom(1); // Reset to first page when search changes
  }, [setSearchQueryAtom, setCurrentPageAtom]);

  // Set current page
  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageAtom(page);
  }, [setCurrentPageAtom]);

  // Save job
  const saveJob = useCallback((jobId: string) => {
    saveJobAction({ jobId, save: true });
    notificationActions({
      type: 'ADD',
      notification: {
        type: 'success',
        title: 'Job Saved',
        message: 'Job has been added to your saved jobs.',
        duration: 3000,
      }
    });
  }, [saveJobAction, notificationActions]);

  // Unsave job
  const unsaveJob = useCallback((jobId: string) => {
    saveJobAction({ jobId, save: false });
    notificationActions({
      type: 'ADD',
      notification: {
        type: 'info',
        title: 'Job Removed',
        message: 'Job has been removed from your saved jobs.',
        duration: 3000,
      }
    });
  }, [saveJobAction, notificationActions]);

  // Check if job is saved
  const isSaved = useCallback((jobId: string) => {
    return savedJobs.includes(jobId);
  }, [savedJobs]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    jobActions({ 
      type: 'UPDATE_FILTERS', 
      filters: {
        categories: [],
        priceRanges: [],
        experienceLevel: [],
        jobType: [],
        sortBy: 'newest' as const
      }
    });
    setSearchQueryAtom('');
    setCurrentPageAtom(1);
  }, [jobActions, setSearchQueryAtom, setCurrentPageAtom]);

  // Initialize data on mount
  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs();
    }
    if (jobCategories.length === 0) {
      fetchJobCategories();
    }
  }, [jobs.length, jobCategories.length, fetchJobs, fetchJobCategories]);

  return {
    // Data
    jobs,
    jobCategories,
    selectedJob,
    filteredJobs,
    paginatedJobs,
    recommendedJobs,
    jobStats,
    
    // State
    filters,
    searchQuery,
    currentPage,
    isLoading: false, // TODO: Add loading state
    
    // Actions
    fetchJobs,
    fetchJobCategories,
    fetchJobById,
    updateFilters,
    setSearchQuery,
    setCurrentPage,
    saveJob,
    unsaveJob,
    isSaved,
    clearFilters,
  };
};