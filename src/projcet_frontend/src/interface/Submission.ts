import { User } from "./User";

export interface Submission {
    id: string;
    jobId: string;
    user: User;
    submissionStatus: string;
    submissionMessage?: string;
    submissionFile?: Blob;
  }
  