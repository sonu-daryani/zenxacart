"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const appearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: {
    colorPrimary: "#22c55e",
    colorText: "#1a2332",
    colorDanger: "#ef4444",
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "8px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "1px solid #e2e8f0", boxShadow: "none" },
    ".Input:focus": { border: "1px solid #22c55e", boxShadow: "none" },
    ".Label": { color: "#1a2332", fontWeight: "500" },
  },
};

function StripeForm({
  total,
  onSuccess,
  onError,
  onBack,
}: {
  total: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (msg: string) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message ?? "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      onError("Payment could not be completed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: "tabs",
          fields: { billingDetails: { name: "auto", email: "auto" } },
        }}
      />
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-medium text-zencarta-navy hover:bg-zencarta-surface"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zencarta-green py-3.5 text-sm font-semibold text-white uppercase transition-colors hover:bg-zencarta-green-dark disabled:opacity-60 sm:flex-none sm:px-10"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          Pay ${total.toFixed(2)}
        </button>
      </div>
    </form>
  );
}

export function StripePayment({
  clientSecret,
  total,
  onSuccess,
  onError,
  onBack,
}: {
  clientSecret: string | null;
  total: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (msg: string) => void;
  onBack: () => void;
}) {
  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-zencarta-green" />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance }}
    >
      <StripeForm
        total={total}
        onSuccess={onSuccess}
        onError={onError}
        onBack={onBack}
      />
    </Elements>
  );
}
