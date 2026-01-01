"use client";

import React, { useEffect, useState } from "react";
import { 
  Newspaper, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  ChevronRight,
  Save,
  Tag
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
import Link from "next/link";

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // News Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (!error) setNews(data || []);
    setLoading(false);
  };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("Auth Error:", authError);
        toast.error("Votre session a expiré. Veuillez vous reconnecter.");
        return;
      }

      const formData = new FormData(e.currentTarget);
      const newsData: any = {
        title: formData.get("title"),
        content: formData.get("content"),
        category: formData.get("category") || "Général",
        image_url: formData.get("image_url") || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop",
        published_at: new Date().toISOString()
      };
  
      let error;
      if (editingItem) {
        const { error: err } = await supabase.from("news").update(newsData).eq("id", editingItem.id);
        error = err;
      } else {
        newsData.author_id = user.id;
        const { error: err } = await supabase.from("news").insert([newsData]);
        error = err;
      }

    if (error) {
      console.error("Supabase Error:", error);
      toast.error(`Erreur: ${error.message || "Impossible de publier"}`);
    } else {
      toast.success(editingItem ? "Actualité mise à jour" : "Actualité publiée");
      setIsModalOpen(false);
      setEditingItem(null);
      fetchNews();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      toast.success("Actualité supprimée");
      fetchNews();
    }
  };

  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">SALLE <span className="text-primary italic">DE PRESSE</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Gérer les actualités et les communiqués officiels</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingItem(null);
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2">
              <Plus className="h-5 w-5" /> Publier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl rounded-[2.5rem] border-0 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="p-8 border-b border-dashed">
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase">{editingItem ? 'Modifier' : 'Publier'} une Actualité</DialogTitle>
              <DialogDescription className="font-medium">Communiquez les dernières nouvelles du comté aux citoyens.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Titre</label>
                  <Input name="title" defaultValue={editingItem?.title} required className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Catégorie</label>
                  <Input name="category" defaultValue={editingItem?.category} placeholder="ex: Infrastructure, Communauté..." className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">URL de l'image</label>
                <Input name="image_url" defaultValue={editingItem?.image_url} placeholder="https://..." className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Contenu</label>
                <Textarea name="content" defaultValue={editingItem?.content} required className="min-h-[200px] rounded-3xl bg-muted/50 border-0 focus-visible:ring-primary font-medium p-6" />
              </div>
              <DialogFooter className="pt-6">
                <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                  {editingItem ? 'Mettre à jour' : 'Publier maintenant'}
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
                placeholder="Rechercher une actualité..." 
                className="pl-14 h-14 rounded-2xl bg-background border-0 focus-visible:ring-primary font-bold" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            {filteredNews.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-0 shadow-2xl bg-card/50 rounded-[2rem] overflow-hidden group">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={item.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop"} 
                      className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                      alt={item.title}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 text-black border-0 font-black uppercase tracking-widest text-[9px]">{item.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                      <Clock className="h-3 w-3" /> {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <h3 className="text-lg font-black tracking-tighter uppercase mb-4 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between pt-4 border-t border-dashed">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl text-red-500" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Link href={`/actualites`} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                        Voir <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredNews.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground font-medium">
                Aucune actualité trouvée.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
