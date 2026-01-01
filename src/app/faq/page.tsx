"use client";

import React from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail,
  ChevronRight,
  Landmark,
  FileText,
  ShieldCheck,
  Stethoscope,
  Building2
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const faqCategories = [
  {
    title: "Demandes Générales",
    icon: Landmark,
    questions: [
      {
        q: "Où se trouve la mairie ?",
        a: "La mairie du comté de Blaine est située au 100 Main Street, Sandy Shores, BC 92301. Nous sommes ouverts du lundi au vendredi, de 8h00 à 17h00."
      },
      {
        q: "Comment puis-je contacter le bureau du maire ?",
        a: "Vous pouvez contacter le bureau du maire par e-mail à mayor@blainecounty.gov ou en appelant le (555) 0123-4567 pendant les heures de bureau."
      },
      {
        q: "Les réunions du conseil municipal sont-elles ouvertes au public ?",
        a: "Oui, toutes les réunions du conseil municipal sont ouvertes au public. Elles ont lieu chaque deuxième et quatrième mardi du mois à 19h00 dans la salle du conseil."
      }
    ]
  },
  {
    title: "Sécurité Publique",
    icon: ShieldCheck,
    questions: [
      {
        q: "Comment signaler un crime non urgent ?",
        a: "Pour les incidents non urgents, veuillez appeler la ligne non urgente du bureau du shérif au (555) 0123-4444 ou utiliser notre portail de signalement en ligne."
      },
      {
        q: "Où puis-je trouver des informations sur les alertes d'urgence ?",
        a: "Inscrivez-vous à BC-Alert sur notre page d'accueil pour recevoir des notifications en temps réel sur la météo, le trafic et les urgences de sécurité publique par SMS ou e-mail."
      }
    ]
  },
  {
    title: "Permis et Licences",
    icon: FileText,
    questions: [
      {
        q: "Comment demander une licence commerciale ?",
        a: "Les demandes de licence commerciale peuvent être soumises via notre portail de services en ligne ou en personne au département des revenus situé à la mairie."
      },
      {
        q: "Quels permis sont requis pour la rénovation d'une maison ?",
        a: "La plupart des modifications structurelles, électriques et de plomberie nécessitent un permis. Veuillez consulter la page Urbanisme et Zonage pour une liste complète des exigences."
      }
    ]
  },
  {
    title: "Santé Publique",
    icon: Stethoscope,
    questions: [
      {
        q: "Où se trouve la clinique de santé communautaire la plus proche ?",
        a: "La clinique communautaire du comté de Blaine est située au 450 Paleto Blvd, Paleto Bay. Elle propose divers services, notamment des vaccinations et des bilans de santé généraux."
      },
      {
        q: "Comment signaler un problème de santé publique ?",
        a: "Veuillez utiliser le formulaire 'Signaler un problème' sur notre page des services de santé publique ou appeler directement le département de la santé au (555) 0123-5555."
      }
    ]
  }
];

export default function FAQPage() {
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
              <HelpCircle className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Support aux Citoyens</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">FOIRE AUX <span className="italic opacity-80 text-black">QUESTIONS</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium max-w-2xl mx-auto leading-relaxed">
              Trouvez des réponses rapides aux questions courantes sur les services municipaux, la sécurité publique et les opérations du gouvernement local.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
          <CardContent className="p-8 md:p-12">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input 
                placeholder="Rechercher des réponses (ex: 'permis', 'shérif', 'maire')..." 
                className="pl-16 h-20 rounded-[1.5rem] bg-muted/50 border-0 focus-visible:ring-primary text-lg font-bold" 
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Content */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
              <div className="h-1 w-8 bg-primary" />
              Catégories
            </h3>
            {faqCategories.map((category) => (
              <Button 
                key={category.title}
                variant="ghost" 
                className="w-full justify-between h-16 rounded-2xl px-6 hover:bg-primary/5 group transition-all"
              >
                <div className="flex items-center gap-4">
                  <category.icon className="h-5 w-5 text-primary" />
                  <span className="font-bold uppercase tracking-wider text-sm">{category.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            ))}

            <Card className="mt-12 border-0 bg-primary text-white overflow-hidden rounded-[2.5rem] shadow-2xl shadow-primary/20">
              <CardContent className="p-10 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-6 opacity-50" />
                <h4 className="text-2xl font-black uppercase tracking-tight mb-4">Besoin d'aide supplémentaire ?</h4>
                <p className="text-primary-foreground/70 text-sm font-medium mb-8">
                  Notre équipe de support aux citoyens est disponible pour vous aider pour des demandes plus spécifiques.
                </p>
                  <div className="space-y-4">
                    <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest text-xs gap-2" asChild>
                      <Link href="/contact">
                        <Mail className="h-4 w-4" /> Contacter le Support
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-white/30 text-white hover:bg-white/10 font-black uppercase tracking-widest text-xs gap-2" asChild>
                      <a href="tel:55501234567">
                        <Phone className="h-4 w-4" /> (555) 0123-4567
                      </a>
                    </Button>
                  </div>
              </CardContent>
            </Card>
          </div>

          {/* Accordions */}
          <div className="lg:col-span-8">
            <div className="space-y-16">
              {faqCategories.map((category) => (
                <div key={category.title}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary/10 p-4 rounded-2xl">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{category.title}</h2>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {category.questions.map((item, i) => (
                      <AccordionItem 
                        key={i} 
                        value={`${category.title}-${i}`}
                        className="border-0 bg-card/50 backdrop-blur-sm rounded-3xl px-8 py-2 shadow-sm hover:shadow-md transition-all"
                      >
                        <AccordionTrigger className="hover:no-underline py-6">
                          <span className="text-lg font-black tracking-tight text-left uppercase group-hover:text-primary transition-colors">
                            {item.q}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-8">
                          <p className="text-muted-foreground text-lg leading-relaxed font-medium border-l-4 border-primary pl-6 py-2">
                            {item.a}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
