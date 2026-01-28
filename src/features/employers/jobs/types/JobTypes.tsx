import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";

// types/job.types.ts or features/jobs/job.types.ts
export type JobType = (typeof JOB_TYPE)[number];
export type WorkType = (typeof WORK_TYPE)[number];
export type JobLevel = (typeof JOB_LEVEL)[number];
export type SalaryCurrency = (typeof SALARY_CURRENCY)[number];
export type SalaryPeriod = (typeof SALARY_PERIOD)[number];
export type MinEducation = (typeof MIN_EDUCATION)[number];

export interface Job {
  id: number;
  title: string;
  description: string;
  employerId: number;

  jobType: JobType;
  workType: WorkType;
  jobLevel: JobLevel;

  location: string | null;
  tags: string | null;

  minSalary: number | null;
  maxSalary: number | null;
  salaryCurrency: SalaryCurrency | null;
  salaryPeriod: SalaryPeriod | null;

  minEducation: MinEducation | null;
  experience: string | null;

  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobCardProps {
  job: Job;
  onEdit?: (jobId: number) => void;
  onDelete?: (jobId: number) => void;
}
