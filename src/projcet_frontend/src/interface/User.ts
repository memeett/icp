import { JobCategory } from "./job/Job";


export interface User {
  id: string;
  profilePicture: Blob | null;
  username: string;
  dob: string;
  preference: JobCategory[];
  description: string;
  wallet: number;
  rating: number;
  createdAt: bigint;
  updatedAt: bigint;
  isFaceRecognitionOn: boolean;
  isProfileCompleted: boolean;
}
export interface UpdateUserPayload {
  username: [] | [string];
  profilePicture: [] | [Uint8Array | number[]];
  description: [] | [string];
  dob: [] | [string];
  isFaceRecognitionOn: [] | [boolean];
  preference: [] | [JobCategory[]];
  isProfileCompleted: [] | [boolean];
}
