import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { readDb, writeDb } from "@/lib/server/db";

export const dynamic = "force-dynamic";

type Body = { name?: string; email?: string };

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (name !== undefined && name.length === 0) {
    return NextResponse.json(
      { error: "Name cannot be empty." },
      { status: 400 }
    );
  }

  // Pre-check email uniqueness so we can return a clean 409.
  if (email && email !== user.email) {
    const db = await readDb();
    if (db.users.some((u) => u.id !== user.id && u.email === email)) {
      return NextResponse.json(
        { error: "That email is already in use." },
        { status: 409 }
      );
    }
  }

  await writeDb((db) => {
    const u = db.users.find((u) => u.id === user.id);
    if (!u) return;
    if (name) u.name = name;
    if (email && email !== u.email) u.email = email;
  });

  const db = await readDb();
  const updated = db.users.find((u) => u.id === user.id);
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: { id: updated.id, name: updated.name, email: updated.email },
  });
}
