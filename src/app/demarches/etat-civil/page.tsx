"use client";

import React, { useState, useRef, useEffect } from "react";
import { Users2, Heart, Calendar, Skull, Loader2, Download, ArrowLeft, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LOGO_URL = "https://i.goopics.net/f7gdic.png";

export default function VitalRecordsPage() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [certData, setCertData] = useState<any>(null);
  const [base64Logo, setBase64Logo] = useState<string>("");
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        const response = await fetch(LOGO_URL);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setBase64Logo(reader.result as string);
        reader.readAsDataURL(blob);
      } catch (err) {
        setBase64Logo(LOGO_URL);
      }
    };
    convertImageToBase64();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    setTimeout(() => {
      setCertData({ type, ...data, ref: `BC-${Math.floor(100000 + Math.random() * 900000)}` });
      setOpen(null);
      setLoading(false);
    }, 800);
  };

  // FONCTION DE TÉLÉCHARGEMENT CORRIGÉE
  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    const loadingToast = toast.loading("Génération du PDF...");

    try {
      // On attend un peu que le DOM soit prêt
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ACTE_${certData.type}_${certData.ref}.pdf`);
      
      toast.dismiss(loadingToast);
      toast.success("Enregistré !");
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error("Erreur de rendu. Réessayez.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {!certData ? (
        <>
          <section className="bg-muted/50 py-24 px-4 relative overflow-hidden">
            <div className="container mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-8 border border-primary/20">
                    <Users2 className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Bureau du Greffier</span>
                </div>
                <h1 className="text-6xl font-black tracking-tighter uppercase md:text-8xl">
                    ÉTAT <span className="text-primary italic">CIVIL</span>
                </h1>
                <p className="text-xl mt-6 text-muted-foreground max-w-2xl font-medium">
                    Enregistrement officiel et délivrance des actes authentiques de la vie à Blaine County.
                </p>
            </div>
          </section>

          <section className="py-20 container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: "NAISSANCE", title: "Acte de Naissance", icon: Heart, desc: "Déclaration et copie certifiée d'acte de naissance conforme aux registres." },
              { id: "MARIAGE", title: "Acte de Mariage", icon: Calendar, desc: "Extrait de mariage célébré devant l'officier d'état civil du comté." },
              { id: "DECES", title: "Acte de Décès", icon: Skull, desc: "Certificat officiel de décès et transcription sur les registres civils." }
            ].map((item) => (
              <Dialog key={item.id} open={open === item.id} onOpenChange={(v) => setOpen(v ? item.id : null)}>
                <DialogTrigger asChild>
                  <Card className="p-10 rounded-[2.5rem] border-0 shadow-2xl cursor-pointer hover:scale-[1.02] transition-all bg-card">
                      <div className="mb-8 p-4 rounded-2xl bg-primary/10 w-fit text-primary">
                          <item.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-black uppercase mb-4 tracking-tighter">{item.title}</h3>
                      <p className="text-muted-foreground font-medium mb-8 leading-relaxed">{item.desc}</p>
                      <Button className="w-full h-14 rounded-2xl font-black uppercase">DÉMARRER LA SAISIE</Button>
                  </Card>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] bg-background border-0">
                  <DialogHeader><DialogTitle className="text-2xl font-black uppercase">Saisie Administrative</DialogTitle></DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e, item.id)} className="space-y-4 mt-6">
                    <Input name="prenom" placeholder="Prénoms" required className="bg-muted border-0" />
                    <Input name="nom" placeholder="Nom de famille" required className="bg-muted border-0" />
                    <Input name="date" type="date" required className="bg-muted border-0" />
                    <Input name="lieu" placeholder="Lieu" required className="bg-muted border-0" />
                    <Button className="w-full h-14 rounded-xl font-black uppercase">Générer le document</Button>
                  </form>
                </DialogContent>
              </Dialog>
            ))}
          </section>
        </>
      ) : (
        <div className="flex flex-col items-center py-10 bg-muted/30 min-h-screen">
          <div className="mb-8 flex gap-4">
            <Button onClick={() => setCertData(null)} variant="outline" className="rounded-xl font-black uppercase">
              <ArrowLeft className="mr-2 h-4" /> Retour
            </Button>
            
            {/* BOUTON ASSOMBRI EN MODE SOMBRE */}
            <Button 
                onClick={downloadPDF} 
                disabled={downloading} 
                className="rounded-xl font-black uppercase bg-zinc-900 dark:bg-black hover:bg-zinc-800 dark:hover:bg-zinc-950 text-white shadow-xl"
            >
              {downloading ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2 h-4" />}
              Télécharger le document
            </Button>
          </div>

          <div ref={certificateRef} className="bg-white text-black p-[25mm] shadow-2xl flex flex-col mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
            <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8">
              <div className="text-center w-1/3 text-[10px] font-bold uppercase">
                <p>République de San Andreas</p>
                <p>Comté de Blaine County</p>
                <div className="h-px w-8 bg-black mx-auto my-2" />
                <p className="text-[8px] tracking-widest opacity-50">État Civil</p>
              </div>
              <div className="w-1/3 flex justify-center">
                <img src={base64Logo || LOGO_URL} alt="Logo" className="w-32 h-32 object-contain" />
              </div>
              <div className="text-right w-1/3 text-[10px] font-bold">
                <p className="text-zinc-400 font-black">RÉFÉRENCE :</p>
                <p className="font-mono text-sm">{certData.ref}</p>
              </div>
            </div>

            <h1 className="text-center text-2xl font-black uppercase underline underline-offset-[12px] mb-20 italic tracking-tighter">
                Extrait d'acte de {certData.type.toLowerCase()}
            </h1>

            <div className="flex-1 text-[17px] leading-[2.5] space-y-12 px-10 text-justify font-serif italic text-zinc-900">
              <p>Il résulte des registres de l'état civil de Blaine County que le nommé <b>{certData.prenom} {certData.nom}</b> est officiellement reconnu en date du <b>{certData.date}</b> à <b>{certData.lieu}</b>. Le présent acte est certifié conforme.</p>
              <p className="pt-10">Fait le {new Date().toLocaleDateString('fr-FR')}.</p>
            </div>

            <div className="mt-auto pt-24 flex justify-between items-end px-10">
              <div className="text-center w-1/3"><p className="font-black uppercase underline text-[10px]">Le Déclarant</p></div>
              <div className="flex flex-col items-center opacity-30"><ShieldCheck className="h-16 w-16" /></div>
              <div className="text-center w-1/3">
                <p className="text-[10px] font-black uppercase underline tracking-tighter">L'Officier d'État Civil</p>
                <div className="h-20 w-24 bg-zinc-100 mx-auto mt-2 opacity-30 border-2 border-black border-dashed" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}