export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  type?: JobType;
  requiredSkills?: string;
  postedAt: number;
  companyId: string;
}