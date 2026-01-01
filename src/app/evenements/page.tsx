"use client";

import React from "react";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  ArrowRight,
  Filter,
  Search,
  Plus,
  Landmark
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const events = [
  {
    id: "1",
    title: "Réunion Mensuelle du Conseil Municipal",
    category: "Gouvernement",
    date: "12 janv. 2026",
    time: "19h00",
    location: "Salle du Conseil, Mairie",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Marché des Producteurs Locaux",
    category: "Communauté",
    date: "15 janv. 2026",
    time: "09h00 - 14h00",
    location: "Place Publique de Sandy Shores",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Réunion Publique : Discussion du Budget 2026",
    category: "Forum Public",
    date: "20 janv. 2026",
    time: "18h30",
    location: "Centre Communautaire de Paleto Bay",
    image: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Défilé du Patrimoine du Comté de Blaine",
    category: "Festival",
    date: "01 févr. 2026",
    time: "10h00",
    location: "Main Street, Grapeseed",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop",
  }
];

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <CalendarIcon className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Calendrier Communautaire</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl uppercase">CE QUI SE <span className="italic opacity-80 text-black">PASSE</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium leading-relaxed">
              Explorez les événements, réunions et rassemblements communautaires à venir dans tout le comté de Blaine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calendar & Filters */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Rechercher des événements..." className="pl-16 h-16 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
              </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button className="rounded-full px-6 h-12 font-black uppercase tracking-widest text-[10px] gap-2" asChild>
                    <Link href="/contact?subject=Evenement">
                      <Plus className="h-4 w-4" /> Soumettre un Événement
                    </Link>
                  </Button>
                  <div className="h-10 w-[1px] bg-border mx-2 hidden lg:block" />
                  {["Ce Mois-ci", "Gouvernement", "Communauté", "Festivals"].map((cat) => (
                    <Button key={cat} variant="outline" className="rounded-full px-6 h-12 font-black uppercase tracking-widest text-[10px] shadow-sm">
                      {cat}
                    </Button>
                  ))}
                </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Events List */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="relative lg:w-96 aspect-video lg:aspect-square overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-primary text-white font-black uppercase tracking-widest px-4 py-2 border-0 shadow-lg">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-6 mb-8 text-xs font-black uppercase tracking-widest text-primary">
                        <div className="flex flex-col items-center bg-primary/5 p-4 rounded-2xl min-w-[80px]">
                          <span className="text-2xl leading-none mb-1">{event.date.split(' ')[0]}</span>
                          <span className="opacity-60">{event.date.split(' ')[1]}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase mb-6 group-hover:text-primary transition-colors leading-none">
                        {event.title}
                      </h2>
                        <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-dashed">
                          <Button className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20" asChild>
                            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Obtenir l'itinéraire</a>
                          </Button>
                          <Button variant="outline" className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-xs" asChild>
                            <Link href="#">Ajouter au Calendrier</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-32">
          <div className="bg-muted/50 rounded-[4rem] p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black tracking-tighter uppercase md:text-6xl mb-6">NE MANQUEZ AUCUNE <br /><span className="text-primary italic">MISE À JOUR</span></h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                Inscrivez-vous à notre newsletter pour recevoir des résumés hebdomadaires des événements communautaires et des annonces municipales.
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <Input placeholder="Votre adresse e-mail" className="h-16 rounded-2xl bg-background border-0 shadow-sm px-6 w-full lg:w-80" />
              <Button className="h-16 rounded-2xl px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20" asChild>
                <Link href="/contact">S'abonner</Link>
              </Button>
            </div>
          </div>
        </section>
    </div>
  );
}
