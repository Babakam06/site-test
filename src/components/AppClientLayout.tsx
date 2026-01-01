"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNotAdmin = !pathname?.startsWith('/admin') && !pathname?.startsWith('/login');

  return (
    <>
      {isNotAdmin && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {isNotAdmin && <Footer />}
    </>
  );
}
