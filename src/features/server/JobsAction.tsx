"use server";
import { db } from "@/config/db";
import { JobsFormData, jobsSchema } from "../employers/jobs/JobsSchema";
import { jobs } from "@/drizzle/schema";
import { getCurrentUser } from "../auth/server/auth.queries";

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
