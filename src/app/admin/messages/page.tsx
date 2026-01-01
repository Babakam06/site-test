"use client";

import React, { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Mail, 
  User, 
  Clock, 
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Search,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Erreur lors du chargement des messages");
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Message supprimé");
      fetchMessages();
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.nom?.toLowerCase().includes(search.toLowerCase()) ||
    msg.prenom?.toLowerCase().includes(search.toLowerCase()) ||
    msg.email?.toLowerCase().includes(search.toLowerCase()) ||
    msg.sujet?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">MESSAGES <span className="text-primary italic">DE CONTACT</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Tous les messages reçus via le formulaire de contact</p>
        </div>
        <Button 
          variant="outline" 
          className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest gap-2"
          onClick={fetchMessages}
        >
          <RefreshCw className="h-4 w-4" /> Actualiser
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom, email ou sujet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 rounded-2xl bg-muted/50 border-0 pl-12 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-xl bg-primary/10 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-2xl">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-black">{messages.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total messages</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-xl bg-green-500/10 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-2xl">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-3xl font-black">{messages.filter(m => m.discord_sent).length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Envoyés sur Discord</p>
            </div>
          </div>
        </Card>
        <Card className="border-0 shadow-xl bg-orange-500/10 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/20 p-3 rounded-2xl">
              <XCircle className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-3xl font-black">{messages.filter(m => !m.discord_sent).length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Non envoyés</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-2xl bg-card/30 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 text-center">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-20 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-sm">Aucun message reçu</p>
            </div>
          ) : (
            <div className="divide-y divide-dashed">
              {filteredMessages.map((msg, i) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 flex items-start justify-between gap-6 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex gap-6 flex-1">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase shrink-0">
                      {msg.prenom?.charAt(0)}{msg.nom?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-black uppercase tracking-wider">{msg.prenom} {msg.nom}</h3>
                        <Badge className={cn(
                          "text-[9px] font-black uppercase",
                          msg.discord_sent ? "bg-green-500/10 text-green-500 border-0" : "bg-orange-500/10 text-orange-500 border-0"
                        )}>
                          {msg.discord_sent ? "Discord ✓" : "Non envoyé"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mb-2">{msg.email}</p>
                      <p className="text-sm font-bold text-primary mb-2">{msg.sujet}</p>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-2">{msg.message}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-3 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(msg.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl rounded-[2.5rem] border-0 bg-card">
                        <DialogHeader className="p-8 border-b border-dashed">
                          <DialogTitle className="text-2xl font-black tracking-tighter uppercase">Message de {msg.prenom} {msg.nom}</DialogTitle>
                        </DialogHeader>
                        <div className="p-8 space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Email</p>
                              <p className="font-mono text-sm">{msg.email}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Date</p>
                              <p className="text-sm font-bold">{new Date(msg.created_at).toLocaleString('fr-FR')}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Sujet</p>
                            <p className="font-bold text-primary">{msg.sujet}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Message</p>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-6 rounded-2xl">{msg.message}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl text-red-500"
                      onClick={() => handleDelete(msg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
