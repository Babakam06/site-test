"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [settings, setSettings] = useState({
    mayor_phone: "555-0100",
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
          // @ts-ignore
          newSettings[s.key] = s.value;
        });
        setSettings(newSettings);
      }
    };
    fetchSettings();
  }, []);

  const infoItems = [
    {
      icon: MapPin,
      title: "Adresse",
      content: settings.mayor_address,
      subContent: "Accessible PMR",
    },
    {
      icon: Clock,
      title: "Horaires d'ouverture",
      content: "Lun - Ven : 08h30 - 17h30",
      subContent: "Samedi : 09h00 - 12h00",
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: settings.mayor_phone,
      subContent: "Appel non surtaxé",
    },
    {
      icon: Mail,
      title: "Email",
      content: settings.mayor_email,
      subContent: "Réponse sous 48h",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const contactData = {
      prenom: formData.get("firstname") as string,
      nom: formData.get("lastname") as string,
      email: formData.get("email") as string,
      sujet: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      // 1. Récupérer l'URL du webhook Discord depuis les paramètres
      const { data: settings } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "discord_webhook_contact")
        .single();

      let discordSent = false;

      // 2. Si webhook configuré, envoyer à Discord
      if (settings?.value) {
        try {
          const webhookResponse = await fetch("/api/webhook/discord", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "contact",
              data: contactData,
              webhookUrl: settings.value,
            }),
          });
          discordSent = webhookResponse.ok;
        } catch (err) {
          console.error("Erreur webhook Discord:", err);
        }
      }

      // 3. Sauvegarder le message en base de données
      const { error: dbError } = await supabase
        .from("contact_messages")
        .insert([{
          prenom: contactData.prenom,
          nom: contactData.nom,
          email: contactData.email,
          sujet: contactData.sujet,
          message: contactData.message,
          discord_sent: discordSent,
        }]);

      if (dbError) {
        console.error("Erreur sauvegarde message:", dbError);
      }

      setIsSuccess(true);
      toast.success("Message envoyé !", {
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'envoi", {
        description: "Veuillez réessayer plus tard.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <section className="bg-primary py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <MessageSquare className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Contact</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">NOUS <span className="italic opacity-80 text-black">CONTACTER</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium max-w-2xl leading-relaxed">
              Nos services sont à votre disposition pour toute demande d'information ou démarche administrative.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {infoItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-0 bg-muted/30 shadow-xl rounded-3xl">
                      <CardContent className="p-8">
                        <div className="bg-primary/10 p-3 rounded-2xl w-fit mb-6">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 font-black uppercase tracking-tight">{item.title}</h3>
                        <p className="text-sm font-bold">{item.content}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-1">{item.subContent}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-video overflow-hidden rounded-[2.5rem] bg-muted shadow-2xl border"
              >
                <img 
                  src="https://www.bragitoff.com/wp-content/uploads/2015/11/GTAV-HD-MAP-satellite.jpg" 
                  alt="Carte de Blaine County"
                  className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-2">
                      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                      <MapPin className="relative h-12 w-12 text-primary fill-primary/10" />
                    </div>
                    <Badge className="bg-white text-primary shadow-lg border-0 font-black uppercase tracking-widest">Mairie Centrale</Badge>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border-0 shadow-2xl rounded-[2.5rem]">
                <CardContent className="p-10 md:p-14">
                  {isSuccess ? (
                    <div className="text-center py-16">
                      <div className="bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                      </div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Message Envoyé !</h2>
                      <p className="text-muted-foreground font-medium">
                        Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                      </p>
                      <Button 
                        className="mt-8 rounded-full h-14 px-10 font-black uppercase tracking-widest"
                        onClick={() => setIsSuccess(false)}
                      >
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-10">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Envoyez-nous un message</h2>
                        <p className="text-sm text-muted-foreground font-medium">
                          Pour toute demande urgente, privilégiez le contact téléphonique.
                        </p>
                      </div>

                      <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-3">
                            <Label htmlFor="firstname" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Prénom *</Label>
                            <Input id="firstname" name="firstname" required placeholder="Ex: Jean" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="lastname" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nom *</Label>
                            <Input id="lastname" name="lastname" required placeholder="Ex: Dupont" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email *</Label>
                          <Input id="email" name="email" type="email" required placeholder="jean.dupont@exemple.com" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Sujet *</Label>
                          <Input id="subject" name="subject" required placeholder="L'objet de votre demande" className="h-14 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Message *</Label>
                          <Textarea id="message" name="message" required placeholder="Détaillez votre demande ici..." className="min-h-[180px] rounded-3xl bg-muted/50 border-0 focus-visible:ring-primary font-medium p-6 resize-none" />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>Envoyer le formulaire <Send className="ml-3 h-5 w-5" /></>
                          )}
                        </Button>
                        <p className="text-center text-[10px] text-muted-foreground font-medium">
                          En soumettant ce formulaire, vous acceptez que les données saisies soient utilisées par les services de la mairie pour répondre à votre demande.
                        </p>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
