"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Newspaper, 
  Calendar, 
  Briefcase, 
  ShieldCheck,
  Eye,
  FileText,
  ChevronRight,
  Heart,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    events: 0,
    applications: 0,
    news: 0,
    vitalRecords: 0,
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    
    const [usersRes, jobsRes, eventsRes, appsRes, newsRes, vitalRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "OPEN"),
      supabase.from("events").select("id", { count: "exact", head: true }).gte("date", new Date().toISOString()),
      supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
      supabase.from("news").select("id", { count: "exact", head: true }),
      supabase.from("vital_records_requests").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
    ]);

    setStats({
      users: usersRes.count || 0,
      jobs: jobsRes.count || 0,
      events: eventsRes.count || 0,
      applications: appsRes.count || 0,
      news: newsRes.count || 0,
      vitalRecords: vitalRes.count || 0,
    });

    const { data: apps } = await supabase
      .from("applications")
      .select("*, job:jobs(title)")
      .order("created_at", { ascending: false })
      .limit(5);
    
    setRecentApplications(apps || []);
    setLoading(false);
  };

  const statCards = [
    { name: "Citoyens", value: stats.users.toString(), icon: Users, href: "/admin/user" },
    { name: "Jobs Actifs", value: stats.jobs.toString(), icon: Briefcase, href: "/admin/jobs" },
    { name: "État Civil", value: stats.vitalRecords.toString(), icon: Heart, href: "#" }, // Lien désactivé ou vers une page vide
    { name: "Events", value: stats.events.toString(), icon: Calendar, href: "/admin/events" },
    { name: "Candidatures", value: stats.applications.toString(), icon: FileText, href: "/admin/jobs" },
  ];

  return (
    <div className="space-y-12 pb-12">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">TABLEAU <span className="text-primary italic">DE BORD</span></h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Vue d'ensemble des opérations de la mairie</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={stat.href}>
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer">
                <CardContent className="p-6">
                  <div className="bg-primary/5 p-2 w-fit rounded-xl group-hover:bg-white/20 transition-colors mb-4">
                    <stat.icon className="h-5 w-5 text-primary group-hover:text-white" />
                  </div>
                  <div className="text-2xl font-black tracking-tighter mb-1">
                    {loading ? "..." : stat.value}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-60">{stat.name}</div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="border-0 shadow-2xl bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-full overflow-hidden">
            <CardHeader className="p-10 border-b border-dashed">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl font-black tracking-tighter uppercase">Candidatures Récentes</CardTitle>
                </div>
                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest hover:text-primary" asChild>
                  <Link href="/admin/jobs">Voir Tout</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-dashed">
                {recentApplications.map((app) => (
                  <div key={app.id} className="p-8 flex items-center justify-between hover:bg-primary/5 transition-colors">
                    <div className="flex gap-6 items-center">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs">
                        {app.nom_rp?.charAt(0)}{app.prenom_rp?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black uppercase tracking-wider">{app.nom_rp} {app.prenom_rp}</div>
                        <div className="text-[10px] text-primary font-bold uppercase tracking-widest">{app.job?.title || app.poste}</div>
                      </div>
                    </div>
                    <Badge className="bg-orange-500/10 text-orange-500 border-0 uppercase text-[9px] font-black">
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="border-0 shadow-2xl bg-primary text-white rounded-[2.5rem] h-full overflow-hidden relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
            <CardHeader className="p-10 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-5 w-5 opacity-70" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Accès Rapide</span>
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter uppercase">ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 relative z-10 space-y-3">
              <Button className="w-full h-14 rounded-2xl bg-white/10 hover:bg-white/20 font-black uppercase tracking-widest text-[10px] border border-white/20 justify-start gap-4" asChild>
                <Link href="/admin/news">
                  <Newspaper className="h-5 w-5" /> Publier une Actualité
                </Link>
              </Button>
              <Button className="w-full h-14 rounded-2xl bg-white/10 hover:bg-white/20 font-black uppercase tracking-widest text-[10px] border border-white/20 justify-start gap-4" asChild>
                <Link href="/admin/events">
                  <Calendar className="h-5 w-5" /> Créer un Événement
                </Link>
              </Button>
              <Button className="w-full h-14 rounded-2xl bg-white/10 hover:bg-white/20 font-black uppercase tracking-widest text-[10px] border border-white/20 justify-start gap-4" asChild>
                <Link href="/admin/jobs">
                  <Briefcase className="h-5 w-5" /> Nouvelle Offre d'Emploi
                </Link>
              </Button>

              <div className="pt-6 border-t border-white/20 mt-6">
                <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest text-xs shadow-2xl" asChild>
                  <Link href="/" target="_blank">
                    <Eye className="h-5 w-5 mr-2" /> Voir le Site Public
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}