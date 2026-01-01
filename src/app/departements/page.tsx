"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Flame, 
  Truck, 
  Map as MapIcon, 
  Stethoscope,
  Landmark,
  Search,
  Phone,
  Mail,
  ArrowRight,
  Info,
  TrendingUp,
  Users,
  Leaf
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepts = async () => {
      const { data } = await supabase.from("departments").select("*");
      if (data) setDepartments(data);
    };
    fetchDepts();
  }, []);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      ShieldCheck, Stethoscope, Landmark, Flame, Truck, MapIcon, TrendingUp, Users, Leaf
    };
    return icons[iconName] || ShieldCheck;
  };

  const getColor = (name: string) => {
    if (name.includes("Economic")) return "bg-emerald-600";
    if (name.includes("Finance")) return "bg-blue-700";
    if (name.includes("Public Safety")) return "bg-red-700";
    if (name.includes("Community")) return "bg-amber-600";
    if (name.includes("Environment")) return "bg-green-700";
    return "bg-primary";
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <Landmark className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Structure Municipale</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">NOS <span className="italic opacity-80 text-black">DÉPARTEMENTS</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium leading-relaxed">
              Découvrez les équipes spécialisées qui travaillent 24h/24 pour assurer la sécurité, l'efficacité et la prospérité du comté de Blaine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {departments.map((dept, index) => {
            const IconComponent = getIcon(dept.icon);
            return (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all group rounded-[2.5rem]">
                  <CardContent className="p-10 flex flex-col h-full">
                    <div className={`mb-8 p-6 rounded-2xl w-fit shadow-lg ${getColor(dept.name)} text-white group-hover:scale-110 transition-transform`}>
                      {IconComponent && <IconComponent className="h-10 w-10" />}
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter uppercase mb-4">{dept.name}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed mb-8 flex-1 text-lg">
                      {dept.description}
                    </p>
                    
                    <div className="space-y-4 pt-6 border-t border-dashed">
                      <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-[10px] font-black uppercase">Chef</div>
                        {dept.head_name || "Direction"}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary" />
                        {dept.contact_email || "contact@blainecounty.gov"}
                      </div>
                    </div>
                    
                      <Button variant="ghost" className="mt-8 w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 group-hover:bg-primary group-hover:text-white transition-all" asChild>
                        <Link href={`/contact?dept=${dept.name}`}>
                          Contacter le département <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Organizational Chart Info */}
      <section className="container mx-auto px-4 pb-32">
        <div className="bg-primary/5 rounded-[4rem] p-12 lg:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <Info className="h-5 w-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Administration</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase md:text-6xl mb-8">GOUVERNANCE <br /><span className="text-primary italic">TRANSPARENTE</span></h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-10">
                Notre structure organisationnelle est conçue pour garantir une responsabilité maximale et la qualité des services. Chaque département rend compte directement à l'administrateur de la ville et est supervisé par le conseil du comté.
              </p>
                <Button size="lg" className="rounded-full px-10 h-16 font-black uppercase tracking-widest shadow-xl shadow-primary/20" asChild>
                  <Link href="/equipe">Voir l'organigramme</Link>
                </Button>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-background p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border border-primary/10">
                <ShieldCheck className="h-8 w-8 text-blue-500" />
                <div className="text-xs font-black uppercase tracking-widest opacity-60">SÉCURITÉ</div>
                <div className="text-lg font-bold uppercase">PUBLIC SAFETY</div>
              </div>
              <div className="bg-background p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border border-primary/10">
                <TrendingUp className="h-8 w-8 text-emerald-500" />
                <div className="text-xs font-black uppercase tracking-widest opacity-60">ÉCONOMIE</div>
                <div className="text-lg font-bold uppercase">DEVELOPMENT</div>
              </div>
              <div className="bg-background p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border border-primary/10">
                <Leaf className="h-8 w-8 text-green-700" />
                <div className="text-xs font-black uppercase tracking-widest opacity-60">ENVIRONNEMENT</div>
                <div className="text-lg font-bold uppercase">RESOURCES</div>
              </div>
              <div className="bg-background p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border border-primary/10">
                <Landmark className="h-8 w-8 text-primary" />
                <div className="text-xs font-black uppercase tracking-widest opacity-60">MAIRIE</div>
                <div className="text-lg font-bold uppercase">BLAINE COUNTY</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
