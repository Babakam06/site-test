"use client";

import React from "react";
import Link from "next/link";
import { 
  Landmark, 
  History, 
  Award, 
  Scale, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function CityHallPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <Building2 className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Présentation Institutionnelle</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">LA <span className="italic opacity-80 text-black">MAIRIE</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium leading-relaxed">
              Le cœur de la gouvernance du comté de Blaine, dédié à la transparence, au service public et à la prospérité de nos citoyens.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-8 md:text-5xl">NOTRE <span className="text-primary italic">HÉRITAGE</span></h2>
            <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
              <p>
                Fondée en 1893, la mairie du comté de Blaine est un symbole de résilience et de croissance. De nos débuts en tant qu'établissement rural à notre statut actuel de région prospère, notre engagement envers nos citoyens n'a jamais faibli.
              </p>
              <p>
                Aujourd'hui, nous continuons à bâtir sur ces fondations, en adoptant les technologies modernes et une gouvernance innovante pour relever les défis du 21e siècle tout en préservant le caractère unique de nos paysages.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="p-6 rounded-3xl bg-muted/50 border flex flex-col gap-3">
                <History className="h-6 w-6 text-primary" />
                <div className="text-2xl font-black">130+</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Plus de 130 ans d'histoire</div>
              </div>
              <div className="p-6 rounded-3xl bg-muted/50 border flex flex-col gap-3">
                <Award className="h-6 w-6 text-primary" />
                <div className="text-2xl font-black">25</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">25 prix d'excellence</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square overflow-hidden rounded-[4rem] shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=2670&auto=format&fit=crop" 
              alt="Mairie Building"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">NOS VALEURS <span className="text-primary italic">FONDAMENTALES</span></h2>
            <p className="text-muted-foreground font-medium">Les principes qui guident chaque décision et action au sein du gouvernement du comté de Blaine.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Scale, title: "Intégrité", desc: "Honnêteté et comportement éthique dans toutes les affaires publiques." },
              { icon: TrendingUp, title: "Innovation", desc: "Adopter de nouvelles idées pour améliorer la prestation des services." },
              { icon: ShieldCheck, title: "Responsabilité", desc: "Assumer la responsabilité de nos actions et de nos résultats." },
              { icon: Target, title: "Excellence", desc: "Viser la plus haute qualité dans tout ce que nous faisons." },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-0 shadow-xl bg-card/80 backdrop-blur-sm rounded-[2.5rem] p-10 text-center hover:bg-primary hover:text-white transition-all duration-500 group">
                  <div className="mb-6 p-4 rounded-2xl bg-primary/5 w-fit mx-auto text-primary group-hover:bg-white/20 group-hover:text-white transition-colors">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">{value.title}</h3>
                  <p className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    {value.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Council Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-primary rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Landmark className="h-5 w-5 text-primary-foreground/70" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground/70">Organe Législatif</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase md:text-6xl mb-8 leading-[0.9]">LE CONSEIL <br /><span className="italic text-black">DU COMTÉ</span></h2>
              <p className="text-xl text-primary-foreground/80 font-medium leading-relaxed mb-10">
                Notre conseil est composé de cinq membres élus représentant les différents districts du comté de Blaine. Ils sont responsables de l'élaboration des politiques, de l'approbation du budget et de la promulgation des ordonnances locales.
              </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full px-10 h-16 bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest text-sm shadow-2xl" asChild>
                    <Link href="/equipe">Annuaire du Conseil</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-10 h-16 border-white/30 text-white hover:bg-white/10 font-black uppercase tracking-widest text-sm" asChild>
                    <Link href="/actualites">Comptes-rendus de Réunions</Link>
                  </Button>
                </div>
            </div>
            <div className="aspect-video bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 p-8 flex flex-col justify-center items-center text-center gap-6">
              <div className="bg-white/10 p-6 rounded-full">
                <TrendingUp className="h-12 w-12 text-primary-foreground" />
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter uppercase mb-2">Audiences Publiques</div>
                <p className="text-primary-foreground/70 font-medium">Votre voix compte. Rejoignez nos audiences publiques bimensuelles pour discuter de la législation à venir.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
