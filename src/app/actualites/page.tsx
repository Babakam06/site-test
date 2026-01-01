"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Newspaper, 
  Search, 
  ChevronRight, 
  ArrowRight,
  Filter,
  Calendar,
  User,
  Share2,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });
    
    if (!error) setNews(data || []);
    setLoading(false);
  };

  const categories = ["Tout", ...Array.from(new Set(news.map(item => item.category)))];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                         item.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Tout" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <Newspaper className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Salle de Presse Officielle</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">SALLE DE <span className="italic opacity-80 text-black">PRESSE</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium leading-relaxed">
              Restez au courant des derniers développements, annonces et histoires de tout le comté de Blaine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher des articles..." 
                  className="pl-16 h-16 rounded-2xl bg-muted/50 border-0 focus-visible:ring-primary font-bold"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                  <Button 
                    key={cat} 
                    variant={selectedCategory === cat ? "default" : "outline"} 
                    className="rounded-full px-6 h-12 font-black uppercase tracking-widest text-[10px] shadow-sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* News Grid */}
      <section className="py-24 container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={item.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop"} 
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-white/95 text-black font-black uppercase tracking-widest px-4 py-2 border-0 shadow-lg">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-10 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(item.published_at || item.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="h-4 w-[1px] bg-border" />
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {item.author_name || "Comité de Presse"}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <h2 className="text-3xl font-black tracking-tighter uppercase mb-6 group-hover:text-primary transition-colors leading-none">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground font-medium leading-relaxed mb-10 line-clamp-3">
                        {item.content}
                      </p>
                      <div className="mt-auto">
                        <Button variant="link" className="p-0 h-auto font-black uppercase tracking-widest text-xs flex items-center group/btn" asChild>
                          <Link href={`/actualites/${item.id}`}>
                            Lire l'article complet <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-2 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredNews.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-muted-foreground font-medium">Aucun article trouvé.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

