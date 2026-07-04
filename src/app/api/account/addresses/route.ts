import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { generateId, readDb, writeDb } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await readDb();
  const addresses = db.addresses.filter((a) => a.userId === user.id);
  return NextResponse.json({ addresses });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    isDefault?: boolean;
  };

  const { name, street, city, state, zip, country = "United States", isDefault = false } = body;

  if (!name || !street || !city || !state || !zip) {
    return NextResponse.json({ error: "name, street, city, state, and zip are required" }, { status: 400 });
  }

  const newAddress = {
    id: generateId(),
    userId: user.id,
    name,
    street,
    city,
    state,
    zip,
    country,
    isDefault,
  };

  await writeDb((db) => {
    if (isDefault) {
      db.addresses.forEach((a) => {
        if (a.userId === user.id) a.isDefault = false;
      });
    }
    db.addresses.push(newAddress);
  });

  return NextResponse.json({ address: newAddress }, { status: 201 });
}
