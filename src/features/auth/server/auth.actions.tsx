"use server";

import { db } from "@/config/db";
import { applicants, employers, users } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import { RegisterUserData, registerUserSchema } from "../auth.schema";
import {
  createSessionAndCookies,
  invalidDateSession,
} from "./use-cases/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

export const registrationAction = async (data: RegisterUserData) => {
  try {
    const { data: validatedData, error } = registerUserSchema.safeParse(data);
    if (error) return { status: "ERROR", message: error.issues[0].message };

    // console.log(formData.get("name"));
    const { name, userName, email, password, role } = validatedData;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.userName, userName)));

    if (user) {
      if (user.email === email) {
        return {
          status: "ERROR",
          message: "Email is already registered",
        };
      }
      if (user.userName === userName) {
        return {
          status: "ERROR",
          message: "Username is already taken",
        };
      }
    }

    const hashPassword = await argon2.hash(password);

    await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(users)
        .values({ name, userName, email, password: hashPassword, role });

      // console.log(result);

      if (role === "applicant") {
        await tx.insert(applicants).values({ id: result.insertId });
      } else {
        await tx.insert(employers).values({ id: result.insertId });
      }

      await createSessionAndCookies(result.insertId, tx);
    });

    return {
      status: "SUCCESS",
      message: "Registration Completed Successfully",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Unknown Error Occurred! Please Try Again Later",
    };
  }
};

type loginData = {
  email: string;
  password: string;
};

export const loginAction = async (data: loginData) => {
  try {
    // console.log(formData.get("name"));
    const { email, password } = data;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return {
        status: "ERROR",
        message: "Email not registered",
      };
    }

    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      return {
        status: "ERROR",
        message: "Password is incorrect",
      };
    }

    await createSessionAndCookies(user.id);

    return {
      status: "SUCCESS",
      message: "Login Completed Successfully",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Unknown Error Occurred! Please Try Again Later",
    };
  }
};

// logout user by deleting session and cookie
export const logoutUserAction = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return redirect("/login");

  const hashedToken = crypto
    .createHash("sha-256")
    .update(sessionToken)
    .digest("hex");

  await invalidDateSession(hashedToken);

  cookieStore.delete("session");

  return redirect("/login");
};
