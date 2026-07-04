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
  const { amount, currency = "USD", orderNumber } = (await req.json()) as {
    amount: number;
    currency?: string;
    orderNumber: string;
  };

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const base = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
  const token = await getPayPalToken();

  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderNumber,
          amount: { currency_code: currency, value: amount.toFixed(2) },
        },
      ],
    }),
  });

  const data = (await res.json()) as { id?: string; message?: string };
  if (!data.id) {
    return NextResponse.json({ error: data.message ?? "PayPal error" }, { status: 502 });
  }
  return NextResponse.json({ id: data.id });
}
