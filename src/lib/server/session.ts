import { cookies } from "next/headers";
import crypto from "crypto";
import {
  readDb,
  type StoredUser,
  verifyPassword,
} from "./db";

const SESSION_COOKIE = "zencarta_session";
const SESSION_TTL_DAYS = 7;

/**
 * Stateless HMAC-signed session cookie. Payload is `<userId>.<expiry>`,
 * signed with SESSION_SECRET. In a real app you'd use a KV/Redis store.
 */
function getSecret(): string {
  return (
    process.env.SESSION_SECRET ??
    "dev-only-insecure-secret-change-me-in-production"
  );
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
}

export function createSessionToken(userId: string): string {
  const expiry = Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${expiry}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expiryStr, signature] = parts;
  const payload = `${userId}.${expiryStr}`;
  if (sign(payload) !== signature) return null;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null;
  return userId;
}

export async function setSessionCookie(userId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<StoredUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = verifySessionToken(token);
  if (!userId) return null;
  const db = await readDb();
  return db.users.find((u) => u.id === userId) ?? null;
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export async function authenticate(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const db = await readDb();
  const normalized = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email === normalized);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}
