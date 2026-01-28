"use server";
import { db } from "@/config/db";
import { JobsFormData, jobsSchema } from "../employers/jobs/JobsSchema";
import { jobs } from "@/drizzle/schema";
import { getCurrentUser } from "../auth/server/auth.queries";
import { and, eq } from "drizzle-orm";
import { Job } from "../employers/jobs/types/JobTypes";

export const createJobAction = async (data: JobsFormData) => {
  try {
    const { success, data: result, error } = jobsSchema.safeParse(data);

    if (!success) {
      console.log("Zod Validation Error:", error.flatten());
      console.log("Recived Data :", data);

      return {
        status: "ERROR",
        message: error.issues[0].message,
      };
    }

    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized access." };
    }

    await db.insert(jobs).values({ ...result, employerId: currentUser.id });
    return { status: "SUCCESS", message: "Job Created Successfully" };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Something went wrong, please try again",
    };
  }
};

// //to fetch the data from the jobs table
// type GetEmployerJobsResponse = {
//   status: "SUCCESS" | "ERROR";
//   data?: Job[];
//   message?: string;
// };

export const getEmployerJobsAction = async (): Promise<{
  status: "SUCCESS" | "ERROR";
  data?: Job[];
  message?: string;
}> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", data: [] };
    }

    const result = await db
      .select()
      .from(jobs)
      .where(eq(jobs.employerId, currentUser.id))
      .orderBy(jobs.createdAt);

    return { status: "SUCCESS", data: result as Job[] };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Something went wrong",
    };
  }
};

// Delete Job Post
//deleteJobAction
export const deleteJobAction = async (jobId: number) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    // Ensure the employer can only delete their own jobs
    await db
      .delete(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, currentUser.id)));

    // Optional: clear cache for the jobs page
    // revalidatePath("/dashboard/jobs");

    return { status: "SUCCESS", message: "Job deleted successfully" };
  } catch (error) {
    console.error("DELETE_JOB_ERROR", error);
    return { status: "ERROR", message: "Something went wrong while deleting" };
  }
};

export const getJobByIdAction = async (jobId: number) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { status: "ERROR", message: "Unauthorized" };

    // Use db.select() instead of db.query
    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, currentUser.id)))
      .limit(1);

    if (!job) {
      return { status: "ERROR", message: "Job not found" };
    }

    return { status: "SUCCESS", data: job };
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch job details" };
  }
};

// Replace 'JobFormValues' with your Zod schema type
export const updateJobAction = async (jobId: number, values: any) => {
  try {
    const currentUser = await getCurrentUser();

    // Security check
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    // Perform the Update
    await db
      .update(jobs)
      .set({
        ...values,
        updatedAt: new Date(), // Always update the timestamp
      })
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, currentUser.id)));

    // Refresh the jobs list page so the new data shows up immediately
    // revalidatePath("/employer-dashboard/jobs");

    return { status: "SUCCESS", message: "Job updated successfully" };
  } catch (error) {
    return { status: "ERROR", message: "Failed to update job" };
  }
};
