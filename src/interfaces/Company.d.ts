import { Job } from "./Job";

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  jobOffers?: Job[];
}