import { NextRequest, NextResponse } from "next/server";
import { isCjConfigured } from "@/lib/cj/config";
import { CjApiError } from "@/lib/cj/client";
import { createCjOrder, type StoreOrderInput } from "@/lib/cj/orders";

export async function POST(request: NextRequest) {
  if (!isCjConfigured()) {
    return NextResponse.json(
      {
        error: "CJ Dropshipping is not configured",
        hint: "Add CJ_API_KEY to .env.local (see .env.example)",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as StoreOrderInput;

    if (!body.orderNumber || !body.items?.length) {
      return NextResponse.json(
        { error: "orderNumber and items are required" },
        { status: 400 }
      );
    }

    const result = await createCjOrder(body);

    return NextResponse.json({
      success: true,
      cjOrderId: result.orderId,
      orderNumber: result.orderNumber,
      orderStatus: result.orderStatus,
      cjPayUrl: result.cjPayUrl,
      sandbox: process.env.CJ_IS_SANDBOX === "1",
    });
  } catch (error) {
    const message =
      error instanceof CjApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Order submission failed";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
