import { NextRequest, NextResponse } from "next/server";
import { cjConfig } from "@/lib/cj/config";

/**
 * CJ webhook receiver — configure URL in CJ Dashboard → Webhook.
 * Handles inventory, order status, and logistics updates.
 * @see https://developers.cjdropshipping.cn/en/api/start/webhook.html
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-cj-webhook-secret");
  if (cjConfig.webhookSecret && secret !== cjConfig.webhookSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);

  if (process.env.NODE_ENV === "development") {
    console.info("[CJ Webhook]", JSON.stringify(payload, null, 2));
  }

  // Extend: persist order status, sync inventory, notify customer
  return NextResponse.json({ received: true });
}
