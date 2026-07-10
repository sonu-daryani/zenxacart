"use client";

import { useShallow } from "zustand/react/shallow";
import {
  selectItemCount,
  selectSubtotal,
  useCartStore,
} from "@/stores/cart-store";

export function useCart() {
  return useCartStore(
    useShallow((s) => ({
      items: s.items,
      itemCount: selectItemCount(s),
      subtotal: selectSubtotal(s),
      isCartOpen: s.isCartOpen,
      isSearchOpen: s.isSearchOpen,
      openCart: s.openCart,
      closeCart: s.closeCart,
      openSearch: s.openSearch,
      closeSearch: s.closeSearch,
      addToCart: s.addToCart,
      removeFromCart: s.removeFromCart,
      updateQuantity: s.updateQuantity,
      clearCart: s.clearCart,
    }))
  );
}
