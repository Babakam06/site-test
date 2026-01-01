"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Settings, 
  Save, 
  Image as ImageIcon, 
  User, 
  FileText, 
  Globe, 
  Users, 
  Plus, 
  Trash2, 
  GripVertical,
  Loader2,
  Check,
  AlertCircle,
  PhoneCall
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface Setting {
  key: string;
  value: string;
}

interface QuickLink {
  id: string;
  title: string;
  description: string;
  href: string;
  icon_name: string;
  order_index: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image_url: string;
  bio: string;
  discord_id: string;
  order_index: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
    const [settings, setSettings] = useState<Record<string, string>>({
      mayor_name: "",
      mayor_photo_url: "",
      mayor_vision_title: "",
      mayor_vision_text: "",
        mayor_phone: "555-0100",
        mayor_email: "contact@blainecounty.gov",
        mayor_address: "100 Main St, Sandy Shores, BC",
      hero_title: "COMTÉ DE BLAINE",

    hero_subtitle: "Dédié à servir notre communauté avec intégrité, innovation et transparence.",
    hero_image_url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=2670&auto=format&fit=crop",
    hero_button_text: "Explorer les Services",
    hero_button_link: "/demarches",
    hero_secondary_button_text: "Nous Contacter",
    hero_secondary_button_link: "/contact",
    emergency_title: "COMMENT POUVONS-NOUS VOUS AIDER ?",
    emergency_subtitle: "Notre personnel dévoué est disponible du lundi au vendredi pour répondre à vos demandes et besoins de services.",
    emergency_button_text: "Contacter la Mairie",
    emergency_button_link: "/contact",
    show_mayor_section: "true",
    show_news_section: "true",
    show_emergency_section: "true",
  });
  
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [newQuickLink, setNewQuickLink] = useState<Partial<QuickLink>>({
    title: "",
    description: "",
    href: "",
    icon_name: "FileText",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    department: "",
    image_url: "",
    bio: "",
    discord_id: "",
  });

