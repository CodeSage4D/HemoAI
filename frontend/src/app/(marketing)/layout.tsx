import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AiBot } from "@/components/AiBot";
import { LenisProvider } from "@/components/LenisProvider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 shrink-0 pt-16">
          {children}
        </main>
        <Footer />
        <AiBot />
      </div>
    </LenisProvider>
  );
}
