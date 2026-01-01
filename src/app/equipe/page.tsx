"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users2, 
  Landmark, 
  Search, 
  Mail, 
  MessageSquare,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true });
      if (data) setTeamMembers(data);
    };
    fetchTeam();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <Users2 className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Direction & Personnel</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">RENCONTREZ <span className="italic opacity-80 text-black">L'ÉQUIPE</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium max-w-2xl mx-auto leading-relaxed">
              Nos professionnels dévoués s'engagent à servir les résidents du comté de Blaine avec intégrité et excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden rounded-[3rem] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={member.image_url} 
                      alt={member.name}
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex gap-2">
                          <Button size="lg" variant="secondary" className="rounded-2xl h-14 flex-1 font-black uppercase tracking-widest text-[10px] gap-3" asChild>
                            <a href={`https://discord.com/users/${member.discord_id}`} target="_blank" rel="noopener noreferrer">
                              <MessageSquare className="h-4 w-4" /> Discord
                            </a>
                          </Button>
                        </div>
                      </div>
                  </div>
                  <div className="p-10">
                    <Badge className="bg-primary/10 text-primary border-0 font-black uppercase tracking-widest px-3 mb-4">
                      {member.department}
                    </Badge>
                    <h3 className="text-3xl font-black tracking-tighter uppercase mb-2 group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed italic border-l-2 border-primary/20 pl-4">
                      "{member.bio}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recruitment CTA */}
      <section className="container mx-auto px-4 pb-32">
        <div className="bg-muted/50 rounded-[4rem] p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-2xl shadow-primary/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-4xl font-black tracking-tighter uppercase md:text-6xl mb-8 leading-[0.9]">VOUS VOULEZ REJOINDRE <br /><span className="text-primary italic">L'ÉQUIPE ?</span></h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              Nous sommes toujours à la recherche de personnes passionnées pour nous aider à construire un meilleur comté de Blaine. Explorez nos postes ouverts et commencez votre carrière dans la fonction publique.
            </p>
          </div>
            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <Button size="lg" className="rounded-full px-12 h-16 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group" asChild>
                <Link href="/recrutement">
                  Voir les Postes <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
