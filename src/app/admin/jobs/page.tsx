"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Eye, 
  User, 
  MessageSquare, 
  Clock, 
  ExternalLink, 
  UserCheck, 
  UserX, 
  X,
  Keyboard,
  Edit,
  Power,
  PowerOff
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");
  
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: jobsData } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
    const { data: appsData } = await supabase.from("applications").select("*, job:jobs(title)").order("created_at", { ascending: false });
    
    setJobs(jobsData || []);
    setApplications(appsData || []);
    setLoading(false);
  };

  const handleSaveJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobData = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
    };

    let error;
    if (editingJob) {
      const { error: err } = await supabase.from("jobs").update(jobData).eq("id", editingJob.id);
      error = err;
    } else {
      const { error: err } = await supabase.from("jobs").insert([jobData]);
      error = err;
    }

    if (error) {
      toast.error("Erreur lors de l'enregistrement");
    } else {
      toast.success(editingJob ? "Offre mise à jour" : "Offre créée");
      setIsJobModalOpen(false);
      setEditingJob(null);
      fetchData();
    }
  };

  const toggleJobStatus = async (job: any) => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    const { error } = await supabase.from("jobs").update({ status: newStatus }).eq("id", job.id);
    if (error) toast.error("Erreur de statut");
    else {
      toast.success(`Offre ${newStatus === 'OPEN' ? 'ouverte' : 'fermée'}`);
      fetchData();
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Attention : Cela supprimera aussi toutes les candidatures liées.")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) toast.error("Erreur (Vérifie le CASCADE sur Supabase)");
    else {
      toast.success("Offre supprimée");
      fetchData();
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) toast.error("Erreur lors de la mise à jour");
    else {
      toast.success(`Candidature mise à jour`);
      fetchData();
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Supprimer cette candidature ?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) toast.error("Erreur");
    else {
      toast.success("Candidature supprimée");
      fetchData();
    }
  };

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto p-6">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">RECRUTEMENT <span className="text-primary italic">ET CARRIÈRES</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Tableau de Bord Administratif</p>
        </div>
        <Dialog open={isJobModalOpen} onOpenChange={(open) => { setIsJobModalOpen(open); if (!open) setEditingJob(null); }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 transition-transform hover:scale-105">
              <Plus className="h-5 w-5" /> Nouvelle Offre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[2.5rem] border-0 bg-background shadow-2xl">
            <DialogHeader className="p-8 border-b border-dashed">
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase">{editingJob ? 'Modifier' : 'Créer'} une Offre</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveJob} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase ml-2 text-muted-foreground">Titre du Poste</label>
                <Input name="title" defaultValue={editingJob?.title} required className="h-14 rounded-2xl bg-muted/50 border-0 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase ml-2 text-muted-foreground">Description</label>
                <Textarea name="description" defaultValue={editingJob?.description} required className="min-h-[150px] rounded-3xl bg-muted/50 border-0 font-medium p-6" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase ml-2 text-muted-foreground">Statut Initial</label>
                <select name="status" defaultValue={editingJob?.status || "OPEN"} className="w-full h-14 rounded-2xl bg-muted/50 border-0 px-4 font-bold outline-none focus:ring-2 focus:ring-primary">
                  <option value="OPEN">OUVERTE</option>
                  <option value="CLOSED">FERMÉE</option>
                </select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest">Enregistrer l'offre</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="bg-card/30 backdrop-blur-md p-1 rounded-2xl border mb-8">
          <TabsTrigger value="jobs" className="rounded-xl px-8 py-3 font-black uppercase text-[10px]">Offres ({jobs.length})</TabsTrigger>
          <TabsTrigger value="apps" className="rounded-xl px-8 py-3 font-black uppercase text-[10px]">Candidatures ({applications.length})</TabsTrigger>
        </TabsList>

        {/* ONGLET : OFFRES D'EMPLOI */}
        <TabsContent value="jobs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="border-0 shadow-2xl bg-card/30 rounded-[2rem] overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary"><Briefcase className="h-6 w-6"/></div>
                    <Badge className={cn(
                      "uppercase text-[10px] font-black px-3 py-1 border-0",
                      job.status === 'OPEN' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {job.status === 'OPEN' ? 'Ouverte' : 'Fermée'}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-black uppercase mb-4 tracking-tighter group-hover:text-primary transition-colors">{job.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium line-clamp-2 mb-8 break-words">{job.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-dashed gap-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={cn(
                          "rounded-xl font-black text-[9px] uppercase tracking-tighter border-2",
                          job.status === 'OPEN' ? "text-red-500 border-red-500/20 hover:bg-red-50" : "text-green-500 border-green-500/20 hover:bg-green-50"
                        )}
                        onClick={() => toggleJobStatus(job)}
                      >
                        {job.status === 'OPEN' ? <PowerOff className="h-3 w-3 mr-1"/> : <Power className="h-3 w-3 mr-1"/>}
                        {job.status === 'OPEN' ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => { setEditingJob(job); setIsJobModalOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl text-red-500 hover:bg-red-50" onClick={() => handleDeleteJob(job.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ONGLET : CANDIDATURES */}
        <TabsContent value="apps">
          <Card className="border-0 shadow-2xl bg-card/30 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase text-muted-foreground">Candidat</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase text-muted-foreground">Poste Visé</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase text-muted-foreground">Statut</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black uppercase text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-primary/5 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-black uppercase text-sm tracking-tight">{app.nom_rp} {app.prenom_rp}</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">{app.discord_id}</div>
                        </td>
                        <td className="px-8 py-6">
                          <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase">
                            {app.job?.title || app.poste}
                          </Badge>
                        </td>
                        <td className="px-8 py-6">
                           <Badge className={cn(
                            "uppercase text-[9px] font-black px-2",
                            app.status === 'PENDING' ? "bg-orange-500/10 text-orange-500" :
                            app.status === 'ACCEPTED' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          )}>
                            {app.status === 'PENDING' ? 'En attente' : app.status === 'ACCEPTED' ? 'Acceptée' : 'Refusée'}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="rounded-xl font-black text-[10px] border-2 uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                  <Eye className="h-4 w-4 mr-2" /> Détails
                                </Button>
                              </DialogTrigger>
                              
                              {/* MODALE DESIGN FLOTTANT */}
                              <DialogContent 
                                className="!fixed !inset-6 !max-w-[90vw] !max-h-[95vh] !w-full !h-full !translate-x-0 !translate-y-0 rounded-[3rem] border-0 bg-background p-0 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] flex flex-col mx-auto my-auto"
                              >
                                {/* Header Modale */}
                                <div className="bg-primary p-10 text-white flex justify-between items-center shrink-0 shadow-lg">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <Badge className="bg-white/20 text-white border-0 font-black px-3 py-1 text-[10px] uppercase tracking-widest">Dossier de Recrutement</Badge>
                                      <span className="text-[10px] font-bold opacity-60 flex items-center gap-1 uppercase"><Keyboard className="h-3 w-3"/> Echap pour quitter</span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none break-all">{app.nom_rp} {app.prenom_rp}</h2>
                                  </div>
                                  <DialogClose asChild>
                                    <Button variant="ghost" className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-110">
                                      <X className="h-8 w-8 md:h-10 md:w-10" />
                                    </Button>
                                  </DialogClose>
                                </div>
                                
                                {/* Contenu Scrollable */}
                                <div className="flex-grow overflow-y-auto p-8 md:p-16 bg-muted/5 custom-scrollbar">
                                  <div className="max-w-5xl mx-auto space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div className="bg-card p-8 rounded-[2rem] border shadow-sm">
                                        <p className="text-[10px] font-black text-muted-foreground mb-4 uppercase flex items-center gap-2"><User className="h-4 w-4 text-primary"/> Âge du personnage</p>
                                        <p className="text-4xl font-black">{app.age_rp} <span className="text-lg opacity-40 italic font-bold">ANS</span></p>
                                      </div>
                                      <div className="bg-card p-8 rounded-[2rem] border shadow-sm">
                                        <p className="text-[10px] font-black text-muted-foreground mb-4 uppercase flex items-center gap-2"><Clock className="h-4 w-4 text-primary"/> Disponibilités</p>
                                        <p className="text-xl font-bold leading-tight break-all uppercase">{app.disponibilites || "Non renseigné"}</p>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2 italic">
                                        <MessageSquare className="h-4 w-4" /> Lettre de Motivation
                                      </h4>
                                      <div className="bg-card p-10 rounded-[2.5rem] border-2 border-dashed text-lg font-medium leading-relaxed whitespace-pre-wrap break-all shadow-inner">
                                        {app.motivation}
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2 italic">
                                        <Briefcase className="h-4 w-4" /> Expériences Passées
                                      </h4>
                                      <div className="bg-card p-10 rounded-[2.5rem] border-2 border-dashed text-lg font-medium leading-relaxed whitespace-pre-wrap break-all shadow-inner">
                                        {app.experience}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="p-8 bg-background border-t flex flex-col md:flex-row gap-4 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                                  <Button 
                                    className="flex-1 h-16 rounded-2xl bg-green-500 hover:bg-green-600 font-black uppercase tracking-widest gap-3 text-lg transition-transform active:scale-95"
                                    onClick={() => updateApplicationStatus(app.id, 'ACCEPTED')}
                                  >
                                    <UserCheck className="h-6 w-6" /> Valider le candidat
                                  </Button>
                                  <Button 
                                    className="flex-1 h-16 rounded-2xl bg-red-500 hover:bg-red-600 font-black uppercase tracking-widest gap-3 text-lg transition-transform active:scale-95"
                                    onClick={() => updateApplicationStatus(app.id, 'REJECTED')}
                                  >
                                    <UserX className="h-6 w-6" /> Refuser le dossier
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" className="rounded-xl text-red-500" onClick={() => handleDeleteApplication(app.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}