"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Landmark, 
  ChevronDown,
  Building2,
  Users2,
  Briefcase,
  FileText,
  Stethoscope,
  Map as MapIcon,
  Newspaper,
  Calendar,
  HelpCircle,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navGroups = [
  {
    title: "Institution",
    icon: Landmark,
    items: [
      { name: "Mairie", href: "/mairie", icon: Building2, description: "Bureau officiel du maire et du conseil municipal" },
      { name: "L'Équipe", href: "/equipe", icon: Users2, description: "Rencontrez notre personnel municipal dévoué" },
      { name: "Départements", href: "/departements", icon: ShieldCheck, description: "Police, pompiers et travaux publics" },
      { name: "Recrutement", href: "/recrutement", icon: Briefcase, description: "Rejoignez la fonction publique du comté de Blaine" },
    ],
  },
  {
    title: "Services",
    icon: FileText,
    items: [
      { name: "Services en Ligne", href: "/demarches", icon: FileText, description: "Demandez des permis et des licences en ligne" },
      { name: "Actes & Démarches", href: "/demarches/etat-civil", icon: FileText, description: "Actes de naissance, mariage et décès" },
      { name: "Urbanisme", href: "/demarches/urbanisme", icon: MapIcon, description: "Utilisation des sols et permis de construire" },
      { name: "Santé Publique", href: "/demarches/sante", icon: Stethoscope, description: "Inspections sanitaires et cliniques communautaires" },
    ],
  },
  {
    title: "Informations",
    icon: Newspaper,
    items: [
      { name: "Actualités", href: "/actualites", icon: Newspaper, description: "Dernières mises à jour du comté de Blaine" },
      { name: "Événements", href: "/evenements", icon: Calendar, description: "Calendrier communautaire et festivals locaux" },
      { name: "Plan de la Ville", href: "/plan", icon: MapIcon, description: "Carte interactive de la ville en haute résolution" },
      { name: "FAQ", href: "/faq", icon: HelpCircle, description: "Réponses aux questions courantes des citoyens" },
    ],
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl transition-transform group-hover:scale-110">
              <Landmark className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-primary uppercase">Comté de Blaine</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mairie Officielle</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navGroups.map((group) => (
                  <NavigationMenuItem key={group.title}>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-primary/5 text-sm font-semibold uppercase tracking-wider">
                      {group.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  pathname === item.href && "bg-accent"
                                )}
                              >
                                <div className="flex items-center gap-2 text-sm font-bold leading-none">
                                  <item.icon className="h-4 w-4 text-primary" />
                                  {item.name}
                                </div>
                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-4 flex items-center gap-2 border-l pl-6">
              <ThemeToggle />
              <Button size="sm" className="rounded-full px-6 font-bold uppercase tracking-wider shadow-lg shadow-primary/20" asChild>
                <Link href="/login">Portail Administration</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-20 z-40 bg-background lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-8 space-y-8">
              {navGroups.map((group) => (
                <div key={group.title} className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground border-b pb-2 flex items-center gap-2">
                    <group.icon className="h-4 w-4" />
                    {group.title}
                  </h3>
                  <div className="grid gap-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-colors",
                          pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-bold">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-4 pb-20">
                <Button className="w-full rounded-xl h-12 font-bold uppercase tracking-widest" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/login">Portail Administration</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
