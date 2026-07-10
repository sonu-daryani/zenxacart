"use client";

import Link from "next/link";
import { ZencartaLogo } from "@/components/ZencartaLogo";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
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
          <Truck className="mx-auto h-16 w-16 text-slate-200 dark:text-slate-700" />
          <h1 className="mt-4 text-2xl font-bold text-zencarta-navy dark:text-slate-100">
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-lg px-4 py-24 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
          >
            <CheckCircle className="mx-auto h-16 w-16 text-zencarta-green" />
          </motion.div>
          <h1 className="mt-4 text-2xl font-bold text-zencarta-navy dark:text-slate-100">
            Order placed!
          </h1>
          <p className="mt-2 text-zencarta-muted">
            Thank you for shopping with Zencarta. A confirmation email was sent to{" "}
            {shipping.email || user?.email}.
          </p>
          {cjOrderId && (
            <p className="mt-3 text-sm font-medium text-zencarta-navy dark:text-slate-100">
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
        </motion.div>
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
          <h1 className="text-3xl font-bold text-zencarta-navy dark:text-slate-100">Checkout</h1>
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
            {steps.map((s, i) => {
              const filled =
                step === s.id || (step === "payment" && s.id === "shipping");
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: filled ? 1 : 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      filled
                        ? "bg-zencarta-green text-white"
                        : "bg-slate-200 text-zencarta-muted dark:bg-[#16281b]"
                    }`}
                  >
                    {i + 1}
                  </motion.div>
                  <span
                    className={`hidden text-sm font-medium sm:block ${
                      step === s.id ? "text-zencarta-navy dark:text-slate-100" : "text-zencarta-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="relative mx-2 hidden h-px w-12 overflow-hidden bg-slate-200 sm:block dark:bg-[#16281b]">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-zencarta-green"
                        animate={{ width: step === "payment" ? "100%" : "0%" }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
            <AnimatePresence mode="wait" initial={false}>
              {step === "shipping" && (
                <motion.form
                  key="shipping"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onSubmit={handleShippingSubmit}
                  className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 dark:border-[#1f3524] dark:bg-[#0e1c12]"
                >
                  <h2 className="flex items-center gap-2 text-lg font-bold text-zencarta-navy dark:text-slate-100">
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
                </motion.form>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col gap-2"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            <div className="lg:col-span-2">
              <OrderSummary />
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-4 dark:border-[#1f3524] dark:bg-[#0e1c12]">
                <div className="origin-left scale-75 opacity-90">
                  <ZencartaLogo variant="auto" showTagline={false} href={false} />
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
