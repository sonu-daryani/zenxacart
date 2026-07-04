import { NextRequest, NextResponse } from "next/server";
import {
  generateId,
  hashPassword,
  readDb,
  seedUserDemoData,
  writeDb,
} from "@/lib/server/db";
import { setSessionCookie } from "@/lib/server/session";

export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const name = body.name?.trim() ?? email.split("@")[0];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }

  const db = await readDb();
  if (db.users.some((u) => u.email === email)) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const user = {
    id: generateId(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  await writeDb((d) => {
    d.users.push(user);
  });

  await seedUserDemoData(user.id);
  await setSessionCookie(user.id);

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
}
