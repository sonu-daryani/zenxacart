"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const {
    items,
    subtotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden
      />
      <aside
        className="animate-slide-in-right fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zencarta-navy">
            <ShoppingBag className="h-5 w-5 text-zencarta-green" />
            Your Cart ({items.length})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 hover:bg-zencarta-surface"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-slate-200" />
              <p className="mt-4 font-medium text-zencarta-navy">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-zencarta-muted">
                Add items to get started
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-6 rounded-lg bg-zencarta-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-zencarta-green-dark"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-slate-100 p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zencarta-surface">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="line-clamp-2 text-sm font-semibold text-zencarta-navy">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-zencarta-green">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1.5 hover:text-zencarta-green"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 hover:text-zencarta-green"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-zencarta-muted hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-zencarta-muted">Subtotal</span>
              <span className="text-lg font-bold text-zencarta-navy">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="mb-4 text-xs text-zencarta-muted">
              Shipping and taxes calculated at checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full rounded-lg bg-zencarta-green py-3.5 text-center text-sm font-semibold text-white uppercase transition-colors hover:bg-zencarta-green-dark"
            >
              Checkout
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full py-2 text-xs text-zencarta-muted hover:text-red-500"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