  useEffect(() => {
    checkAccess();
    fetchData();
  }, []);

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profile || profile.role !== "SUPER_ADMIN") {
      toast.error("Accès réservé aux Super Admins");
      router.replace("/admin");
      return;
    }

    setIsSuperAdmin(true);
  };

  const fetchData = async () => {
    setLoading(true);
    
    const { data: settingsData } = await supabase
      .from("settings")
      .select("key, value");
    
    if (settingsData) {
      const newSettings = { ...settings };
      settingsData.forEach(s => {
        newSettings[s.key] = s.value;
      });
      setSettings(newSettings);
    }

    const { data: qlData } = await supabase
      .from("quick_links")
      .select("*")
      .order("order_index", { ascending: true });
    if (qlData) setQuickLinks(qlData);

    const { data: teamData } = await supabase
      .from("team_members")
      .select("*")
      .order("order_index", { ascending: true });
    
    if (teamData) setTeamMembers(teamData);

    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value }, { onConflict: "key" });
      
      if (error) {
        toast.error(`Erreur lors de la sauvegarde de ${key}`);
        setSaving(false);
        return;
      }
    }

    toast.success("Paramètres sauvegardés avec succès");
    setSaving(false);
  };

  const addQuickLink = async () => {
    if (!newQuickLink.title || !newQuickLink.href) {
      toast.error("Le titre et le lien sont requis");
      return;
    }

    const { error } = await supabase
      .from("quick_links")
      .insert({
        ...newQuickLink,
        order_index: quickLinks.length + 1,
      });

    if (error) {
      toast.error("Erreur lors de l'ajout");
      return;
    }

    toast.success("Lien ajouté");
    setNewQuickLink({ title: "", description: "", href: "", icon_name: "FileText" });
    fetchData();
  };

  const updateQuickLink = async (id: string, updates: Partial<QuickLink>) => {
    const { error } = await supabase
      .from("quick_links")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return;
    }
    toast.success("Lien mis à jour");
    fetchData();
  };

  const deleteQuickLink = async (id: string) => {
    const { error } = await supabase
      .from("quick_links")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }

    toast.success("Lien supprimé");
    fetchData();
  };

  const addTeamMember = async () => {
    if (!newMember.name || !newMember.role) {
      toast.error("Le nom et le rôle sont requis");
      return;
    }

    const { error } = await supabase
      .from("team_members")
      .insert({
        ...newMember,
        order_index: teamMembers.length + 1,
      });

    if (error) {
      toast.error("Erreur lors de l'ajout");
      return;
    }

    toast.success("Membre ajouté avec succès");
    setNewMember({
      name: "",
      role: "",
      department: "",
      image_url: "",
      bio: "",
      discord_id: "",
    });
    fetchData();
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    const { error } = await supabase
      .from("team_members")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return;
    }

    setTeamMembers(prev => 
      prev.map(m => m.id === id ? { ...m, ...updates } : m)
    );
  };

  const deleteTeamMember = async (id: string) => {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }

    toast.success("Membre supprimé");
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSuperAdmin) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-6 w-6 text-primary" />
            <Badge className="bg-red-500/10 text-red-500 border-0 font-black uppercase tracking-widest">Super Admin</Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Paramètres du Site</h1>
          <p className="text-muted-foreground mt-2">Personnalisez l'apparence et le contenu du site</p>
        </div>
        <Button 
          onClick={saveSettings} 
          disabled={saving}
          className="rounded-full px-8 h-14 font-black uppercase tracking-widest shadow-xl"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="mayor" className="space-y-8">
        <TabsList className="bg-muted/50 p-2 rounded-2xl h-auto flex-wrap">
          <TabsTrigger value="mayor" className="rounded-xl px-6 py-3 font-bold uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" /> Maire
          </TabsTrigger>
              <TabsTrigger value="hero" className="rounded-xl px-6 py-3 font-bold uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
                <Globe className="h-4 w-4 mr-2" /> Page d'Accueil
              </TabsTrigger>
              <TabsTrigger value="emergency" className="rounded-xl px-6 py-3 font-bold uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
                <PhoneCall className="h-4 w-4 mr-2" /> Urgence
              </TabsTrigger>
              <TabsTrigger value="sections" className="rounded-xl px-6 py-3 font-bold uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" /> Sections
              </TabsTrigger>
              <TabsTrigger value="quicklinks" className="rounded-xl px-6 py-3 font-bold uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
                <GripVertical className="h-4 w-4 mr-2" /> Liens Rapides
              </TabsTrigger>
            <TabsTrigger value="team" className="rounded-xl px-6 py-3 font-bold uppercase tracking-wider text-xs data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" /> Organigramme
            </TabsTrigger>
          </TabsList>

        <TabsContent value="mayor" className="space-y-6">
          <Card className="border-0 shadow-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                Informations du Maire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Nom du Maire</Label>
                    <Input
                      value={settings.mayor_name}
                      onChange={(e) => setSettings(prev => ({ ...prev, mayor_name: e.target.value }))}
                      placeholder="Nom complet"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">URL de la Photo</Label>
                    <Input
                      value={settings.mayor_photo_url}
                      onChange={(e) => setSettings(prev => ({ ...prev, mayor_photo_url: e.target.value }))}
                      placeholder="https://..."
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Téléphone Mairie</Label>
                    <Input
                      value={settings.mayor_phone}
                      onChange={(e) => setSettings(prev => ({ ...prev, mayor_phone: e.target.value }))}
                      placeholder="Ex: Via App Service"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Email Mairie</Label>
                    <Input
                      value={settings.mayor_email}
                      onChange={(e) => setSettings(prev => ({ ...prev, mayor_email: e.target.value }))}
                      placeholder="contact@blainecounty.gov"
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Adresse Mairie</Label>
                  <Input
                    value={settings.mayor_address}
                    onChange={(e) => setSettings(prev => ({ ...prev, mayor_address: e.target.value }))}
                    placeholder="100 Main St, Sandy Shores, BC"
                    className="rounded-xl h-12"
                  />
                </div>

              
              {settings.mayor_photo_url && (
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-muted">
                    <img 
                      src={settings.mayor_photo_url} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Aperçu de la photo</p>
                    <p className="text-sm text-muted-foreground">Utilisez une image carrée de haute qualité pour un meilleur rendu.</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Titre de la Vision</Label>
                <Input
                  value={settings.mayor_vision_title}
                  onChange={(e) => setSettings(prev => ({ ...prev, mayor_vision_title: e.target.value }))}
                  placeholder="Ex: Construire l'Avenir Ensemble"
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Texte de la Vision</Label>
                <Textarea
                  value={settings.mayor_vision_text}
                  onChange={(e) => setSettings(prev => ({ ...prev, mayor_vision_text: e.target.value }))}
                  placeholder="Message du maire..."
                  rows={4}
                  className="rounded-xl resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          <TabsContent value="hero" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-[2rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  Section Hero (Accueil)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Titre Principal</Label>
                  <Input
                    value={settings.hero_title}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                    placeholder="COMTÉ DE BLAINE"
                    className="rounded-xl h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Sous-titre</Label>
                  <Textarea
                    value={settings.hero_subtitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                    placeholder="Description courte..."
                    rows={2}
                    className="rounded-xl resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Texte Bouton Principal</Label>
                    <Input
                      value={settings.hero_button_text}
                      onChange={(e) => setSettings(prev => ({ ...prev, hero_button_text: e.target.value }))}
                      placeholder="Explorer les Services"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Lien Bouton Principal</Label>
                    <Input
                      value={settings.hero_button_link}
                      onChange={(e) => setSettings(prev => ({ ...prev, hero_button_link: e.target.value }))}
                      placeholder="/demarches"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Texte Bouton Secondaire</Label>
                    <Input
                      value={settings.hero_secondary_button_text}
                      onChange={(e) => setSettings(prev => ({ ...prev, hero_secondary_button_text: e.target.value }))}
                      placeholder="Nous Contacter"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Lien Bouton Secondaire</Label>
                    <Input
                      value={settings.hero_secondary_button_link}
                      onChange={(e) => setSettings(prev => ({ ...prev, hero_secondary_button_link: e.target.value }))}
                      placeholder="/contact"
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">URL de l'Image de Fond</Label>
                  <Input
                    value={settings.hero_image_url}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_image_url: e.target.value }))}
                    placeholder="https://..."
                    className="rounded-xl h-12"
                  />
                </div>

                {settings.hero_image_url && (
                  <div className="rounded-2xl overflow-hidden aspect-video bg-muted">
                    <img 
                      src={settings.hero_image_url} 
                      alt="Aperçu Hero" 
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-[2rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-primary" />
                  Section Urgence / Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Titre</Label>
                  <Input
                    value={settings.emergency_title}
                    onChange={(e) => setSettings(prev => ({ ...prev, emergency_title: e.target.value }))}
                    placeholder="COMMENT POUVONS-NOUS VOUS AIDER ?"
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Sous-titre</Label>
                  <Textarea
                    value={settings.emergency_subtitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, emergency_subtitle: e.target.value }))}
                    placeholder="Description..."
                    rows={3}
                    className="rounded-xl resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Texte Bouton</Label>
                    <Input
                      value={settings.emergency_button_text}
                      onChange={(e) => setSettings(prev => ({ ...prev, emergency_button_text: e.target.value }))}
                      placeholder="Contacter la Mairie"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Lien Bouton</Label>
                    <Input
                      value={settings.emergency_button_link}
                      onChange={(e) => setSettings(prev => ({ ...prev, emergency_button_link: e.target.value }))}
                      placeholder="/contact"
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-[2rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  Visibilité des Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold uppercase tracking-tight">Section du Maire</Label>
                    <p className="text-sm text-muted-foreground">Afficher ou masquer le message et la photo du maire sur l'accueil.</p>
                  </div>
                  <Switch 
                    checked={settings.show_mayor_section === "true"} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_mayor_section: checked ? "true" : "false" }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold uppercase tracking-tight">Section Actualités</Label>
                    <p className="text-sm text-muted-foreground">Afficher ou masquer les dernières actualités sur l'accueil.</p>
                  </div>
                  <Switch 
                    checked={settings.show_news_section === "true"} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_news_section: checked ? "true" : "false" }))} 
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold uppercase tracking-tight">Section Urgence / Contact</Label>
                    <p className="text-sm text-muted-foreground">Afficher ou masquer la bannière de contact en bas de page.</p>
                  </div>
                  <Switch 
                    checked={settings.show_emergency_section === "true"} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_emergency_section: checked ? "true" : "false" }))} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quicklinks" className="space-y-6">
            <Card className="border-0 shadow-xl rounded-[2rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Plus className="h-5 w-5 text-primary" />
                  Ajouter un Lien Rapide
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Titre *</Label>
                    <Input
                      value={newQuickLink.title}
                      onChange={(e) => setNewQuickLink(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Services"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Lien (URL) *</Label>
                    <Input
                      value={newQuickLink.href}
                      onChange={(e) => setNewQuickLink(prev => ({ ...prev, href: e.target.value }))}
                      placeholder="Ex: /demarches"
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Icône (Lucide Name)</Label>
                    <Input
                      value={newQuickLink.icon_name}
                      onChange={(e) => setNewQuickLink(prev => ({ ...prev, icon_name: e.target.value }))}
                      placeholder="Ex: FileText, Building2..."
                      className="rounded-xl h-12"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Description</Label>
                  <Input
                    value={newQuickLink.description}
                    onChange={(e) => setNewQuickLink(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Courte description du lien..."
                    className="rounded-xl h-12"
                  />
                </div>
                <Button 
                  onClick={addQuickLink}
                  className="mt-6 rounded-full px-8 h-12 font-black uppercase tracking-widest"
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter le Lien
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickLinks.map((link) => (
                <Card key={link.id} className="border-0 shadow-lg rounded-[2rem] overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <Input
                          value={link.title}
                          onChange={(e) => updateQuickLink(link.id, { title: e.target.value })}
                          className="font-black uppercase tracking-tight text-lg border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                        />
                        <Input
                          value={link.description}
                          onChange={(e) => updateQuickLink(link.id, { description: e.target.value })}
                          className="text-xs font-medium text-muted-foreground border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        onClick={() => deleteQuickLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">URL</Label>
                        <Input
                          value={link.href}
                          onChange={(e) => updateQuickLink(link.id, { href: e.target.value })}
                          className="h-9 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Icône</Label>
                        <Input
                          value={link.icon_name}
                          onChange={(e) => updateQuickLink(link.id, { icon_name: e.target.value })}
                          className="h-9 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">

          <Card className="border-0 shadow-xl rounded-[2rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <Plus className="h-5 w-5 text-primary" />
                Ajouter un Membre
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Nom *</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom complet"
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Rôle *</Label>
                  <Input
                    value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Ex: Maire, Shérif..."
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Département</Label>
                  <Input
                    value={newMember.department}
                    onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Ex: LSSD, SAMS..."
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">URL Photo</Label>
                  <Input
                    value={newMember.image_url}
                    onChange={(e) => setNewMember(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Discord ID</Label>
                  <Input
                    value={newMember.discord_id}
                    onChange={(e) => setNewMember(prev => ({ ...prev, discord_id: e.target.value }))}
                    placeholder="User#0001"
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Bio</Label>
                  <Input
                    value={newMember.bio}
                    onChange={(e) => setNewMember(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Courte description..."
                    className="rounded-xl h-12"
                  />
                </div>
              </div>
              <Button 
                onClick={addTeamMember}
                className="mt-6 rounded-full px-8 h-12 font-black uppercase tracking-widest"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter le Membre
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-lg rounded-[2rem] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {member.image_url && (
                        <div className="w-32 h-32 flex-shrink-0">
                          <img 
                            src={member.image_url} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-black text-lg uppercase tracking-tight">{member.name}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{member.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                            onClick={() => deleteTeamMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {member.department && (
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] font-black uppercase tracking-widest">
                            {member.department}
                          </Badge>
                        )}
                        <div className="mt-4 space-y-2">
                          <Input
                            value={member.discord_id || ""}
                            onChange={(e) => updateTeamMember(member.id, { discord_id: e.target.value })}
                            placeholder="Discord ID"
                            className="rounded-xl h-10 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
