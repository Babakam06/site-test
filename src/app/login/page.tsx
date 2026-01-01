"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Landmark, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck,
  UserPlus,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });
        if (error) throw error;
        toast.success("Compte créé !", {
          description: "Veuillez vérifier vos e-mails pour confirmer votre inscription.",
        });
        setIsSignUp(false);
      } else {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Check profile status
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_active, status")
          .eq("id", user?.id)
          .single();

        if (profile && !profile.is_active) {
          await supabase.auth.signOut();
          toast.error("Accès restreint", {
            description: "Votre compte est en attente de validation par un administrateur.",
          });
          return;
        }

        toast.success("Connexion réussie", {
          description: "Accès au portail administratif en cours...",
        });
        router.push("/admin");
      }
    } catch (error: any) {
      toast.error("Erreur d'accès", {
        description: error.message || "Identifiants invalides ou erreur serveur.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg px-4 relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="bg-primary p-4 rounded-[2rem] shadow-2xl shadow-primary/20 mb-6">
            <Landmark className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
            PORTAIL <span className="text-primary italic">ADMIN</span>
          </h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Accès Officiel - Comté de Blaine</p>
        </div>

        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl rounded-[3rem] overflow-hidden">
          <CardContent className="p-10 md:p-16">
            <form onSubmit={handleAuth} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Adresse E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      required
                      type="email"
                        placeholder="email@mairie.bc"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-16 rounded-2xl bg-muted/50 border-0 pl-14 focus-visible:ring-primary font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Mot de passe</label>
                    {!isSignUp && (
                      <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Oublié ?</button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      required
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-16 rounded-2xl bg-muted/50 border-0 pl-14 focus-visible:ring-primary font-bold"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {isSignUp ? "Créer mon compte" : "Vérifier l'identité"} <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                {isSignUp ? (
                  <><LogIn className="h-3 w-3" /> Déjà un compte ? Se connecter</>
                ) : (
                  <><UserPlus className="h-3 w-3" /> Pas encore de compte ? S'inscrire</>
                )}
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-dashed">
              <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">
                  Ce système est réservé à un usage autorisé. Toutes les activités sont enregistrées et surveillées.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <Button variant="link" className="text-muted-foreground text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors" asChild>
            <a href="/">← Retour au Site Public</a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
