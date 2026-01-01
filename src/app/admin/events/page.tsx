"use client";

import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  MapPin, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Save,
  Tag,
  CheckCircle2,
  XCircle
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Event Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: true });
      if (!error) setEvents(data || []);
      setLoading(false);
    };
  
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const dateStr = formData.get("date") as string;
      
      const eventData = {
        title: formData.get("title"),
        description: formData.get("description"),
        event_date: dateStr ? new Date(dateStr).toISOString() : null,
        location: formData.get("location"),
        category: "Général",
        image_url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=2670&auto=format&fit=crop"
      };

      if (!eventData.event_date) {
        toast.error("Veuillez sélectionner une date valide");
        return;
      }

    let error;
    if (editingItem) {
      const { error: err } = await supabase.from("events").update(eventData).eq("id", editingItem.id);
      error = err;
    } else {
      const { error: err } = await supabase.from("events").insert([eventData]);
      error = err;
    }

    if (error) {
      console.error("Supabase Error:", error);
      toast.error(`Erreur: ${error.message || "Impossible d'enregistrer"}`);
    } else {
      toast.success(editingItem ? "Événement mis à jour" : "Événement créé");
      setIsModalOpen(false);
      setEditingItem(null);
      fetchEvents();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      toast.success("Événement supprimé");
      fetchEvents();
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">CALENDRIER <span className="text-primary italic">DES ÉVÉNEMENTS</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Gérer les événements communautaires et officiels</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingItem(null);
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2">
              <Plus className="h-5 w-5" /> Créer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl rounded-[2.5rem] border-0 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="p-8 border-b border-dashed">
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase">{editingItem ? 'Modifier' : 'Créer'} un Événement</DialogTitle>
              <DialogDescription className="font-medium">Planifiez des rassemblements et des cérémonies pour le comté.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Titre de l'événement</label>
                <Input name="title" defaultValue={editingItem?.title} required className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Date et Heure</label>
                    <Input name="date" type="datetime-local" defaultValue={editingItem?.event_date ? new Date(editingItem.event_date).toISOString().slice(0, 16) : ""} required className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                  </div>
                  <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Lieu</label>
                  <Input name="location" defaultValue={editingItem?.location} placeholder="ex: Sandy Shores Park" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Description</label>
                <Textarea name="description" defaultValue={editingItem?.description} required className="min-h-[120px] rounded-3xl bg-muted/50 border-0 focus-visible:ring-primary font-medium p-6" />
              </div>
              <DialogFooter className="pt-6">
                <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                  {editingItem ? 'Mettre à jour' : 'Créer l\'événement'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-2xl bg-card/30 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="p-8 border-b border-dashed flex flex-col md:flex-row gap-6 items-center bg-card/50">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un événement..." 
                className="pl-14 h-14 rounded-2xl bg-background border-0 focus-visible:ring-primary font-bold" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Événement</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date / Heure</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Lieu</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed">
                {filteredEvents.map((item, i) => (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-primary/5">
                    <td className="px-8 py-6">
                      <div className="text-sm font-black uppercase tracking-wider">{item.title}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs font-bold text-primary flex items-center gap-2">
                        <Clock className="h-3 w-3" /> {item.event_date ? new Date(item.event_date).toLocaleString('fr-FR') : "Date non définie"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> {item.location || "Non spécifié"}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl text-red-500" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-muted-foreground font-medium">
                      Aucun événement trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
