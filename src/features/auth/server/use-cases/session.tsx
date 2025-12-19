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
  tx?: DbClient;
};

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex").normalize();
};

const createUserSession = async ({
  token,
  userId,
  ip,
  userAgent,
  tx = db,
}: CreateSessionData) => {
  const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

  const [session] = await tx.insert(sessions).values({
    id: hashedToken,
    userId,
    ip,
    userAgent,
    expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
  });

  return session;
};

// Give me the type of the first parameter of the callback inside db.transaction — that's the tx object
type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

export const createSessionAndCookies = async (
  userId: number,
  tx: DbClient = db
) => {
  const token = generateSessionToken();
  const ip = await getIPAddress();
  const headersList = await headers();

  await createUserSession({
    userId,
    token,
    ip,
    userAgent: headersList.get("user-agent") || " ",
    tx,
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
        userAgent: sessions.userAgent,
        ip: sessions.ip,
      },
      name: users.name,
      userName: users.userName,
      role: users.role,
      phoneNumber: users.phoneNumber,
      email: users.email,
      // emailVerifiedAt: users.emailVerifiedAt,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
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
