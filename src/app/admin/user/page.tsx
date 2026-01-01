"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  CheckCircle2, 
  XCircle,
  Mail,
  Filter,
  ShieldAlert,
  ShieldCheck,
  UserCog
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
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Échec de la récupération des utilisateurs");
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 uppercase text-[10px] font-black">Super Admin</Badge>;
      case "ADMIN": return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 uppercase text-[10px] font-black">Admin</Badge>;
      case "STAFF": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 uppercase text-[10px] font-black">Staff</Badge>;
      default: return <Badge variant="outline" className="px-3 uppercase text-[10px] font-black">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive && status === "PENDING") {
      return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 uppercase text-[10px] font-black">En Attente</Badge>;
    }
    if (isActive) {
      return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 uppercase text-[10px] font-black">Actif</Badge>;
    }
    return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 uppercase text-[10px] font-black">Désactivé</Badge>;
  };

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    
    if (error) {
      toast.error("Erreur lors de la mise à jour du rôle");
    } else {
      toast.success("Rôle mis à jour");
      fetchUsers();
    }
  };

  const approveUser = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: true, status: "ACTIVE" })
      .eq("id", userId);
    
    if (error) {
      toast.error("Erreur lors de l'approbation");
    } else {
      toast.success("Utilisateur approuvé avec succès");
      fetchUsers();
    }
  };

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !currentStatus, status: !currentStatus ? "ACTIVE" : "INACTIVE" })
        .eq("id", userId);
      
      if (error) {
        toast.error("Erreur lors de la mise à jour du statut");
      } else {
        toast.success(currentStatus ? "Utilisateur désactivé" : "Utilisateur activé");
        fetchUsers();
      }
    };

    const deleteUser = async (userId: string) => {
      if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return;
      
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      
      if (error) {
        toast.error("Erreur lors de la suppression");
      } else {
        toast.success("Utilisateur supprimé");
        fetchUsers();
      }
    };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">GESTION <span className="text-primary italic">DES UTILISATEURS</span></h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Gérer les accès et les permissions du personnel</p>
        </div>
        <div className="flex items-center gap-3 bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
          <ShieldAlert className="h-5 w-5 text-orange-500" />
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest leading-relaxed">
            {users.filter(u => !u.is_active && u.status === "PENDING").length} utilisateur(s) en attente de validation
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-2xl bg-card/30 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="p-8 border-b border-dashed flex flex-col md:flex-row gap-6 items-center bg-card/50">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un membre du personnel..." 
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
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Membre</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rôle</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Statut</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Inscrit le</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed">
                {filteredUsers.map((user, i) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "hover:bg-primary/5 transition-colors",
                      !user.is_active && user.status === "PENDING" && "bg-orange-500/5"
                    )}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                          {user.email?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-black uppercase tracking-wider">{user.email}</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">{user.full_name || "Sans nom"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">{getRoleBadge(user.role)}</td>
                    <td className="px-8 py-6">{getStatusBadge(user.status, user.is_active)}</td>
                    <td className="px-8 py-6 text-xs font-bold text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!user.is_active && user.status === "PENDING" && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] px-4 rounded-xl shadow-lg shadow-emerald-500/20"
                            onClick={() => approveUser(user.id)}
                          >
                            Approuver
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl p-2 border-0 shadow-2xl bg-card w-56">
                            <DropdownMenuItem 
                              onClick={() => updateRole(user.id, "STAFF")}
                              className="rounded-xl font-bold uppercase tracking-widest text-[10px] p-3 gap-3"
                            >
                              <Shield className="h-4 w-4" /> Passer en STAFF
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateRole(user.id, "ADMIN")}
                              className="rounded-xl font-bold uppercase tracking-widest text-[10px] p-3 gap-3"
                            >
                              <ShieldCheck className="h-4 w-4" /> Passer en ADMIN
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateRole(user.id, "SUPER_ADMIN")}
                              className="rounded-xl font-bold uppercase tracking-widest text-[10px] p-3 gap-3"
                            >
                              <ShieldAlert className="h-4 w-4" /> Passer en SUPER ADMIN
                            </DropdownMenuItem>
                            <div className="h-px bg-muted my-2 mx-2" />
                            <DropdownMenuItem 
                              onClick={() => toggleStatus(user.id, user.is_active)}
                              className={cn(
                                "rounded-xl font-bold uppercase tracking-widest text-[10px] p-3 gap-3",
                                user.is_active ? "text-orange-500" : "text-green-500"
                              )}
                            >
                                <UserCog className="h-4 w-4" /> {user.is_active ? "Désactiver le compte" : "Réactiver le compte"}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteUser(user.id)}
                                className="rounded-xl font-bold uppercase tracking-widest text-[10px] p-3 gap-3 text-red-500 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" /> Supprimer définitivement
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
