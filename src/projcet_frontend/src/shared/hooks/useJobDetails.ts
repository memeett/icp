import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import {
  getJobById,
  getJobApplier,
  getAcceptedFreelancer,
  startJob,
  finishJob
} from '../../controller/jobController';
import {
  applyJob,
  hasUserApplied,
  acceptApplier,
  rejectApplier
} from '../../controller/applyController';
import { createInbox } from '../../controller/inboxController';
import { Job } from '../../interface/job/Job';
import { User } from '../../interface/User';

interface ApplicantData {
  user: User;
  appliedAt: string;
}

interface UseJobDetailsReturn {
  // Data
  job: Job | null;
  applicants: ApplicantData[];
  acceptedFreelancers: User[];
  hasApplied: boolean;
  isJobOwner: boolean;
  
  // State
  loading: boolean;
  isApplying: boolean;
  
  // Actions
  fetchJobDetails: () => Promise<void>;
  handleApply: (values: any) => Promise<boolean>;
  handleAcceptApplicant: (userId: string) => Promise<boolean>;
  handleRejectApplicant: (userId: string) => Promise<boolean>;
  handleStartJob: () => Promise<boolean>;
  handleFinishJob: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export const useJobDetails = (jobId: string | undefined, user: User | null): UseJobDetailsReturn => {
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<ApplicantData[]>([]);
  const [acceptedFreelancers, setAcceptedFreelancers] = useState<User[]>([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [isJobOwner, setIsJobOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch all job-related data in a single optimized call
  const fetchJobDetails = useCallback(async () => {
    if (!jobId) return;
    
    setLoading(true);
    try {
      // Fetch job details first
      const jobData = await getJobById(jobId);
      if (!jobData) {
        throw new Error('Job not found');
      }
      
      setJob(jobData);
      const isOwner = user?.id === jobData.userId;
      setIsJobOwner(isOwner);
      
      // Parallel fetch for user-specific data
      const promises: Promise<any>[] = [];
      
      // Check if user has applied (only if user exists and is not owner)
      if (user && !isOwner) {
        promises.push(hasUserApplied(user.id, jobId));
      }
      
      // Fetch applicants and accepted freelancers (only if user is owner)
      if (user && isOwner) {
        promises.push(
          getJobApplier(jobId),
          getAcceptedFreelancer(jobId)
        );
      }
      
      const results = await Promise.all(promises);
      
      // Process results based on user role
      if (user && !isOwner && results.length > 0) {
        setHasApplied(results[0]);
      }
      
      if (user && isOwner && results.length >= 2) {
        const [applicantsData, acceptedData] = results;
        
        setApplicants(applicantsData.map((app: any) => ({
          user: app.user,
          appliedAt: new Date(Number(app.appliedAt) / 1000000).toISOString()
        })));
        setAcceptedFreelancers(acceptedData);
      }
      
    } catch (error) {
      console.error('Error fetching job details:', error);
      message.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [jobId, user]);

  // Handle job application
  const handleApply = useCallback(async (values: any): Promise<boolean> => {
    if (!user || !jobId || !job) return false;
    
    setIsApplying(true);
    try {
      const success = await applyJob(user.id, jobId);
      if (success) {
        // Create inbox notification for job owner
        await createInbox(job.userId, user.id, 'application', 'request', 'Miaw');
        
        message.success('Application submitted successfully!');
        setHasApplied(true);
        
        // Refresh applicant data if user is job owner
        if (isJobOwner) {
          await fetchJobDetails();
        }
        
        return true;
      } else {
        message.error('Failed to submit application. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      message.error('Failed to submit application. Please try again.');
      return false;
    } finally {
      setIsApplying(false);
    }
  }, [user, jobId, job, isJobOwner, fetchJobDetails]);

  // Handle applicant acceptance
  const handleAcceptApplicant = useCallback(async (userId: string): Promise<boolean> => {
    if (!jobId || !user) return false;
    
    try {
      const success = await acceptApplier(userId, jobId);
      if (success) {
        // Create inbox notification for applicant
        await createInbox(userId, user.id, 'application', 'accepted', 'Miaw');
        
        message.success('Applicant accepted successfully!');
        await fetchJobDetails(); // Refresh data
        return true;
      } else {
        message.error('Failed to accept applicant.');
        return false;
      }
    } catch (error) {
      console.error('Error accepting applicant:', error);
      message.error('Failed to accept applicant.');
      return false;
    }
  }, [jobId, user, fetchJobDetails]);

  // Handle applicant rejection
  const handleRejectApplicant = useCallback(async (userId: string): Promise<boolean> => {
    if (!jobId || !user) return false;
    
    try {
      const success = await rejectApplier(userId, jobId);
      if (success) {
        // Create inbox notification for applicant
        await createInbox(userId, user.id, 'application', 'rejected', 'Miaw');
        
        message.success('Applicant rejected.');
        await fetchJobDetails(); // Refresh data
        return true;
      } else {
        message.error('Failed to reject applicant.');
        return false;
      }
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      message.error('Failed to reject applicant.');
      return false;
    }
  }, [jobId, user, fetchJobDetails]);

  // Handle job start
  const handleStartJob = useCallback(async (): Promise<boolean> => {
    if (!job || !user) return false;
    
    try {
      const result = await startJob(user.id, job.id, job.jobSalary);
      console.log(result);
      if (result.jobStarted) {
        message.success('Job started successfully!');
        await fetchJobDetails();
        return true;
      } else {
        message.error(result.message);
        return false;
      }
    } catch (error) {
      console.error('Error starting job:', error);
      message.error('Failed to start job.');
      return false;
    }
  }, [job, user, fetchJobDetails]);

  // Handle job finish
  const handleFinishJob = useCallback(async (): Promise<boolean> => {
    if (!job) return false;
    
    try {
      const result = await finishJob(job.id);
      if (result.jobFinished) {
        message.success('Job finished successfully!');
        await fetchJobDetails();
        return true;
      } else {
        message.error(result.message);
        return false;
      }
    } catch (error) {
      console.error('Error finishing job:', error);
      message.error('Failed to finish job.');
      return false;
    }
  }, [job, fetchJobDetails]);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    await fetchJobDetails();
  }, [fetchJobDetails]);

  // Initialize data on mount or when dependencies change
  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  return {
    // Data
    job,
    applicants,
    acceptedFreelancers,
    hasApplied,
    isJobOwner,
    
    // State
    loading,
    isApplying,
    
    // Actions
    fetchJobDetails,
    handleApply,
    handleAcceptApplicant,
    handleRejectApplicant,
    handleStartJob,
    handleFinishJob,
    refreshData,
  };
};