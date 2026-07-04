import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { readDb, writeDb } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as Partial<{
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }>;

  const db = await readDb();
  const existing = db.addresses.find((a) => a.id === id && a.userId === user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writeDb((d) => {
    const idx = d.addresses.findIndex((a) => a.id === id);
    if (idx === -1) return;
    if (body.isDefault) {
      d.addresses.forEach((a) => {
        if (a.userId === user.id) a.isDefault = false;
      });
    }
    d.addresses[idx] = { ...d.addresses[idx], ...body };
  });

  const updated = (await readDb()).addresses.find((a) => a.id === id);
  return NextResponse.json({ address: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await writeDb((d) => {
    d.addresses = d.addresses.filter((a) => !(a.id === id && a.userId === user.id));
  });

  return NextResponse.json({ ok: true });
}
