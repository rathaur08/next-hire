import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "./location";
import { db } from "@/config/db";
import { sessions, users } from "@/drizzle/schema";
import { SESSION_LIFETIME, SESSION_REFRESH_TIME } from "@/config/constant";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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

export const validateSessionAndGetUser = async (session: string) => {
  //
  const hashedToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");

  const [user] = await db
    .select({
      id: users.id,
      session: {
        id: sessions.id,
        expiresAt: sessions.expiresAt,
        ip: sessions.ip,
      },
      name: users.name,
      usersName: users.userName,
      email: users.email,
      role: users.role,
      phoneNumber: users.phoneNumber,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .where(eq(sessions.id, hashedToken))
    .innerJoin(users, eq(users.id, sessions.userId));

  if (!user) return null;

  // after getting user check session expiry
  if (Date.now() >= user.session.expiresAt.getTime()) {
    await invalidDateSession(user.session.id);
    return null;
  }

  // session is valid, extend session expiry
  if (
    Date.now() >=
    user.session.expiresAt.getTime() - SESSION_REFRESH_TIME * 1000
  ) {
    await db
      .update(sessions)
      .set({
        expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
      })
      .where(eq(sessions.id, user.session.id));
  }

  return user;
};

// invalidate session by id
export const invalidDateSession = async (id: string) => {
  await db.delete(sessions).where(eq(sessions.id, id));
};
