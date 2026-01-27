import { Book, Search, Shield, Sword, Zap } from "lucide-react";

const CIV_CATEGORIES = [
  { name: "Infantería", icon: Shield },
  { name: "Caballería", icon: Sword },
  { name: "Arqueros", icon: Zap },
];

export default function WikiPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter">Wiki <span className="text-primary italic">CIVS</span></h1>
        <p className="text-muted-foreground text-sm">Estrategias, bonus y contras.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          className="input-field w-full pl-12 h-12" 
          placeholder="Buscar civilización..." 
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CIV_CATEGORIES.map((cat) => (
          <button key={cat.name} className="glass px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <cat.icon size={14} /> {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {["Francos", "Britanos", "Mayas", "Hunos"].map((civ) => (
          <div key={civ} className="glass-card aspect-square flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-primary/50">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏰
            </div>
            <div className="font-bold">{civ}</div>
            <div className="text-[10px] text-primary font-bold uppercase tracking-tighter">Ver Detalles</div>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-3xl text-center space-y-2">
        <Book className="mx-auto text-primary/30 mb-2" size={32} />
        <p className="text-xs text-muted-foreground italic">
          "El conocimiento es la mejor arma en el campo de batalla."
        </p>
      </div>
    </div>
  );
}
