"use client";

import React, { useEffect, useState } from "react";
import { 
  ExternalLink, 
  MessageSquare, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Terminal,
  ShieldCheck,
  Zap,
  Save,
  Eye,
  EyeOff,
  Send,
  FileText,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState({
    contact: "",
    demarches: "",
    recrutement: ""
  });
  const [showUrls, setShowUrls] = useState({
    contact: false,
    demarches: false,
    recrutement: false
  });
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (profile) setRole(profile.role);
    }
  };

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["discord_webhook_contact", "discord_webhook_demarches", "discord_webhook_recrutement"]);
    
    if (data) {
      const newWebhooks = { ...webhooks };
      data.forEach(item => {
        if (item.key === "discord_webhook_contact") newWebhooks.contact = item.value;
        if (item.key === "discord_webhook_demarches") newWebhooks.demarches = item.value;
        if (item.key === "discord_webhook_recrutement") newWebhooks.recrutement = item.value;
      });
      setWebhooks(newWebhooks);
    }
  };

  const handleSave = async (type: keyof typeof webhooks) => {
    setIsSaving(type);
    const key = `discord_webhook_${type}`;
    const value = webhooks[type];
    
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", key)
      .single();

    let error;
    if (existing) {
      const { error: err } = await supabase
        .from("settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("settings")
        .insert([{ key, value }]);
      error = err;
    }

    if (error) {
      toast.error(`Erreur lors de la sauvegarde (${type})`);
    } else {
      toast.success(`Webhook Discord ${type} sauvegardé !`);
    }
    setIsSaving(null);
  };

  const handleTest = async (type: keyof typeof webhooks) => {
    const webhookUrl = webhooks[type];
    if (!webhookUrl) {
      toast.error("Veuillez d'abord configurer l'URL du webhook");
      return;
    }

    setIsTesting(type);
    try {
      let testData = {};
      let webhookType = "";

      if (type === "contact") {
        webhookType = "contact";
        testData = {
          prenom: "Test",
          nom: "Contact",
          email: "test@mairie.bc",
          sujet: "Test de connexion Discord",
          message: "Ceci est un message de test pour le webhook CONTACT.",
        };
      } else if (type === "demarches") {
        webhookType = "demarche";
        testData = {
          type_demarche: "TEST SYSTÈME",
          prenom: "Admin",
          nom: "Test",
          email: "admin@mairie.bc",
          telephone: "555-0100",
          adresse: "Mairie de Blaine County",
          details: "Test de fonctionnement du webhook DÉMARCHES.",
        };
      } else if (type === "recrutement") {
        webhookType = "candidature";
        testData = {
          nom_rp: "Test",
          prenom_rp: "Recrutement",
          age_rp: 25,
          poste: "Poste de Test",
          motivation: "Test de fonctionnement du webhook RECRUTEMENT.",
          experience: "Expertise en tests système.",
          discord_id: "Admin#0001",
          disponibilites: "24/7",
        };
      }

      const response = await fetch("/api/webhook/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: webhookType,
          data: testData,
          webhookUrl,
        }),
      });

      if (response.ok) {
        toast.success(`Notification de test envoyée (${type}) !`, {
          description: "Vérifiez votre salon Discord.",
        });
      } else {
        toast.error("Échec de l'envoi", {
          description: "Vérifiez l'URL du webhook.",
        });
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    }
    setIsTesting(null);
  };

  const toggleShow = (type: keyof typeof showUrls) => {
    setShowUrls(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const updateUrl = (type: keyof typeof webhooks, value: string) => {
    setWebhooks(prev => ({ ...prev, [type]: value }));
  };

  if (role !== "SUPER_ADMIN") {
    return (
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">INTÉGRATIONS <span className="text-primary italic">SYSTÈME</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Accès restreint au Super Administrateur</p>
        </div>
        <Card className="border-0 shadow-2xl bg-red-500/10 rounded-[2.5rem] p-12 text-center">
          <ShieldCheck className="h-16 w-16 mx-auto mb-6 text-red-500 opacity-50" />
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Accès Refusé</h2>
          <p className="text-muted-foreground font-medium">Cette section est réservée aux Super Administrateurs.</p>
        </Card>
      </div>
    );
  }

  const webhookConfig = [
    { id: "contact", label: "Contact & Messages", icon: MessageSquare, color: "bg-emerald-500" },
    { id: "demarches", label: "Démarches Administratives", icon: FileText, color: "bg-orange-500" },
    { id: "recrutement", label: "Recrutements & Candidatures", icon: Briefcase, color: "bg-blue-500" }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">INTÉGRATIONS <span className="text-primary italic">DISCORD</span></h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Séparez vos notifications par salon Discord</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          {webhookConfig.map((config) => {
            const type = config.id as keyof typeof webhooks;
            return (
              <Card key={type} className="border-0 shadow-2xl bg-card/30 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className={`p-6 ${config.color} text-white flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                      <config.icon className="h-5 w-5" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">{config.label}</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 uppercase text-[10px] font-black">Actif</Badge>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                      URL du Webhook Discord
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Input 
                          type={showUrls[type] ? "text" : "password"}
                          value={webhooks[type]}
                          onChange={(e) => updateUrl(type, e.target.value)}
                          placeholder="https://discord.com/api/webhooks/..."
                          className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-mono text-sm pr-12"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                          onClick={() => toggleShow(type)}
                        >
                          {showUrls[type] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="h-14 px-6 rounded-2xl bg-primary hover:opacity-90 font-black uppercase tracking-widest gap-2 flex-1 sm:flex-none"
                          onClick={() => handleSave(type)}
                          disabled={isSaving === type}
                        >
                          {isSaving === type ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                          Sauvegarder
                        </Button>
                        <Button 
                          variant="outline"
                          className="h-14 px-6 rounded-2xl border-dashed font-black uppercase tracking-widest gap-2 flex-1 sm:flex-none"
                          onClick={() => handleTest(type)}
                          disabled={isTesting === type || !webhooks[type]}
                        >
                          {isTesting === type ? <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
                          Test
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="xl:col-span-4 space-y-8">
          <Card className="border-0 shadow-2xl bg-[#5865F2] text-white rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
            <div className="relative z-10 space-y-6">
              <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">Guide Discord</h3>
              <div className="space-y-4">
                {[
                  "Paramètres du serveur",
                  "Onglet 'Intégrations'",
                  "Nouveau Webhook",
                  "Choisir le salon dédié",
                  "Copier & Coller l'URL"
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="h-6 w-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck className="h-6 w-6" />
              <h3 className="text-xl font-black uppercase tracking-tighter">Sécurité</h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Chaque flux est indépendant. Vous pouvez diriger les candidatures vers le bureau des RH et les messages de contact vers le secrétariat.
            </p>
            <div className="h-[1px] bg-border border-dashed" />
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Cryptage</span>
                <span className="text-green-500">AES-256</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span>Accès</span>
                <span className="text-muted-foreground">SUPER_ADMIN</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
