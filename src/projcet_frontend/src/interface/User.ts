export interface User{
    id: string;
    profilePicture: string;
    username: string;
    email: string;
    description: string;
    wallet: number;
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