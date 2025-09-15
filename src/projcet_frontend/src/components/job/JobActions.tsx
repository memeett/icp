import React from 'react';
import { Button } from 'antd';
import { SendOutlined, PlayCircleOutlined, StopOutlined, CloseOutlined } from '@ant-design/icons';
import { Job } from '../../shared/types/Job';
import { User } from '../../shared/types/User';
import JobChatButton from '../chat/JobChatButton';

interface JobActionsProps {
  job: Job;
  user: User | null;
  isJobOwner: boolean;
  hasApplied: boolean;
  acceptedFreelancers: User[];
  isStartingJob: boolean;
  onApplyClick: () => void;
  onStartJobClick: () => void;
  onFinishJob: () => void;
}

const JobActions: React.FC<JobActionsProps> = ({
  job,
  user,
  isJobOwner,
  hasApplied,
  acceptedFreelancers,
  isStartingJob,
  onApplyClick,
  onStartJobClick,
  onFinishJob
}) => {
  // Actions for non-job owners (freelancers)
  if (user && job.jobStatus === 'Open' && !isJobOwner) {
    return (
      <div className="text-center space-x-4">
        {Number(job.jobSlots) - acceptedFreelancers.length <= 0 ? (
          <Button size="large" disabled className="px-8">
            All Slots Filled
          </Button>
        ) : hasApplied ? (
          <Button size="large" disabled className="px-8">
            Already Applied
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={onApplyClick}
            className="px-8"
          >
            Apply for this Job
          </Button>
        )}
      </div>
    );
  }

  // Chat button for anyone when job is Ongoing/Finished
  if (user && (job.jobStatus === 'Ongoing' || job.jobStatus === 'Finished')) {
    return (
      <div className="text-center mt-4">
        <JobChatButton
          jobId={job.id}
          jobStatus={job.jobStatus}
          clientId={job.userId}
          freelancerId={user?.id}
        />
      </div>
    );
  }

  // Actions for job owners
  if (isJobOwner) {
    return (
      <div className="text-center space-x-4">
        {job.jobStatus === 'Open' && acceptedFreelancers.length > 0 && (
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={onStartJobClick}
            loading={isStartingJob}
          >
            Start Job
          </Button>
        )}
        
        {job.jobStatus === 'Open' && acceptedFreelancers.length === 0 && (
          <Button
            type="primary"
            size="large"
            icon={<CloseOutlined />}
            disabled={true}
          >
            Job has no accepted freelancers
          </Button>
        )}
        
        {job.jobStatus === 'Ongoing' && (
          <Button
            type="primary"
            size="large"
            icon={<StopOutlined />}
            onClick={onFinishJob}
          >
            Finish Job
          </Button>
        )}
      </div>
    );
  }

  return null;
};

export default JobActions;
