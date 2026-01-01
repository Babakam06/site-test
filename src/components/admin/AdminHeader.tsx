"use client";

import React from "react";
import { Menu, X, Landmark, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AdminHeader({ isOpen, setIsOpen }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-dashed lg:hidden">
      <div className="h-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Landmark className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-black uppercase tracking-tighter">Admin <span className="text-primary italic">Portal</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
