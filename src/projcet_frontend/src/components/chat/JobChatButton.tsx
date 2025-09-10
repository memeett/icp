import React, { useState } from 'react';
import { Button, message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import useChat from '../../hooks/useChat';

interface JobChatButtonProps {
  jobId: string;
  jobStatus: string;
  clientId: string;
  freelancerId?: string; // Optional karena mungkin belum ada freelancer
  disabled?: boolean;
}

const JobChatButton: React.FC<JobChatButtonProps> = ({
  jobId,
  jobStatus,
  clientId,
  freelancerId,
  disabled = false
}) => {
  const { user } = useAuth();
  const { canAccessJob, initializeChatForJob } = useChat();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChatClick = async () => {
    if (!user?.id || !freelancerId) {
      message.error('Chat is not available yet');
      return;
    }

    setLoading(true);
    try {
      // Check if user can access chat for this job
      const hasAccess = await canAccessJob(jobId);
      if (!hasAccess) {
        message.error('Chat is only available for ongoing or completed jobs');
        return;
      }

      // Initialize chat room
      const room = await initializeChatForJob(jobId, clientId, freelancerId);
      if (room) {
        // Navigate to chat page with room context
        navigate('/chat', { 
          state: { 
            roomId: room.id, 
            jobId: jobId,
            otherUserId: user.id === clientId ? freelancerId : clientId
          } 
        });
      } else {
        message.error('Unable to start chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      message.error('Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  // Determine button visibility and state
  const canShowButton = () => {
    // Only show if job is Ongoing or Finished
    if (jobStatus !== 'Ongoing' && jobStatus !== 'Finished') return false;
    
    // Only show if user is client or accepted freelancer
    if (user?.id !== clientId && user?.id !== freelancerId) return false;
    
    // Must have freelancer assigned
    if (!freelancerId) return false;
    
    return true;
  };

  if (!canShowButton()) {
    return null;
  }

  return (
    <Button
      type="default"
      icon={<MessageOutlined />}
      onClick={handleChatClick}
      loading={loading}
      disabled={disabled}
      className="flex items-center"
    >
      Chat
    </Button>
  );
};

export default JobChatButton;

