"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "./CartDrawer";
import { SearchModal } from "./SearchModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <SearchModal />
      </CartProvider>
    </AuthProvider>
  );
}
