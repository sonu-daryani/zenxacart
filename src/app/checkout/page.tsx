"use client";

import Link from "next/link";
import { ZencartaLogo } from "@/components/ZencartaLogo";
import { useState } from "react";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  MapPin,
  Truck,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { FormField } from "@/components/FormField";
import { OrderSummary, useOrderTotals } from "@/components/checkout/OrderSummary";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { PayPalPayment } from "./_components/PayPalPayment";
import { StripePayment } from "./_components/StripePayment";

type Step = "shipping" | "payment" | "done";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const { total } = useOrderTotals();

  const [step, setStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [cjOrderId, setCjOrderId] = useState<string | null>(null);
  const [cjPayUrl, setCjPayUrl] = useState<string | null>(null);

  const [shipping, setShipping] = useState({
    firstName: user?.name.split(" ")[0] ?? "",
    lastName: user?.name.split(" ").slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [payment, setPayment] = useState({
    cardName: user?.name ?? "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrderError("");

    const orderNumber = `ZC-${Date.now()}`;
    const customerName =
      `${shipping.firstName} ${shipping.lastName}`.trim() || "Customer";

    try {
      const res = await fetch("/api/cj/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          email: shipping.email,
          phone: shipping.phone,
          customerName,
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          zip: shipping.zip,
          country: "United States",
          countryCode: "US",
          items: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            cjPid: i.cjPid,
            cjVid: i.cjVid,
            cjSku: i.cjSku,
          })),
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        cjOrderId?: string;
        cjPayUrl?: string;
      };

      if (res.status === 503) {
        clearCart();
        setStep("done");
        return;
      }

      if (!res.ok) {
        setOrderError(data.error ?? "Could not submit order for fulfillment");
        return;
      }

      setCjOrderId(data.cjOrderId ?? null);
      setCjPayUrl(data.cjPayUrl ?? null);
      clearCart();
      setStep("done");
    } catch {
      setOrderError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== "done") {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <Truck className="mx-auto h-16 w-16 text-slate-200" />
          <h1 className="mt-4 text-2xl font-bold text-zencarta-navy">
            Nothing to checkout
          </h1>
          <p className="mt-2 text-zencarta-muted">
            Add items to your cart before checking out.
          </p>
          <Link
            href="/#products"
            className="mt-6 inline-block rounded-lg bg-zencarta-green px-6 py-3 text-sm font-semibold text-white uppercase hover:bg-zencarta-green-dark"
          >
            Shop Now
          </Link>
        </div>
      </PageShell>
    );
  }

  if (step === "done") {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-zencarta-green" />
          <h1 className="mt-4 text-2xl font-bold text-zencarta-navy">
            Order placed!
          </h1>
          <p className="mt-2 text-zencarta-muted">
            Thank you for shopping with Zencarta. A confirmation email was sent to{" "}
            {shipping.email || user?.email}.
          </p>
          {cjOrderId && (
            <p className="mt-3 text-sm font-medium text-zencarta-navy">
              CJ Order ID: {cjOrderId}
            </p>
          )}
          {cjPayUrl && (
            <a
              href={cjPayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-zencarta-green hover:underline"
            >
              Complete payment on CJ →
            </a>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/account"
              className="rounded-lg bg-zencarta-green px-6 py-3 text-sm font-semibold text-white uppercase hover:bg-zencarta-green-dark"
            >
              View Account
            </Link>
            <Link
              href="/#products"
              className="rounded-lg border-2 border-zencarta-green px-6 py-3 text-sm font-semibold text-zencarta-green uppercase hover:bg-zencarta-green/5"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const steps = [
    { id: "shipping" as const, label: "Shipping", icon: MapPin },
    { id: "payment" as const, label: "Payment", icon: CreditCard },
  ];

  return (
    <PageShell>
      <div className="bg-zencarta-surface py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-zencarta-navy">Checkout</h1>
          {!user && (
            <p className="mt-2 text-sm text-zencarta-muted">
              Already have an account?{" "}
              <Link
                href="/login?redirect=/checkout"
                className="font-semibold text-zencarta-green hover:underline"
              >
                Sign in
              </Link>{" "}
              for faster checkout.
            </p>
          )}

          <div className="mt-6 flex gap-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    step === s.id || (step === "payment" && s.id === "shipping")
                      ? "bg-zencarta-green text-white"
                      : "bg-slate-200 text-zencarta-muted"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden text-sm font-medium sm:block ${
                    step === s.id ? "text-zencarta-navy" : "text-zencarta-muted"
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className="mx-2 hidden h-px w-12 bg-slate-200 sm:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {step === "shipping" && (
                <form
                  onSubmit={handleShippingSubmit}
                  className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
                >
                  <h2 className="flex items-center gap-2 text-lg font-bold text-zencarta-navy">
                    <MapPin className="h-5 w-5 text-zencarta-green" />
                    Shipping address
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="First name"
                      id="firstName"
                      value={shipping.firstName}
                      onChange={(v) =>
                        setShipping((s) => ({ ...s, firstName: v }))
                      }
                      required
                      autoComplete="given-name"
                    />
                    <FormField
                      label="Last name"
                      id="lastName"
                      value={shipping.lastName}
                      onChange={(v) =>
                        setShipping((s) => ({ ...s, lastName: v }))
                      }
                      required
                      autoComplete="family-name"
                    />
                    <div className="sm:col-span-2">
                      <FormField
                        label="Email"
                        id="checkout-email"
                        type="email"
                        value={shipping.email}
                        onChange={(v) =>
                          setShipping((s) => ({ ...s, email: v }))
                        }
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FormField
                        label="Phone"
                        id="phone"
                        type="tel"
                        value={shipping.phone}
                        onChange={(v) =>
                          setShipping((s) => ({ ...s, phone: v }))
                        }
                        required
                        autoComplete="tel"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FormField
                        label="Street address"
                        id="address"
                        value={shipping.address}
                        onChange={(v) =>
                          setShipping((s) => ({ ...s, address: v }))
                        }
                        required
                        autoComplete="street-address"
                      />
                    </div>
                    <FormField
                      label="City"
                      id="city"
                      value={shipping.city}
                      onChange={(v) => setShipping((s) => ({ ...s, city: v }))}
                      required
                      autoComplete="address-level2"
                    />
                    <FormField
                      label="State"
                      id="state"
                      value={shipping.state}
                      onChange={(v) =>
                        setShipping((s) => ({ ...s, state: v }))
                      }
                      required
                      autoComplete="address-level1"
                    />
                    <FormField
                      label="ZIP code"
                      id="zip"
                      value={shipping.zip}
                      onChange={(v) => setShipping((s) => ({ ...s, zip: v }))}
                      required
                      autoComplete="postal-code"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-8 w-full rounded-lg bg-zencarta-green py-3.5 text-sm font-semibold text-white uppercase transition-colors hover:bg-zencarta-green-dark sm:w-auto sm:px-10"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === "payment" && (
                <div className="flex flex-col gap-2">
                    <PayPalPayment total={0} orderNumber={""} onSuccess={function (paypalOrderId: string): void {
                    throw new Error("Function not implemented.");
                  } } onError={function (msg: string): void {
                    throw new Error("Function not implemented.");
                  } } onBack={function (): void {
                    throw new Error("Function not implemented.");
                  } } />
                    <StripePayment clientSecret={null} total={0} onSuccess={function (paymentIntentId: string): void {
                    throw new Error("Function not implemented.");
                  } } onError={function (msg: string): void {
                    throw new Error("Function not implemented.");
                  } } onBack={function (): void {
                    throw new Error("Function not implemented.");
                  } } />
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <OrderSummary />
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-4">
                <div className="origin-left scale-75 opacity-90">
                  <ZencartaLogo variant="light" showTagline={false} href={false} />
                </div>
                <p className="text-xs text-zencarta-muted">
                  Secure checkout · 100% protected · 30-day easy returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
