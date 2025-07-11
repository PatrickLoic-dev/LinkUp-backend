import { Experience } from './Experience';
import { Education } from './Education';

export interface User {
  id: string;
  accountId: string;
  name: string;
  role?: string;
  bio?: string;
  profileImage?: string;
  skills?: string;
  experiences?: Experience[];
  education?: Education[];
  savedJobs?: string[];
}