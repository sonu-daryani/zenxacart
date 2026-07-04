import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { readDb } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await readDb();
  const userOrders = db.orders.filter((o) => o.userId === user.id);
  const wishlist = db.wishlists[user.id] ?? [];
  // 10 points per $1 of completed order value, capped per order.
  const rewardPoints = userOrders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + Math.min(Math.floor(o.total * 10), 5000), 0);

  return NextResponse.json({
    totalOrders: userOrders.length,
    wishlistCount: wishlist.length,
    rewardPoints,
  });
}
