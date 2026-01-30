"use client";

import { useState } from "react";
import { Book, Search, Shield, Sword, Zap, Anchor, Target, Flame, X, ChevronRight } from "lucide-react";
import { CIVILIZATIONS, Civilization } from "@/data/civilizations";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_ICONS: Record<string, any> = {
  "Infantería": Shield,
  "Caballería": Sword,
  "Arqueros": Target,
  "Naval": Anchor,
  "Defensiva": Shield,
  "Pólvora": Flame,
};

export default function WikiPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCiv, setSelectedCiv] = useState<Civilization | null>(null);

  const filteredCivs = CIVILIZATIONS.filter(civ => {
    const matchesSearch = civ.name.toLowerCase().includes(search.toLowerCase()) || 
                         civ.unique_unit.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || civ.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(CIVILIZATIONS.map(c => c.category)));

  return (
    <div className="space-y-8 pb-32">
      <header>
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter">Wiki <span className="text-primary italic">CIVS</span></h1>
        <p className="text-muted-foreground text-sm">Biblioteca imperial de Age of Empires 2.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          className="input-field w-full pl-12 h-12" 
          placeholder="Buscar civilización o unidad..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-bold uppercase tracking-wider transition-all",
            !selectedCategory ? "bg-primary text-black" : "glass text-muted-foreground"
          )}
        >
          Todos
        </button>
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Zap;
          return (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all",
                selectedCategory === cat ? "bg-primary text-black" : "glass text-muted-foreground"
              )}
            >
              <Icon size={12} /> {cat}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredCivs.map((civ) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={civ.id} 
              onClick={() => setSelectedCiv(civ)}
              className="glass-card aspect-square flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary/50 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-[10px] text-muted-foreground/30 font-black">
                {civ.category.toUpperCase()}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                {civ.icon}
              </div>
              <div className="font-bold text-center px-2">{civ.name}</div>
              <div className="text-[9px] text-primary font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Ver Detalles</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCivs.length === 0 && (
        <div className="text-center py-20 opacity-50 space-y-2">
          <Book className="mx-auto text-primary/30" size={40} />
          <p className="text-sm italic">No se encontraron crónicas de esta civilización.</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCiv && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCiv(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="glass-card w-full max-w-md relative z-10 p-8 border-t-2 border-primary/50 bg-background/90"
            >
              <button 
                onClick={() => setSelectedCiv(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-5xl shadow-2xl border border-primary/20">
                  {selectedCiv.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-black font-outfit uppercase">{selectedCiv.name}</h2>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest">{selectedCiv.category}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Sword size={12} className="text-primary" /> Unidad Única
                  </h3>
                  <div className="glass p-4 rounded-xl font-bold text-lg border-white/5">
                    {selectedCiv.unique_unit}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    <Shield size={12} className="text-primary" /> Bonificaciones
                  </h3>
                  <ul className="space-y-3">
                    {selectedCiv.bonuses.map((bonus, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                        <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                        {bonus}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCiv(null)}
                className="btn-primary w-full mt-8 py-4 uppercase tracking-[0.2em] text-xs"
              >
                Cerrar Crónica
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
