"use client";

import React, { useEffect, useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  Search,
  Landmark,
  ShieldCheck,
  User,
  Hash,
  MessageSquare
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
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "OPEN")
      .order("created_at", { ascending: false });

    if (!error) setJobs(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const application = {
      job_id: selectedJob?.id,
      poste: selectedJob?.title,
      nom_rp: formData.get("nom_rp"),
      prenom_rp: formData.get("prenom_rp"),
      age_rp: parseInt(formData.get("age_rp") as string),
      motivation: formData.get("motivation"),
      experience: formData.get("experience"),
      discord_id: formData.get("discord_id"),
      disponibilites: formData.get("disponibilites"),
      source: formData.get("source"),
    };

    const { error } = await supabase.from("applications").insert([application]);

    if (!error) {
        // Send to Discord webhook
        try {
          const { data: settings } = await supabase
            .from("settings")
            .select("value")
            .eq("key", "discord_webhook_recrutement")
            .single();

        if (settings?.value) {
          await fetch("/api/webhook/discord", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "candidature",
              data: application,
              webhookUrl: settings.value,
            }),
          });
        }
      } catch (e) {
        console.error("Discord webhook error:", e);
      }

      toast.success("Candidature RP Envoyée !", {
        description: "Votre dossier a été transmis au bureau du personnel.",
      });
      setIsModalOpen(false);
    } else {
      toast.error("Échec de l'envoi", {
        description: "Veuillez vérifier tous les champs obligatoires.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <Landmark className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Administration du Comté</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">RECRUTEMENT <br /><span className="italic opacity-80 text-black">DE LA MAIRIE</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium max-w-2xl mx-auto leading-relaxed">
              Le comté de Blaine recrute ! Rejoignez l'administration locale et participez activement au développement de notre communauté à Sandy Shores, Paleto Bay et Grapeseed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-24 container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">POSTES <span className="text-primary italic text-6xl block md:inline">DISPONIBLES</span></h2>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">Opportunités actuelles au sein de la mairie</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <Card className="border-0 shadow-2xl bg-muted/30 rounded-[3rem] p-20 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">Aucune offre active</h3>
            <p className="text-muted-foreground font-medium mt-2">Revenez plus tard pour de nouvelles opportunités.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-0 shadow-2xl hover:shadow-primary/10 transition-all duration-500 rounded-[2.5rem] bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-10 md:p-14">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-1 w-12 bg-primary" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Poste Ouvert</span>
                        </div>
                        <h3 className="text-4xl font-black tracking-tighter uppercase mb-6 group-hover:text-primary transition-colors leading-none">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground font-medium mb-10 leading-relaxed text-lg">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap gap-8">
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground">
                            <Building2 className="h-4 w-4 text-primary" /> Mairie du Comté
                          </div>
                          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground">
                            <Clock className="h-4 w-4 text-primary" /> Disponibilité Immédiate
                          </div>
                        </div>
                      </div>
                      <div className="bg-primary/5 p-10 md:w-80 flex flex-col justify-center items-center gap-4 border-l border-primary/10">
                        <Dialog open={isModalOpen && selectedJob?.id === job.id} onOpenChange={(open) => {
                          setIsModalOpen(open);
                          if (open) setSelectedJob(job);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                              onClick={() => setSelectedJob(job)}
                            >
                              Déposer Dossier
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl rounded-[3rem] p-0 overflow-hidden border-0 bg-background shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                            <div className="bg-primary p-10 text-white relative">
                              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
                              <DialogHeader className="relative z-10">
                                <Badge className="bg-white/20 text-white mb-6 border-0 uppercase tracking-[0.2em]">Candidature RP</Badge>
                                <DialogTitle className="text-5xl font-black tracking-tighter uppercase leading-none">{job.title}</DialogTitle>
                                <DialogDescription className="text-primary-foreground/70 text-lg font-medium mt-4">
                                  Remplissez votre dossier administratif pour rejoindre nos services.
                                </DialogDescription>
                              </DialogHeader>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-10 max-h-[70vh] overflow-y-auto space-y-10 custom-scrollbar">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                                    <User className="h-3 w-3" /> Nom RP *
                                  </label>
                                  <Input required name="nom_rp" placeholder="Vercetti" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                                </div>
                                <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                                    <User className="h-3 w-3" /> Prénom RP *
                                  </label>
                                  <Input required name="prenom_rp" placeholder="Tommy" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> Âge RP *
                                  </label>
                                  <Input required name="age_rp" type="number" placeholder="25" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                                </div>
                                <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                                    <Hash className="h-3 w-3" /> Discord ID *
                                  </label>
                                  <Input required name="discord_id" placeholder="Nom#0000" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                                  <MessageSquare className="h-3 w-3" /> Motivation RP *
                                </label>
                                <Textarea required name="motivation" placeholder="Décrivez vos motivations pour rejoindre la mairie..." className="min-h-[150px] rounded-[2rem] bg-muted/50 border-0 focus-visible:ring-primary font-medium p-6" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                                  <Briefcase className="h-3 w-3" /> Expérience RP *
                                </label>
                                <Textarea required name="experience" placeholder="Parcours et expériences passées dans le comté..." className="min-h-[120px] rounded-[2rem] bg-muted/50 border-0 focus-visible:ring-primary font-medium p-6" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Disponibilités RP</label>
                                <Input name="disponibilites" placeholder="ex: Soirées et week-ends" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Comment avez-vous connu la mairie ?</label>
                                <Input name="source" placeholder="Bouche à oreille, réseaux, etc." className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                              </div>
                              <Button 
                                type="submit" 
                                className="w-full h-20 rounded-[1.5rem] font-black uppercase tracking-widest text-xl shadow-2xl shadow-primary/20 group"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <span className="flex items-center gap-3">Transmettre le Dossier <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
                                )}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* RP Section */}
      <section className="bg-primary py-32 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <ShieldCheck className="h-16 w-16 text-black mx-auto mb-10" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mb-8">UNE CARRIÈRE AU SERVICE <span className="text-black italic">DES CITOYENS</span></h2>
          <p className="text-xl text-primary-foreground/80 font-medium leading-relaxed">
            Travailler pour la mairie du comté de Blaine, c'est s'engager dans un RP de qualité, structuré et respectueux. Nous offrons des opportunités uniques d'interaction avec tous les services (LSPD, BCSO, LSMS) et les entreprises du comté.
          </p>
        </div>
      </section>
    </div>
  );
}
