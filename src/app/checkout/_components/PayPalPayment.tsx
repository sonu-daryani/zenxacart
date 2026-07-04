"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
  type OnApproveData,
} from "@paypal/react-paypal-js";

export function PayPalPayment({
  total,
  orderNumber,
  onSuccess,
  onError,
  onBack,
}: {
  total: number;
  orderNumber: string;
  onSuccess: (paypalOrderId: string) => void;
  onError: (msg: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          currency: "USD",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
          createOrder={async () => {
            const res = await fetch("/api/checkout/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: total, orderNumber }),
            });
            const data = (await res.json()) as { id?: string; error?: string };
            if (!data.id) throw new Error(data.error ?? "Could not create PayPal order");
            return data.id;
          }}
          onApprove={async (data: OnApproveData) => {
            const res = await fetch("/api/checkout/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            if (res.ok) {
              onSuccess(data.orderID);
            } else {
              const err = (await res.json()) as { error?: string };
              onError(err.error ?? "PayPal payment capture failed");
            }
          }}
          onError={() => onError("PayPal encountered an error. Please try again.")}
        />
      </PayPalScriptProvider>

      <button
        type="button"
        onClick={onBack}
        className="w-full rounded-lg border border-slate-200 py-3 text-sm font-medium text-zencarta-navy hover:bg-zencarta-surface"
      >
        Back to shipping
      </button>
    </div>
  );
}
