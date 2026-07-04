"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

const SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 5.99;

export function OrderSummary({ showCheckoutButton = false }: { showCheckoutButton?: boolean }) {
  const { items, subtotal, updateQuantity } = useCart();
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <p className="font-medium text-zencarta-navy">Your cart is empty</p>
        <Link
          href="/#products"
          className="mt-4 inline-block text-sm font-semibold text-zencarta-green hover:underline"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zencarta-navy">Order Summary</h2>
      <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zencarta-surface">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zencarta-navy">
                {item.name}
              </p>
              <p className="text-sm text-zencarta-green">
                ${item.price.toFixed(2)}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="rounded border border-slate-200 p-0.5 hover:border-zencarta-green"
                  aria-label="Decrease"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-xs font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="rounded border border-slate-200 p-0.5 hover:border-zencarta-green"
                  aria-label="Increase"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="text-sm font-semibold text-zencarta-navy">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-zencarta-muted">Subtotal</dt>
          <dd className="font-medium text-zencarta-navy">${subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zencarta-muted">Shipping</dt>
          <dd className="font-medium text-zencarta-navy">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </dd>
        </div>
        {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
          <p className="text-xs text-zencarta-green">
            Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
          </p>
        )}
        <div className="flex justify-between">
          <dt className="text-zencarta-muted">Estimated tax</dt>
          <dd className="font-medium text-zencarta-navy">${tax.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-2 text-base">
          <dt className="font-bold text-zencarta-navy">Total</dt>
          <dd className="font-bold text-zencarta-green">${total.toFixed(2)}</dd>
        </div>
      </dl>

      {showCheckoutButton && (
        <Link
          href="/checkout"
          className="mt-6 block w-full rounded-lg bg-zencarta-green py-3 text-center text-sm font-semibold text-white uppercase transition-colors hover:bg-zencarta-green-dark"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}

export function useOrderTotals() {
  const { subtotal } = useCart();
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const tax = subtotal * 0.08;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}
