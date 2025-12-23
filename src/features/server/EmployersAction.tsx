"use server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth/server/auth.queries";
import { db } from "@/config/db";
import { employers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmployerProfileData } from "../employers/EmployerSchema";

// interface IFormInput {
//   name: string;
//   description: string;
//   organizationType: string;
//   teamSize: string;
//   yearOfEstablishment: string;
//   websiteUrl: string;
//   location: string;
// }

export const updateEmployerProfileAction = async (
  data: EmployerProfileData
) => {
  try {
    const currentUser = await getCurrentUser();

    // if (!currentUser) return redirect("/login");
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized access." };
    }

    const {
      name,
      description,
      organizationType,
      teamSize,
      yearOfEstablishment,
      websiteUrl,
      location,
    } = data;

    const updateEmployer = await db
      .update(employers)
      .set({
        name,
        description,
        organizationType,
        teamSize,
        yearOfEstablishment: yearOfEstablishment
          ? parseInt(yearOfEstablishment)
          : null,
        websiteUrl,
        location,
      })
      .where(eq(employers.id, currentUser.id));

    // console.log("Update profile data:", updateEmployer);

    return { status: "SUCCESS", message: "Profile Update Successfully" };

    // console.log("currentEmployer: ", employer);
  } catch (error) {
    return {
      status: "ERROR",
      message: "Something went wrong, please try again",
    };
  }
};
