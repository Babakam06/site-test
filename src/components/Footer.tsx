"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Landmark, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { supabase } from "@/lib/supabase";

const footerLinks = [
  {
    title: "Institution",
    links: [
      { name: "Mairie", href: "/mairie" },
      { name: "L'Équipe", href: "/equipe" },
      { name: "Départements", href: "/departements" },
      { name: "Recrutement", href: "/recrutement" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Services en Ligne", href: "/demarches" },
      { name: "État Civil", href: "/demarches/etat-civil" },
      { name: "Urbanisme", href: "/demarches/urbanisme" },
      { name: "Santé Publique", href: "/demarches/sante" },
    ],
  },
  {
    title: "Information",
    links: [
      { name: "Actualités", href: "/actualites" },
      { name: "Événements", href: "/evenements" },
      { name: "Plan de la Ville", href: "/plan" },
      { name: "FAQ", href: "/faq" },
    ],
  },
];

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({
    mayor_phone: "Via App Service",
    mayor_email: "contact@blainecounty.gov",
    mayor_address: "100 Main St, Sandy Shores, BC"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["mayor_phone", "mayor_email", "mayor_address"]);
      
      if (data) {
        const newSettings = { ...settings };
        data.forEach(s => {
          newSettings[s.key] = s.value;
        });
        setSettings(newSettings);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                <Landmark className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter text-primary uppercase">Comté de Blaine</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mairie Officielle</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Au service des citoyens du comté de Blaine avec transparence, dévouement et excellence. Votre porte d'entrée vers les services du gouvernement local.
            </p>
              <div className="flex gap-4">
                <Link href="https://facebook.com" className="p-2 rounded-full bg-background border hover:bg-primary hover:text-white transition-colors shadow-sm">
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link href="https://twitter.com" className="p-2 rounded-full bg-background border hover:bg-primary hover:text-white transition-colors shadow-sm">
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link href="https://instagram.com" className="p-2 rounded-full bg-background border hover:bg-primary hover:text-white transition-colors shadow-sm">
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link href="https://youtube.com" className="p-2 rounded-full bg-background border hover:bg-primary hover:text-white transition-colors shadow-sm">
                  <Youtube className="h-4 w-4" />
                </Link>
              </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-primary">{group.title}</h3>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <span className="h-1 w-0 bg-primary transition-all group-hover:w-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{settings.mayor_address}</span>
              </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${settings.mayor_phone}`} className="hover:text-primary transition-colors">
                    {settings.mayor_phone}
                  </a>
                </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{settings.mayor_email}</span>
              </div>
            </div>
              <div className="flex flex-col items-center gap-4 md:items-end">
                <p className="text-xs text-muted-foreground font-medium">
                  © {new Date().getFullYear()} Gouvernement du Comté de Blaine. Tous droits réservés.
                </p>
                <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">
                  Portail Administration
                </Link>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
