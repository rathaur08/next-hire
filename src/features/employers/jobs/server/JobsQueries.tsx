import { db } from "@/config/db";
import { employers, jobs, users } from "@/drizzle/schema";
import { and, desc, eq, gte, isNull, or } from "drizzle-orm";

export async function getAllJobs() {
  //
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const jobsData = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,
      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      createdAt: jobs.createdAt,
      companyName: employers.name,
      companyLogo: users.avatarUrl,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(
      and(
        isNull(jobs.deletedAt),
        or(isNull(jobs.expiresAt), gte(jobs.expiresAt, today)),
      ),
    )
    .orderBy(desc(jobs.createdAt));

  return jobsData;
}

export type JobCardType = Awaited<ReturnType<typeof getAllJobs>>[number];

export async function getJobById(jobId: number) {
  const job = await db
    .select({
      // Basic Info
      id: jobs.id,
      title: jobs.title,
      description: jobs.description, // Full HTML description
      tags: jobs.tags,

      // Salary Details
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,

      // Job Meta Data (Crucial for Sidebar)
      location: jobs.location,
      jobType: jobs.jobType, // e.g. "remote"
      workType: jobs.workType, // e.g. "full-time"
      jobLevel: jobs.jobLevel, // e.g. "senior"
      experience: jobs.experience, // e.g. "3-5 years"
      minEducation: jobs.minEducation, // e.g. "bachelors"

      // Timestamps
      createdAt: jobs.createdAt,
      expiresAt: jobs.expiresAt,

      // Employer Info (Joined)
      companyLogo: users.avatarUrl,
      companyName: employers.name,
      companyBio: employers.description, // Good to show "About Company"
      companyWebsite: employers.websiteUrl,
      companyLocation: employers.location,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(eq(jobs.id, jobId)) // 🎯 Filter by the specific ID
    .limit(1); // We only want one result

  // Return the first item (or undefined if not found)
  return job[0];
}

// 🪄 Create the Type for the Details Page
export type JobDetailsType = Awaited<ReturnType<typeof getJobById>>;
