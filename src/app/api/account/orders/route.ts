import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { generateId, readDb, writeDb } from "@/lib/server/db";
import { createCjOrder, type StoreOrderInput } from "@/lib/cj/orders";
import { isCjConfigured } from "@/lib/cj/config";

export const dynamic = "force-dynamic";

/** GET — list the current user's orders. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await readDb();
  const orders = db.orders
    .filter((o) => o.userId === user.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return NextResponse.json({ orders });
}

/** POST — create an order tied to the logged-in user. */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<StoreOrderInput> & {
    total?: number;
    itemsCount?: number;
  };

  if (!body.orderNumber || !body.items?.length) {
    return NextResponse.json(
      { error: "orderNumber and items are required" },
      { status: 400 }
    );
  }

  let cjOrderId: string | undefined;
  let cjPayUrl: string | undefined;
  let sandbox = false;

  if (isCjConfigured()) {
    try {
      const result = await createCjOrder(body as StoreOrderInput);
      cjOrderId = result.orderId;
      cjPayUrl = result.cjPayUrl;
      sandbox = process.env.CJ_IS_SANDBOX === "1";
    } catch (err) {
      const message = err instanceof Error ? err.message : "CJ order failed";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  const itemsCount =
    body.itemsCount ??
    body.items.reduce((sum, i) => sum + (i.quantity ?? 1), 0);

  const stored = {
    id: generateId(),
    userId: user.id,
    orderNumber: body.orderNumber,
    date: new Date().toISOString(),
    status: "Processing" as const,
    total: Number(body.total ?? 0),
    items: itemsCount,
    cjOrderId,
  };

  await writeDb((db) => {
    db.orders.unshift(stored);
  });

  return NextResponse.json({
    success: true,
    order: stored,
    cjOrderId,
    cjPayUrl,
    sandbox,
  });
}
