"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", session.user.id)
        .single();

      if (!profile || !profile.is_active || !["SUPER_ADMIN", "ADMIN", "STAFF"].includes(profile.role)) {
        const adminEmails = ['abdel.bousseed@mairie.bc', 'abdel.boussed@mairie.bc'];
        if (!profile && adminEmails.includes(session.user.email || '')) {
          setTimeout(checkAuth, 1000);
          return;
        }
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Verifying Staff Credentials</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-x-hidden">
      {!sidebarOpen && <AdminHeader isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300",
        "lg:ml-72"
      )}>
        <div className={cn(
          "p-6 md:p-8 lg:p-12",
          "pt-24 lg:pt-12"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}

import { cn } from "@/lib/utils";
