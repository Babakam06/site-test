"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Landmark,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  HelpCircle,
  FileSearch,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error) setServices(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const submissionData: any = {};
    
    selectedService.fields.forEach((field: any) => {
      submissionData[field.label] = formData.get(field.id);
    });

    const { error } = await supabase.from("submissions").insert([{
      service_id: selectedService.id,
      data: submissionData,
    }]);

    if (!error) {
      // Notification Discord
      try {
        const { data: settings } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "discord_webhook_demarches")
          .single();

        if (settings?.value) {
          await fetch("/api/webhook/discord", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "demarche",
              data: {
                type_demarche: selectedService.title,
                prenom: submissionData["Prénom"] || submissionData["Prenom"] || "Citoyen",
                nom: submissionData["Nom"] || "",
                email: submissionData["Email"] || "Non spécifié",
                telephone: submissionData["Téléphone"] || submissionData["Telephone"] || "Non spécifié",
                adresse: submissionData["Adresse"] || "Non spécifiée",
                details: JSON.stringify(submissionData, null, 2),
              },
              webhookUrl: settings.value,
            }),
          });
        }
      } catch (err) {
        console.error("Discord error:", err);
      }

      toast.success("Dossier Envoyé !", {
        description: "Votre demande a été enregistrée et sera traitée par nos services.",
      });
      setIsModalOpen(false);
    } else {
      toast.error("Erreur lors de l'envoi", {
        description: "Veuillez vérifier vos informations.",
      });
    }
    setIsSubmitting(false);
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted/50 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-10 bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Administration Numérique</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase mb-8 md:text-8xl">SERVICES <br /><span className="text-primary italic">EN LIGNE</span></h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              Accédez aux services municipaux du comté de Blaine 24h/24. Déposez vos dossiers, demandez des permis et suivez vos démarches RP en toute simplicité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-end justify-between mb-16">
          <div className="flex-1 w-full max-w-xl">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Rechercher une démarche (ex: permis, commerce...)" 
                className="pl-14 h-16 rounded-[1.5rem] bg-card/50 border-0 shadow-xl focus-visible:ring-primary font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Badge className="h-10 px-4 rounded-full bg-primary/10 text-primary border-0 font-black uppercase tracking-widest text-[10px]">
              {filteredServices.length} Démarches Disponibles
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-muted/20 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-32 text-center bg-muted/20 rounded-[3rem] border border-dashed">
            <FileSearch className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">Aucun service trouvé</h3>
            <p className="text-muted-foreground font-medium mt-2">Essayez d'autres mots-clés ou revenez plus tard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-2xl bg-card/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden group hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-10 flex flex-col h-full">
                    <div className="mb-8 p-4 bg-primary rounded-2xl w-fit text-white shadow-lg shadow-primary/20">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 group-hover:text-primary transition-colors leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-10 flex-1">
                      {service.description}
                    </p>
                    <Dialog open={isModalOpen && selectedService?.id === service.id} onOpenChange={(open) => {
                      setIsModalOpen(open);
                      if (open) setSelectedService(service);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full h-14 rounded-2xl font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/10"
                          onClick={() => setSelectedService(service)}
                        >
                          Démarrer Démarche <ChevronRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl rounded-[3rem] p-0 overflow-hidden border-0 bg-background shadow-2xl">
                        <div className="bg-primary p-10 text-white relative">
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
                          <DialogHeader className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 opacity-70">
                              <Landmark className="h-4 w-4" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Mairie du Comté de Blaine</span>
                            </div>
                            <DialogTitle className="text-4xl font-black tracking-tighter uppercase leading-none">{service.title}</DialogTitle>
                            <DialogDescription className="text-primary-foreground/70 text-lg font-medium mt-4">
                              Remplissez les informations requises pour traiter votre dossier.
                            </DialogDescription>
                          </DialogHeader>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10 max-h-[60vh] overflow-y-auto space-y-8 custom-scrollbar">
                          {service.fields && service.fields.map((field: any) => (
                            <div key={field.id} className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                                {field.label} {field.required && <span className="text-primary">*</span>}
                              </label>
                              {field.type === "textarea" ? (
                                <Textarea 
                                  name={field.id} 
                                  required={field.required}
                                  placeholder={`Saisissez ${field.label.toLowerCase()}...`}
                                  className="min-h-[120px] rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-medium p-6" 
                                />
                              ) : (
                                <Input 
                                  name={field.id} 
                                  type={field.type}
                                  required={field.required}
                                  placeholder={`Saisissez ${field.label.toLowerCase()}...`}
                                  className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" 
                                />
                              )}
                            </div>
                          ))}
                          
                          <div className="bg-primary/5 p-6 rounded-2xl border border-dashed border-primary/20 flex gap-4">
                            <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                              En soumettant ce formulaire, vous attestez de l'exactitude des informations fournies pour votre RP. Tout dossier incomplet pourra être rejeté sans préavis.
                            </p>
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-lg shadow-2xl shadow-primary/20 group"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <span className="flex items-center gap-3">Soumettre le Dossier <Send className="h-6 w-6 group-hover:translate-x-1 transition-transform" /></span>
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Info Banner */}
      <section className="container mx-auto px-4 pb-24">
        <div className="bg-primary px-12 py-20 rounded-[3rem] text-primary-foreground relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-6 md:text-5xl">BESOIN <span className="text-black italic">D'ASSISTANCE ?</span></h2>
            <p className="text-xl text-primary-foreground/80 font-medium leading-relaxed">
              Si vous ne trouvez pas la démarche correspondante à votre besoin, n'hésitez pas à contacter directement nos services via le formulaire de contact général.
            </p>
          </div>
            <Button size="lg" variant="outline" className="relative z-10 rounded-full border-white/30 text-white hover:bg-white/10 px-12 h-16 text-lg font-black uppercase tracking-widest whitespace-nowrap" asChild>
              <Link href="/faq">Aide & FAQ</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
