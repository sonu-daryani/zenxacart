"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/stores/auth-store";

const CartDrawer = dynamic(
  () => import("./CartDrawer").then((m) => ({ default: m.CartDrawer })),
  { ssr: false }
);

const SearchModal = dynamic(
  () => import("./SearchModal").then((m) => ({ default: m.SearchModal })),
  { ssr: false }
);

function AuthBootstrap() {
  useEffect(() => {
    void useAuthStore.getState().bootstrap();
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthBootstrap />
      {children}
      <CartDrawer />
      <SearchModal />
    </>
  );
}
