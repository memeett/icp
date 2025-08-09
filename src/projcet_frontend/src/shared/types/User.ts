import { JobCategory } from './Job';

export interface User {
  id: string;
  username: string;
  email?: string;
  profilePicture?: Blob | null;
  description?: string;
  dob?: string;
  preference: JobCategory[];
  isFaceRecognitionOn?: boolean;
  balance?: number;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface UpdateUserPayload {
  username?: string[];
  profilePicture?: Uint8Array[];
  description?: string[];
  dob?: string[];
  preference: JobCategory[];
  isFaceRecognitionOn?: boolean[];
}

export interface UserProfile extends Omit<User, 'profilePicture'> {
  profilePictureUrl?: string;
  jobsCompleted?: number;
  rating?: number;
  totalEarnings?: number;
}