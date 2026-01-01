"use client";

import React, { useEffect, useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle,
  PlusCircle,
  GripVertical,
  Settings2,
  ChevronRight,
  Save,
  Clock,
  Inbox,
  Layout
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  
  // Service Form State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formFields, setFormFields] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: servicesData } = await supabase.from("services").select("*").order("created_at", { ascending: false });
    const { data: subsData } = await supabase.from("submissions").select("*, service:services(title)").order("created_at", { ascending: false });
    
    setServices(servicesData || []);
    setSubmissions(subsData || []);
    setLoading(false);
  };

  const addField = () => {
    setFormFields([...formFields, { id: Math.random().toString(36).substr(2, 9), label: "", type: "text", required: true }]);
  };

  const updateField = (id: string, updates: any) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

    const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const serviceData = {
        title: formData.get("title"),
        description: formData.get("description"),
        is_active: formData.get("is_active") === "true",
        fields: formFields || [],
        category: "Général",
        icon: "FileText",
        link: "#"
      };

      if (!serviceData.title || !serviceData.description) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      let error;
      if (editingService) {
        const { error: err } = await supabase.from("services").update(serviceData).eq("id", editingService.id);
        error = err;
      } else {
        const { error: err } = await supabase.from("services").insert([serviceData]);
        error = err;
      }

      if (error) {
        console.error("Supabase Error:", error);
        toast.error(`Erreur: ${error.message || "Impossible d'enregistrer le service"}`);
      } else {
        toast.success(editingService ? "Service mis à jour" : "Service créé");
        setIsServiceModalOpen(false);
        setEditingService(null);
        setFormFields([]);
        fetchData();
      }
    };

  const handleDeleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      toast.success("Service supprimé");
      fetchData();
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("submissions").update({ status }).eq("id", id);
    if (error) toast.error("Erreur lors de la mise à jour");
    else {
      toast.success(`Dossier ${status === 'PROCESSED' ? 'traité' : 'rejeté'}`);
      fetchData();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">SERVICES <span className="text-primary italic">EN LIGNE</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Gérer les démarches administratives et les formulaires</p>
        </div>
        <Dialog open={isServiceModalOpen} onOpenChange={(open) => {
          setIsServiceModalOpen(open);
          if (!open) {
            setEditingService(null);
            setFormFields([]);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2">
              <Plus className="h-5 w-5" /> Nouveau Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl rounded-[2.5rem] border-0 bg-background/95 backdrop-blur-xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="p-8 border-b border-dashed">
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase">{editingService ? 'Modifier' : 'Créer'} un Service</DialogTitle>
              <DialogDescription className="font-medium">Configurez le formulaire et les détails de la démarche.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Titre du Service</label>
                  <Input name="title" defaultValue={editingService?.title} required placeholder="ex: Enregistrement d'Entreprise" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Statut</label>
                  <select name="is_active" defaultValue={editingService?.is_active?.toString() || "true"} className="w-full h-14 rounded-2xl bg-muted/50 border-0 px-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none">
                    <option value="true">ACTIF</option>
                    <option value="false">INACTIF</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Description RP</label>
                <Textarea name="description" defaultValue={editingService?.description} required placeholder="Décrivez l'utilité de cette démarche pour les citoyens..." className="min-h-[100px] rounded-3xl bg-muted/50 border-0 focus-visible:ring-primary font-medium p-6" />
              </div>

              <div className="space-y-6 pt-6 border-t border-dashed">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Layout className="h-4 w-4 text-primary" /> Configuration du Formulaire
                  </h3>
                  <Button type="button" variant="outline" size="sm" onClick={addField} className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2">
                    <PlusCircle className="h-4 w-4" /> Ajouter un Champ
                  </Button>
                </div>

                <div className="space-y-4">
                  {formFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-4 p-6 bg-muted/30 rounded-[2rem] border border-dashed group">
                      <div className="pt-3 text-muted-foreground/30"><GripVertical className="h-5 w-5" /></div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input 
                          placeholder="Libellé du champ" 
                          value={field.label} 
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="h-12 rounded-xl bg-background border-0 font-bold text-xs" 
                        />
                        <select 
                          value={field.type} 
                          onChange={(e) => updateField(field.id, { type: e.target.value })}
                          className="h-12 rounded-xl bg-background border-0 px-3 text-xs font-bold outline-none"
                        >
                          <option value="text">Texte Court</option>
                          <option value="textarea">Texte Long</option>
                          <option value="number">Nombre</option>
                        </select>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-[10px] font-bold uppercase cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={field.required} 
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              className="accent-primary"
                            /> Obligatoire
                          </label>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeField(field.id)} className="ml-auto text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formFields.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground font-medium text-sm border border-dashed rounded-[2rem]">
                      Aucun champ configuré. Cliquez sur "Ajouter un Champ".
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 mt-10">
                <Save className="h-5 w-5 mr-2" /> Enregistrer le Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="services" onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card/30 backdrop-blur-md p-1 rounded-2xl border mb-8">
          <TabsTrigger value="services" className="rounded-xl px-8 py-3 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
            Démarches Actives ({services.length})
          </TabsTrigger>
          <TabsTrigger value="subs" className="rounded-xl px-8 py-3 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
            Dossiers Reçus ({submissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-0 shadow-2xl bg-card/30 backdrop-blur-sm rounded-[2rem] overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-primary/10 p-3 rounded-2xl text-primary"><FileText className="h-6 w-6" /></div>
                      <Badge className={cn(
                        "uppercase text-[10px] font-black px-3 py-1 border-0",
                        service.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {service.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-black tracking-tighter uppercase mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 mb-8">{service.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-dashed">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => { setEditingService(service); setFormFields(service.fields || []); setIsServiceModalOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl text-red-500" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {service.fields?.length || 0} Champs
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subs">
          <Card className="border-0 shadow-2xl bg-card/30 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Service / Démarche</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date de Réception</th>
                      <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Statut</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed">
                    {submissions.map((sub, i) => (
                      <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-primary/5">
                        <td className="px-8 py-6">
                          <div className="text-sm font-black uppercase tracking-wider">{sub.service?.title}</div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" /> {new Date(sub.created_at).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-8 py-6">
                          <Badge className={cn(
                            "uppercase text-[9px] font-black px-2",
                            sub.status === 'PENDING' ? "bg-orange-500/10 text-orange-500" :
                            sub.status === 'PROCESSED' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          )}>
                            {sub.status === 'PENDING' ? 'En attente' : sub.status === 'PROCESSED' ? 'Traité' : 'Rejeté'}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2">
                                <Eye className="h-4 w-4" /> Voir Dossier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl rounded-[2.5rem] border-0 bg-card p-0 overflow-hidden shadow-2xl">
                              <div className="bg-primary p-10 text-white flex justify-between items-end">
                                <div>
                                  <Badge className="bg-white/20 text-white mb-4">DOSSIER ADMINISTRATIF</Badge>
                                  <h2 className="text-3xl font-black tracking-tighter uppercase">{sub.service?.title}</h2>
                                </div>
                                <div className="text-right opacity-60">
                                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">ID Dossier</p>
                                  <p className="font-mono text-xs">{sub.id.substring(0, 8)}</p>
                                </div>
                              </div>
                              <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 gap-6 bg-muted/30 p-8 rounded-3xl border border-dashed">
                                  {Object.entries(sub.data).map(([key, value]: [string, any]) => (
                                    <div key={key} className="space-y-1">
                                      <p className="text-[9px] font-black uppercase tracking-widest text-primary">{key}</p>
                                      <p className="text-sm font-bold leading-relaxed">{value?.toString() || "N/A"}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-4 pt-4">
                                  <Button className="flex-1 h-14 rounded-2xl bg-green-500 hover:bg-green-600 font-black uppercase tracking-widest gap-2" onClick={() => updateSubmissionStatus(sub.id, 'PROCESSED')}>
                                    <CheckCircle2 className="h-5 w-5" /> Marquer comme Traité
                                  </Button>
                                  <Button className="flex-1 h-14 rounded-2xl bg-red-500 hover:bg-red-600 font-black uppercase tracking-widest gap-2" onClick={() => updateSubmissionStatus(sub.id, 'REJECTED')}>
                                    <XCircle className="h-5 w-5" /> Rejeter le Dossier
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </motion.tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-muted-foreground font-medium flex flex-col items-center gap-4">
                          <Inbox className="h-12 w-12 opacity-10" />
                          Aucun dossier reçu pour le moment.
                        </td>
                      </tr>
                    )}
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
