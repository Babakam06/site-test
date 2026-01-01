"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Landmark,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  FileText,
  MessageSquare,
  Mail,
  Plug
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Close sidebar on route change on mobile
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (profile) setRole(profile.role);
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Tableau de Bord", href: "/admin", icon: LayoutDashboard },
    { name: "Actualités", href: "/admin/news", icon: Newspaper },
    { name: "Événements", href: "/admin/events", icon: Calendar },
    { name: "Recrutement", href: "/admin/jobs", icon: Briefcase },
    { name: "Services en Ligne", href: "/admin/services", icon: FileText },
    { name: "Messages Contact", href: "/admin/messages", icon: Mail },
  ];

    if (role === "SUPER_ADMIN") {
      menuItems.push({ name: "Gestion Utilisateurs", href: "/admin/user", icon: Users });
      menuItems.push({ name: "Intégrations Discord", href: "/admin/integrations", icon: Plug });
      menuItems.push({ name: "Paramètres du Site", href: "/admin/settings", icon: Settings });
    }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 z-40 w-72 bg-card border-r shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b">
                <div className="flex items-center justify-between lg:block">
                  <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-primary p-2 rounded-xl">
                      <Landmark className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-lg font-black tracking-tighter uppercase leading-none">Blaine County</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Admin Portal</span>
                    </div>
                  </Link>
                  <Button variant="ghost" size="icon" className="lg:hidden rounded-xl" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-4 mb-4">Gestion</p>
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between group p-4 rounded-2xl transition-all font-bold text-sm uppercase tracking-wider",
                      pathname === item.href 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={cn("h-5 w-5 transition-transform", pathname === item.href ? "" : "group-hover:scale-110")} />
                      {item.name}
                    </div>
                    {pathname === item.href && <ChevronRight className="h-4 w-4" />}
                  </Link>
                ))}
              </div>

              <div className="p-4 border-t space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-4" /> Déconnexion
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
