import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "./location";
import { db } from "@/config/db";
import { sessions } from "@/drizzle/schema";
import { SESSION_LIFETIME } from "@/config/constant";

type CreateSessionData = {
  userId: number;
  token: string;
  ip: string;
  userAgent: string;
};

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex").normalize();
};

const createUserSession = async ({
  token,
  userId,
  ip,
  userAgent,
}: CreateSessionData) => {
  const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

  const [session] = await db.insert(sessions).values({
    id: hashedToken,
    userId,
    ip,
    userAgent,
    expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
  });

  return session;
};

export const createSessionAndCookies = async (userId: number) => {
  const token = generateSessionToken();
  const ip = await getIPAddress();
  const headersList = await headers();

  await createUserSession({
    userId,
    token,
    ip,
    userAgent: headersList.get("user-agent") || " ",
  });

  const createCookie = await cookies();

  createCookie.set("session", token, {
    secure: true,
    httpOnly: true,
    maxAge: SESSION_LIFETIME,
  });
};
