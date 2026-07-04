import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getPayPalToken(): Promise<string> {
  const base = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
  const creds = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${creds}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { orderId } = (await req.json()) as { orderId: string };
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const base = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
  const token = await getPayPalToken();

  const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await res.json()) as { status?: string; message?: string };
  if (data.status !== "COMPLETED") {
    return NextResponse.json({ error: data.message ?? "Capture failed" }, { status: 502 });
  }
  return NextResponse.json({ status: data.status });
}
