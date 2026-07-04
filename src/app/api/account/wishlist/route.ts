import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { readDb, writeDb, type WishlistEntry } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await readDb();
  return NextResponse.json({ items: db.wishlists[user.id] ?? [] });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    productId?: string;
  };
  if (!body.productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  const productId = body.productId;

  await writeDb((db) => {
    const list = db.wishlists[user.id] ?? [];
    if (!list.some((w) => w.productId === productId)) {
      const entry: WishlistEntry = {
        productId,
        addedAt: new Date().toISOString(),
      };
      db.wishlists[user.id] = [entry, ...list];
    }
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    productId?: string;
  };
  if (!body.productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  await writeDb((db) => {
    const list = db.wishlists[user.id] ?? [];
    db.wishlists[user.id] = list.filter(
      (w) => w.productId !== body.productId
    );
  });

  return NextResponse.json({ success: true });
}
