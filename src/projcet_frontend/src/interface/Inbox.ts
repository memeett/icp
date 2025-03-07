export interface InboxResponse {
    id: string;
    senderName: string;
    receiverName: string;
    createdAt: string;
    read: boolean;
    message: string;
}