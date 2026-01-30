"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Trash2, Pencil, Users, Loader2, Plus, Sword, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Player

interface Player {
  id: string;
  name: string;
  nickname: string;
  steam_id: string;
  preferred_color: string;
  avatar_url?: string;
  total_matches: number;
  total_wins: number;
  elo_rating: number;
}

export default function PlayersAdminPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [steamId, setSteamId] = useState("");
  const [color, setColor] = useState("Blue");

  const supabase = createClient();

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    setLoading(true);
    const { data } = await supabase
      .from("players")
      .select("*")
      .order("name");
    if (data) setPlayers(data);
    setLoading(false);
  }

  const resetForm = () => {
    setName("");
    setNickname("");
    setSteamId("");
    setColor("Blue");
    setEditingPlayer(null);
    setIsAdding(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name ) return alert("El nombre es requerido");

    const playerData = {
      name,
      nickname,
      steam_id: steamId,
      preferred_color: color
    };

    if (editingPlayer) {
      const { error } = await supabase.from("players").update(playerData).eq("id", editingPlayer.id);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from("players").insert([playerData]);
      if (error) alert(error.message);
    }

    resetForm();
    fetchPlayers();
  }

  async function deletePlayer(id: string) {
    if (confirm("¿Borrar jugador? Se perderán sus estadísticas y partidas asociadas.")) {
      const { error } = await supabase.from("players").delete().eq("id", id);
      if (error) alert(error.message);
      else fetchPlayers();
    }
  }

  const startEdit = (p: Player) => {
    setEditingPlayer(p);
    setName(p.name);
    setNickname(p.nickname || "");
    setSteamId(p.steam_id || "");
    setColor(p.preferred_color || "Blue");
    setIsAdding(true);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 glass rounded-full hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter">Gestión <span className="text-primary italic">Guerreros</span></h1>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg",
            isAdding ? "bg-destructive text-white rotate-45" : "bg-primary text-black"
          )}
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 animate-in slide-in-from-top duration-300">
          <h3 className="font-black font-outfit uppercase tracking-widest text-primary text-sm">
            {editingPlayer ? "Reforjar Guerrero" : "Nuevo Recluta"}
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Nombre Real</label>
              <input 
                className="input-field w-full h-12" 
                value={name} onChange={e => setName(e.target.value)} 
                placeholder="Ej: Martin Navarro"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Steam Nickname</label>
              <input 
                className="input-field w-full h-12" 
                value={nickname} onChange={e => setNickname(e.target.value)}
                placeholder="Ej: Martuuu89"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Steam ID (opcional)</label>
              <input 
                className="input-field w-full h-12" 
                value={steamId} onChange={e => setSteamId(e.target.value)}
                placeholder="ID Numérico o Profile URL"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Color Favorito</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Blue', 'Red', 'Green', 'Yellow', 'Cyan', 'Purple', 'Gray', 'Orange'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      color === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 py-4 uppercase font-black tracking-widest text-xs h-14">
              {editingPlayer ? "Guardar Crónica" : "Registrar Guerrero"}
            </button>
            <button 
              type="button" 
              onClick={resetForm}
              className="glass px-6 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <div className="text-[10px] font-black uppercase tracking-widest">Llamando a las Tropas...</div>
        </div>
      ) : players.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-4">
          <Users size={40} className="mx-auto text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Sin guerreros en el cuartel.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{players.length} GUERREROS REGISTRADOS</p>
          {players.map((p) => (
            <div 
              key={p.id} 
              className="glass-card p-4 flex items-center justify-between group hover:border-white/10 transition-all border-white/5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-black/40 border-2 overflow-hidden"
                  style={{ borderColor: p.preferred_color }}
                >
                  {p.avatar_url ? (
                    <Image 
                      src={p.avatar_url} 
                      alt={p.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span 
                      className="text-xl font-black"
                      style={{ color: p.preferred_color }}
                    >
                      {p.name[0]}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-black text-sm uppercase tracking-tight flex items-center gap-2 truncate">
                    {p.nickname || p.name}
                    {p.total_wins > 0 && p.total_wins === Math.max(...players.map(pl => pl.total_wins)) && (
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <div className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter mt-0.5">{p.name || "Sin nombre"}</div>
                  <div className="flex items-center gap-3 mt-1.5 overflow-x-auto no-scrollbar">
                    <div className="text-[9px] font-black text-primary/80 uppercase">Wins: {p.total_wins}</div>
                    <div className="text-[9px] font-black text-muted-foreground/60 uppercase">Elo: {p.elo_rating}</div>
                    <div className="text-[9px] font-black text-white/40 uppercase">
                      {p.total_matches > 0 ? Math.round((p.total_wins / p.total_matches) * 100) : 0}% WR
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <button
                  onClick={() => startEdit(p)}
                  className="p-2.5 glass rounded-xl text-muted-foreground hover:text-primary transition-all active:scale-90"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => deletePlayer(p.id)}
                  className="p-2.5 glass rounded-xl text-muted-foreground hover:text-destructive transition-all active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
