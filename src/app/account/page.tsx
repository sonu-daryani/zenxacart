"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  LogOut,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { FormField } from "@/components/FormField";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { useAuth } from "@/context/AuthContext";

type AccountOrder = {
  id: string;
  orderNumber: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  total: number;
  items: number;
};

type AccountStats = {
  totalOrders: number;
  wishlistCount: number;
  rewardPoints: number;
};

type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

type AddressForm = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

const emptyAddressForm = (): AddressForm => ({
  name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  isDefault: false,
});

type Tab = "overview" | "orders" | "profile" | "addresses";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "profile", label: "Profile", icon: Settings },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, logout, updateProfile } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddressForm());
  const [addressSaving, setAddressSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, user, router]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let cancelled = false;
    if (!user) return;

    setLoadingOrders(true);

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/account/orders", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load orders");
        const data = (await res.json()) as { orders: AccountOrder[] };
        if (!cancelled) setOrders(data.orders);
      } catch {
        if (!cancelled) setAccountError("Unable to load your orders.");
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/account/stats", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load stats");
        const data = (await res.json()) as AccountStats;
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setAccountError("Unable to load account stats.");
      }
    };

    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/account/addresses", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load addresses");
        const data = (await res.json()) as { addresses: Address[] };
        if (!cancelled) setAddresses(data.addresses);
      } catch {
        /* non-critical — leave addresses empty */
      } finally {
        if (!cancelled) setLoadingAddresses(false);
      }
    };

    fetchOrders();
    fetchStats();
    fetchAddresses();

    return () => {
      cancelled = true;
    };
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (isLoading || !user) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
        </div>
      </PageShell>
    );
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <PageShell>
      <div className="bg-zencarta-surface py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zencarta-navy dark:text-slate-100">
                My Account
              </h1>
              <p className="mt-1 text-zencarta-muted">
                Welcome back, {user.name}
              </p>
              {accountError && (
                <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  {accountError}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-zencarta-navy transition-colors hover:border-red-200 hover:text-red-600 dark:border-[#1f3524] dark:bg-[#0e1c12] dark:text-slate-100 dark:hover:border-red-900/50 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-56">
              <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      tab === id
                        ? "bg-zencarta-green text-white"
                        : "bg-white text-zencarta-navy hover:bg-zencarta-green/10 hover:text-zencarta-green dark:bg-[#0e1c12] dark:text-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
              {tab === "overview" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zencarta-green/15 text-xl font-bold text-zencarta-green">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-zencarta-navy dark:text-slate-100">
                          {user.name}
                        </p>
                        <p className="text-sm text-zencarta-muted">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Reveal
                    variants={staggerContainer}
                    className="grid gap-4 sm:grid-cols-3"
                  >
                    {[
                      { label: "Total orders", value: stats?.totalOrders ?? 0 },
                      { label: "Wishlist items", value: stats?.wishlistCount ?? 0 },
                      { label: "Reward points", value: stats?.rewardPoints ?? 0 },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        variants={fadeInUp}
                        className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]"
                      >
                        <p className="text-2xl font-bold text-zencarta-green">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-zencarta-muted">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </Reveal>

                  <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]">
                    <h2 className="font-bold text-zencarta-navy dark:text-slate-100">
                      Recent orders
                    </h2>
                    {loadingOrders ? (
                      <div className="mt-4 flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
                      </div>
                    ) : orders.length === 0 ? (
                      <p className="mt-4 text-sm text-zencarta-muted">
                        No recent orders found.
                      </p>
                    ) : (
                      <ul className="mt-4 divide-y divide-slate-100 dark:divide-[#1f3524]">
                        {orders.slice(0, 2).map((order) => (
                          <li
                            key={order.id}
                            className="flex flex-wrap items-center justify-between gap-2 py-4 first:pt-0"
                          >
                            <div>
                              <p className="font-medium text-zencarta-navy dark:text-slate-100">
                                {order.orderNumber}
                              </p>
                              <p className="text-xs text-zencarta-muted">
                                {new Date(order.date).toLocaleDateString()} · {order.items}{" "}
                                item{order.items > 1 ? "s" : ""}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                order.status === "Delivered"
                                  ? "bg-zencarta-green/10 text-zencarta-green-dark"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                              }`}
                            >
                              {order.status}
                            </span>
                            <p className="w-full font-semibold text-zencarta-navy sm:w-auto dark:text-slate-100">
                              ${order.total.toFixed(2)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      type="button"
                      onClick={() => setTab("orders")}
                      className="mt-2 text-sm font-semibold text-zencarta-green hover:underline"
                    >
                      View all orders →
                    </button>
                  </div>

                  <Link
                    href="/#products"
                    className="inline-block rounded-lg bg-zencarta-green px-6 py-3 text-sm font-semibold text-white uppercase hover:bg-zencarta-green-dark"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}

              {tab === "orders" && (
                <div className="rounded-xl border border-slate-100 bg-white shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]">
                  <div className="border-b border-slate-100 px-6 py-4 dark:border-[#1f3524]">
                    <h2 className="font-bold text-zencarta-navy dark:text-slate-100">
                      Order history
                    </h2>
                  </div>
                  {loadingOrders ? (
                    <div className="p-10 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-zencarta-green" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-10 text-center text-sm text-zencarta-muted">
                      No orders have been placed yet.
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-[#1f3524]">
                      {orders.map((order) => (
                        <li
                          key={order.id}
                          className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zencarta-surface">
                              <Package className="h-5 w-5 text-zencarta-green" />
                            </div>
                            <div>
                              <p className="font-semibold text-zencarta-navy dark:text-slate-100">
                                Order {order.orderNumber}
                              </p>
                              <p className="text-sm text-zencarta-muted">
                                Placed {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:text-right">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                order.status === "Delivered"
                                  ? "bg-zencarta-green/10 text-zencarta-green-dark"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                              }`}
                            >
                              {order.status}
                            </span>
                            <p className="font-bold text-zencarta-navy dark:text-slate-100">
                              ${order.total.toFixed(2)}
                            </p>
                            <button
                              type="button"
                              className="text-sm font-medium text-zencarta-green hover:underline"
                            >
                              Track
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {tab === "profile" && (
                <form
                  onSubmit={handleProfileSave}
                  className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12] sm:p-8"
                >
                  <h2 className="font-bold text-zencarta-navy dark:text-slate-100">
                    Profile settings
                  </h2>
                  <p className="mt-1 text-sm text-zencarta-muted">
                    Update your personal information
                  </p>
                  {saved && (
                    <p className="mt-4 rounded-lg bg-zencarta-green/10 px-4 py-2 text-sm font-medium text-zencarta-green-dark">
                      Profile saved successfully
                    </p>
                  )}
                  <div className="mt-6 max-w-md space-y-4">
                    <FormField
                      label="Full name"
                      id="profile-name"
                      value={name}
                      onChange={setName}
                      required
                    />
                    <FormField
                      label="Email"
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-6 rounded-lg bg-zencarta-green px-6 py-2.5 text-sm font-semibold text-white uppercase hover:bg-zencarta-green-dark"
                  >
                    Save changes
                  </button>
                </form>
              )}

              {tab === "addresses" && (
                <div className="space-y-4">
                  {loadingAddresses ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
                    </div>
                  ) : (
                    <>
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              {addr.isDefault && (
                                <p className="text-xs font-semibold tracking-wide text-zencarta-green uppercase">
                                  Default
                                </p>
                              )}
                              <p className="mt-1 font-semibold text-zencarta-navy dark:text-slate-100">
                                {addr.name}
                              </p>
                              <p className="mt-1 text-sm text-zencarta-muted">
                                {addr.street}
                                <br />
                                {addr.city}, {addr.state} {addr.zip}
                                <br />
                                {addr.country}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAddressId(addr.id);
                                  setAddressForm({
                                    name: addr.name,
                                    street: addr.street,
                                    city: addr.city,
                                    state: addr.state,
                                    zip: addr.zip,
                                    country: addr.country,
                                    isDefault: addr.isDefault,
                                  });
                                  setShowAddressForm(true);
                                }}
                                className="text-sm font-medium text-zencarta-green hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  await fetch(`/api/account/addresses/${addr.id}`, {
                                    method: "DELETE",
                                  });
                                  setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
                                }}
                                className="text-sm font-medium text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {addresses.length === 0 && !showAddressForm && (
                        <p className="rounded-xl border border-slate-100 bg-white p-6 text-sm text-zencarta-muted shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12]">
                          No saved addresses yet.
                        </p>
                      )}
                    </>
                  )}

                  {showAddressForm ? (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setAddressSaving(true);
                        try {
                          if (editingAddressId) {
                            const res = await fetch(
                              `/api/account/addresses/${editingAddressId}`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(addressForm),
                              }
                            );
                            const data = (await res.json()) as { address: Address };
                            setAddresses((prev) =>
                              prev.map((a) => (a.id === editingAddressId ? data.address : a))
                            );
                          } else {
                            const res = await fetch("/api/account/addresses", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(addressForm),
                            });
                            const data = (await res.json()) as { address: Address };
                            setAddresses((prev) => [...prev, data.address]);
                          }
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                          setAddressForm(emptyAddressForm());
                        } finally {
                          setAddressSaving(false);
                        }
                      }}
                      className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-[#1f3524] dark:bg-[#0e1c12] space-y-4"
                    >
                      <h3 className="font-bold text-zencarta-navy dark:text-slate-100">
                        {editingAddressId ? "Edit address" : "New address"}
                      </h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <FormField
                            label="Full name"
                            id="addr-name"
                            value={addressForm.name}
                            onChange={(v) => setAddressForm((f) => ({ ...f, name: v }))}
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <FormField
                            label="Street address"
                            id="addr-street"
                            value={addressForm.street}
                            onChange={(v) => setAddressForm((f) => ({ ...f, street: v }))}
                            required
                          />
                        </div>
                        <FormField
                          label="City"
                          id="addr-city"
                          value={addressForm.city}
                          onChange={(v) => setAddressForm((f) => ({ ...f, city: v }))}
                          required
                        />
                        <FormField
                          label="State"
                          id="addr-state"
                          value={addressForm.state}
                          onChange={(v) => setAddressForm((f) => ({ ...f, state: v }))}
                          required
                        />
                        <FormField
                          label="ZIP code"
                          id="addr-zip"
                          value={addressForm.zip}
                          onChange={(v) => setAddressForm((f) => ({ ...f, zip: v }))}
                          required
                        />
                        <FormField
                          label="Country"
                          id="addr-country"
                          value={addressForm.country}
                          onChange={(v) => setAddressForm((f) => ({ ...f, country: v }))}
                          required
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-zencarta-navy dark:text-slate-100">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))
                          }
                          className="rounded border-slate-300 text-zencarta-green focus:ring-zencarta-green dark:border-[#2a4530]"
                        />
                        Set as default address
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={addressSaving}
                          className="rounded-lg bg-zencarta-green px-5 py-2.5 text-sm font-semibold text-white uppercase hover:bg-zencarta-green-dark disabled:opacity-60"
                        >
                          {addressSaving ? "Saving…" : "Save address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddressId(null);
                            setAddressForm(emptyAddressForm());
                          }}
                          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-zencarta-navy hover:border-slate-300 dark:border-[#1f3524] dark:text-slate-100 dark:hover:border-[#2a4530]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAddressForm(emptyAddressForm());
                        setEditingAddressId(null);
                        setShowAddressForm(true);
                      }}
                      className="w-full rounded-xl border-2 border-dashed border-slate-200 py-8 text-sm font-medium text-zencarta-muted transition-colors hover:border-zencarta-green hover:text-zencarta-green dark:border-[#2a4530]"
                    >
                      + Add new address
                    </button>
                  )}
                </div>
              )}
              </motion.div>
            </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
