export interface User{
    id: string;
    profilePicture: Blob;
    username: string;
    email: string;
    description: string;
    wallet: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
    isFaceRecognitionOn: boolean;
}

export interface UpdateUserPayload {
    username: [] | [string];
    email: [] | [string];
    description: [] | [string];
};