export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  appliedAt: number;
  status: ApplicationStatus;
}