import { Footer } from "./Footer";
import { Header } from "./Header";
import { TrustStrip } from "./TrustStrip";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <TrustStrip />
      <Footer />
    </>
  );
}
