"use client";

import React from "react";
import { 
  Stethoscope, 
  Search, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  FileText,
  HeartPulse,
  Syringe
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const services = [
  {
    title: "Clinic Appointments",
    icon: Syringe,
    desc: "Schedule immunizations, physical exams, and general health check-ups at our community clinics.",
    action: "Book Appointment",
  },
  {
    title: "Food Safety Inspections",
    icon: ShieldCheck,
    desc: "View recent restaurant inspection reports and apply for food handler certifications.",
    action: "View Reports",
  },
  {
    title: "Health Permits",
    icon: FileText,
    desc: "Apply for permits related to swimming pools, septic systems, and other public health concerns.",
    action: "Start Application",
  },
];

export default function PublicHealthPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="bg-primary py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <Stethoscope className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Community Wellness</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">PUBLIC <span className="italic opacity-80 text-black">HEALTH</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium max-w-2xl leading-relaxed">
              Protecting and promoting the health and safety of every Blaine County resident.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-0 shadow-xl bg-card/50 backdrop-blur-sm rounded-[2.5rem] p-10 flex flex-col group">
                <div className="mb-8 p-4 rounded-2xl bg-primary/10 w-fit text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">{service.title}</h3>
                <p className="text-muted-foreground font-medium mb-8 flex-1">{service.desc}</p>
                <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                  {service.action}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
