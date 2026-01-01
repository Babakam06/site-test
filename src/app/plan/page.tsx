"use client";

import React, { useState, useRef } from "react";
import { Map as MapIcon, ZoomIn, ZoomOut, Maximize, Landmark, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function CityMapPage() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="bg-primary py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }} />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <MapIcon className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-foreground">Cartographie du Comté</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase text-white md:text-8xl">PLAN DE <span className="italic opacity-80 text-black">LA VILLE</span></h1>
            <p className="text-xl text-primary-foreground/70 mt-8 font-medium max-w-2xl mx-auto leading-relaxed">
              Carte satellite officielle du comté de Blaine et de Los Santos en haute résolution 8K.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="flex-1 bg-muted/30 p-4 md:p-12">
        <div className="container mx-auto">
          <Card className="border-0 shadow-2xl bg-card rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-8 right-8 z-20 flex flex-col gap-2">
              <Button 
                size="icon" 
                className="rounded-xl bg-white/90 backdrop-blur-md text-black hover:bg-white shadow-xl"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                className="rounded-xl bg-white/90 backdrop-blur-md text-black hover:bg-white shadow-xl"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                className="rounded-xl bg-white/90 backdrop-blur-md text-black hover:bg-white shadow-xl"
                onClick={handleReset}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>

            <div className="absolute top-8 left-8 z-20">
              <Badge className="bg-white/90 backdrop-blur-md text-black border-0 font-black uppercase tracking-widest px-4 h-10 flex items-center gap-2 shadow-xl">
                <Move className="h-4 w-4" /> Cliquer-glisser pour naviguer
              </Badge>
            </div>
            
            <div 
              ref={containerRef}
              className="aspect-[16/9] w-full relative overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }}
                className="w-full h-full"
              >
                <img 
                  src="https://www.bragitoff.com/wp-content/uploads/2015/11/GTAV-HD-MAP-satellite.jpg" 
                  alt="Carte satellite 8K du Comté de Blaine - GTA V"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            </div>
            
            <div className="p-10 bg-card border-t border-dashed flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white">
                  <MapIcon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Carte Satellite Officielle</h3>
                  <p className="text-muted-foreground font-medium text-sm">Los Santos & Blaine County - San Andreas</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Badge className="bg-primary/10 text-primary border-0 font-black uppercase tracking-widest px-4 h-10 flex items-center">Haute Résolution 8K</Badge>
                <Badge className="bg-muted text-muted-foreground border-0 font-black uppercase tracking-widest px-4 h-10 flex items-center">Zoom: {Math.round(scale * 100)}%</Badge>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
