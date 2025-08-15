import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { getAllUsers } from '../../controller/userController';
import { createInbox } from '../../controller/inboxController';
import { User } from '../types/User';

interface UseUserManagementReturn {
  // Data
  allUsers: User[];
  searchUsers: User[];
  
  // State
  loading: boolean;
  
  // Actions
  fetchAllUsers: () => Promise<void>;
  searchUsersByUsername: (searchText: string) => void;
  sendInvitation: (userId: string, currentUserId: string, jobId?: string) => Promise<boolean>;
  clearSearch: () => void;
}

export const useUserManagement = (): UseUserManagementReturn => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all users (cached after first load)
  const fetchAllUsers = useCallback(async () => {
    // Don't refetch if we already have users
    if (allUsers.length > 0) return;
    
    setLoading(true);
    try {
      const users = await getAllUsers();
      if (users) {
        setAllUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [allUsers.length]);

  // Search users by username (client-side filtering for performance)
  const searchUsersByUsername = useCallback((searchText: string) => {
    if (!searchText.trim()) {
      setSearchUsers([]);
      return;
    }
    
    const filtered = allUsers.filter(user =>
      user.username?.toLowerCase().includes(searchText.toLowerCase())
    ).slice(0, 10); // Limit to 10 results for performance
    
    setSearchUsers(filtered);
  }, [allUsers]);

  // Send invitation to user
  const sendInvitation = useCallback(async (
    userId: string, 
    currentUserId: string, 
    jobId?: string
  ): Promise<boolean> => {
    try {
      // Create inbox notification for invited user
      await createInbox(userId, currentUserId, 'invitation', 'request', "MIAW");
      
      message.success('Invitation sent successfully!');
      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      message.error('Failed to send invitation.');
      return false;
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchUsers([]);
  }, []);

  // Auto-fetch users on mount
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return {
    // Data
    allUsers,
    searchUsers,
    
    // State
    loading,
    
    // Actions
    fetchAllUsers,
    searchUsersByUsername,
    sendInvitation,
    clearSearch,
  };
};