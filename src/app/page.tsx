"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Landmark, 
  TrendingUp, 
  Users, 
  Leaf, 
  Calendar, 
  FileText, 
  Info,
  ChevronRight,
  Building2,
  Map as MapIcon,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [quickLinks, setQuickLinks] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    mayor_name: "Johnathan Blaine",
    mayor_photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
    mayor_vision_title: "Construire l'Avenir Ensemble",
    mayor_vision_text: "Le comté de Blaine est à un moment charnière de son histoire. Notre mission est de préserver notre patrimoine tout en favorisant le progrès.",
    hero_title: "COMTÉ DE BLAINE",
    hero_subtitle: "Dédié à servir notre communauté avec intégrité, innovation et transparence. Votre porte d'entrée vers les services municipaux et le gouvernement local.",
    hero_image_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2574&auto=format&fit=crop",
    hero_button_text: "Explorer les Services",
    hero_button_link: "/demarches",
    hero_secondary_button_text: "Nous Contacter",
    hero_secondary_button_link: "/contact",
    emergency_title: "COMMENT POUVONS-NOUS VOUS AIDER ?",
    emergency_subtitle: "Notre personnel dévoué est disponible du lundi au vendredi pour répondre à vos demandes et besoins de services.",
    emergency_button_text: "Contacter la Mairie",
    emergency_button_link: "/contact",
    show_mayor_section: "true",
    show_news_section: "true",
    show_emergency_section: "true"
  });

  const getIcon = (name: string) => {
    const icons: Record<string, any> = {
      FileText, Building2, Users, PhoneCall, ShieldCheck, Landmark, TrendingUp, Leaf, MapIcon
    };
    return icons[name] || FileText;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: newsData } = await supabase
          .from("news")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
        if (newsData) setNews(newsData);

        const { data: qlData } = await supabase
          .from("quick_links")
          .select("*")
          .order("order_index", { ascending: true });
        if (qlData) setQuickLinks(qlData || []);

        const { data: settingsData } = await supabase
          .from("settings")
          .select("key, value");
        
        if (settingsData && settingsData.length > 0) {
          const newSettings = { ...siteSettings };
          settingsData.forEach(s => {
            newSettings[s.key] = s.value;
          });
          setSiteSettings(newSettings);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchData();
  }, []);

  const heroTitle = siteSettings?.hero_title || "COMTÉ DE BLAINE";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ 
            backgroundImage: `url('${siteSettings.hero_image_url}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>
        
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-12 bg-primary" />
                <span className="text-sm font-black uppercase tracking-[0.4em] text-primary">Portail Officiel</span>
              </div>
              <h1 className="mb-6 text-6xl font-black tracking-tighter md:text-8xl lg:text-9xl text-foreground uppercase">
                {heroTitle.includes(' ') ? (
                  <>
                    {heroTitle.split(' ').slice(0, -1).join(' ')} <br />
                    <span className="text-primary italic">{heroTitle.split(' ').slice(-1)}</span>
                  </>
                ) : (
                  <span className="text-primary italic">{heroTitle}</span>
                )}
              </h1>
              <p className="mb-10 text-xl text-muted-foreground leading-relaxed max-w-xl font-medium">
                {siteSettings.hero_subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg font-bold uppercase tracking-widest shadow-2xl shadow-primary/40 group" asChild>
                  <Link href={siteSettings.hero_button_link}>{siteSettings.hero_button_text} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg font-bold uppercase tracking-widest backdrop-blur-sm hover:bg-primary/5" asChild>
                  <Link href={siteSettings.hero_secondary_button_link}>{siteSettings.hero_secondary_button_text}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Défiler</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Quick Access Grid */}
      <section className="relative -mt-24 z-10 pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(quickLinks || []).map((link, index) => {
              const Icon = getIcon(link.icon_name);
              return (
                <motion.div
                  key={link.id || link.title || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-2xl bg-card/80 backdrop-blur-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Icon className="h-24 w-24" />
                    </div>
                    <CardContent className="flex flex-col p-10">
                      <div className="mb-8 rounded-2xl bg-primary p-4 text-primary-foreground w-fit shadow-lg shadow-primary/20">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-4 text-2xl font-black tracking-tight uppercase">{link.title}</h3>
                      <p className="mb-8 text-muted-foreground text-sm leading-relaxed font-medium">
                        {link.description}
                      </p>
                      <Link 
                        href={link.href} 
                        className="mt-auto flex items-center text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
                      >
                        En Savoir Plus <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mayor's Message Section */}
      {siteSettings.show_mayor_section === "true" && (
        <section className="bg-muted/50 py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-[3rem] shadow-2xl"
              >
                <img 
                  src={siteSettings.mayor_photo_url} 
                  alt="Maire du Comté de Blaine"
                  className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-12 text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-[1px] w-8 bg-primary" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Direction</span>
                  </div>
                  <p className="text-4xl font-black tracking-tighter uppercase">{siteSettings.mayor_name}</p>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-70">Maire du Comté de Blaine</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <Landmark className="h-5 w-5 text-primary" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Bureau du Maire</span>
                </div>
                <h2 className="mb-10 text-5xl font-black tracking-tighter uppercase leading-[0.9] text-foreground md:text-7xl">
                  {siteSettings.mayor_vision_title.split(' ').slice(0, -1).join(' ')} <br />
                  <span className="text-primary italic underline underline-offset-8 decoration-4 decoration-primary/30">{siteSettings.mayor_vision_title.split(' ').slice(-1)}</span>
                </h2>
                <div className="space-y-8 text-xl text-muted-foreground leading-relaxed font-medium">
                  <p className="relative">
                    <span className="absolute -left-8 -top-4 text-6xl text-primary/20 font-serif leading-none">"</span>
                    {siteSettings.mayor_vision_text}
                  </p>
                </div>
                <div className="mt-16 pt-8 border-t">
                  <Button variant="link" className="p-0 text-primary font-black uppercase tracking-widest text-sm hover:no-underline flex items-center group" asChild>
                    <Link href="/mairie">Lire la déclaration de vision complète <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" /></Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Updates Section */}
      {siteSettings.show_news_section === "true" && (
        <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 w-10 bg-primary" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Salle de Presse</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter uppercase md:text-7xl">DERNIÈRES <span className="text-primary italic">MISES À JOUR</span></h2>
              <p className="text-xl text-muted-foreground mt-6 font-medium leading-relaxed">
                Restez informé des projets du comté, des décisions municipales et des actualités de la communauté.
              </p>
            </div>
            <Button variant="outline" className="rounded-full px-10 h-14 font-black uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5" asChild>
              <Link href="/actualites">Voir toutes les actualités</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {(news && news.length > 0 ? news : [
              {
                category: "Infrastructure",
                title: "Le projet de rénovation de Main Street commence la semaine prochaine",
                date: "2025-12-28",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop",
              },
              {
                category: "Communauté",
                title: "Annonce des dates du festival d'été annuel de Sandy Shores",
                date: "2025-12-25",
                image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2670&auto=format&fit=crop",
              },
              {
                category: "Environnement",
                title: "Nouvelle initiative de gestion durable de l'eau pour Paleto Bay",
                date: "2025-12-22",
                image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
              },
            ]).map((item: any, index: number) => {
              const itemDate = item.created_at || item.date;
              const formattedDate = itemDate ? new Date(itemDate).toLocaleDateString('fr-FR') : "Date inconnue";
              
              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/actualites`}>
                    <Card className="border-0 bg-transparent shadow-none">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-2xl mb-8">
                        <img 
                          src={item.image_url || item.image} 
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6">
                          <Badge className="bg-white/95 text-black font-black uppercase tracking-widest px-4 py-2 border-0 shadow-lg">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="px-2 py-0">
                        <p className="mb-4 text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          <span className="h-1 w-4 bg-primary" />
                          {formattedDate}
                        </p>
                        <h3 className="mb-6 text-2xl font-black tracking-tight uppercase group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                          Lire l'article <ArrowRight className="h-4 w-4 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Emergency CTA */}
      {siteSettings.show_emergency_section === "true" && (
        <section className="container mx-auto px-4 pb-32">
          <div className="relative overflow-hidden rounded-[4rem] bg-primary px-10 py-24 text-center text-primary-foreground shadow-[0_40px_100px_-20px_rgba(var(--primary),0.5)]">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 mx-auto max-w-4xl">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-10 border border-white/20">
                <PhoneCall className="h-4 w-4 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Besoin d'aide ?</span>
              </div>
              <h2 className="mb-8 text-5xl font-black tracking-tighter uppercase md:text-7xl lg:text-8xl">
                {siteSettings.emergency_title.split(' ').slice(0, -2).join(' ')} <span className="text-black italic">{siteSettings.emergency_title.split(' ').slice(-2).join(' ')}</span>
              </h2>
              <p className="mb-14 text-2xl text-primary-foreground/80 leading-relaxed font-medium">
                {siteSettings.emergency_subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 px-12 h-16 text-lg font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95" asChild>
                  <Link href={siteSettings.emergency_button_link}>{siteSettings.emergency_button_text}</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 px-12 h-16 text-lg font-black uppercase tracking-widest transition-all" asChild>
                  <Link href="/contact?subject=Rendez-vous">Prendre Rendez-vous</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
