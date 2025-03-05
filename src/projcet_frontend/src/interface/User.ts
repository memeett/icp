export interface User {
  id: string;
  profilePicture: Blob;
  username: string;
  dob: string;
  description: string;
  wallet: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  isFaceRecognitionOn: boolean;
}

export interface UpdateUserPayload {
  username: [] | [string];
  profilePicture: [] | [Uint8Array | number[]];
  description: [] | [string];
  dob: [] | [string];
  isFaceRecognitionOn: [] | [boolean];
}
