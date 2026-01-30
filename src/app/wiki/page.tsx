"use client";

import { Construction, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WikiPage() {
  return (
    <div className="space-y-8 pb-32 min-h-[70vh] flex flex-col">
      <header>
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter">Wiki <span className="text-primary italic">CIVS</span></h1>
        <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest mt-2">En desarrollo</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 0.8,
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
          <div className="glass-card p-12 rounded-[3.5rem] border-primary/20 bg-black/40 relative z-10">
            <Construction size={80} className="text-primary animate-pulse" />
          </div>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30"
          >
            <Loader2 className="text-yellow-500 animate-spin" size={20} />
          </motion.div>
        </motion.div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter text-white">Biblioteca en Refacción</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Nuestros monjes están transcribiendo las antiguas crónicas imperiales. Vuelve pronto para conocerlo todo sobre las civilizaciones.
          </p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>

      {/* 
      Comentado por solicitud del usuario
      
      const filteredCivs = CIVILIZATIONS.filter(civ => { ... });
      ... grid grid-cols-2 ...
      */}
    </div>
  );
}
