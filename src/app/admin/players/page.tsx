"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, ArrowLeft, Trash2, User } from "lucide-react";
import Link from "next/link";

interface Player {
  id: string;
  name: string;
  nickname: string;
  preferred_color: string;
  total_matches: number;
  total_wins: number;
}

const COLORS = [
  'Blue', 'Red', 'Green', 'Yellow', 
  'Cyan', 'Purple', 'Gray', 'Orange'
];

export default function PlayersAdminPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [preferredColor, setPreferredColor] = useState("Blue");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    const { data } = await supabase.from("players").select("*").order("name");
    if (data) setPlayers(data);
  }

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("players").insert([{ 
      name, 
      nickname,
      preferred_color: preferredColor
    }]);
    if (!error) {
      setName("");
      setNickname("");
      setPreferredColor("Blue");
      fetchPlayers();
    }
    setLoading(false);
  }

  async function deletePlayer(id: string) {
    if (confirm("¿Seguro que quieres borrar a este jugador?")) {
      await supabase.from("players").delete().eq("id", id);
      fetchPlayers();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 glass rounded-full hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-black font-outfit uppercase">Jugadores</h1>
      </div>

      <form onSubmit={addPlayer} className="glass-card space-y-4">
        <h3 className="flex items-center gap-2 font-bold text-primary">
          <UserPlus size={18} /> Registrar Jugador
        </h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Nombre Completo</label>
            <input
              className="input-field w-full text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Martin"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Apodo / Nickname</label>
            <input
              className="input-field w-full text-sm"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ej: El Conquistador"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Color Favorito</label>
            <select
              className="input-field w-full text-sm"
              value={preferredColor}
              onChange={(e) => setPreferredColor(e.target.value)}
            >
              {COLORS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full text-sm py-3">
          {loading ? "Registrando..." : "Agregar Jugador"}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Lista de Jugadores ({players.length})</h3>
        {players.length === 0 ? (
          <div className="text-center py-10 glass rounded-2xl opacity-50 text-sm">No hay jugadores registrados todavía.</div>
        ) : (
          players.map((p) => (
            <div key={p.id} className="glass-card py-4 flex items-center justify-between group">
              <Link href={`/players/${p.id}`} className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity">
                <div 
                  className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-primary font-bold border-2 border-primary/20"
                  style={{ borderColor: p.preferred_color }}
                >
                  <User size={20} />
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {p.name}
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.preferred_color }} />
                  </div>
                  <div className="text-xs text-muted-foreground">{p.nickname || "Sin apodo"}</div>
                </div>
              </Link>
              <button 
                onClick={() => deletePlayer(p.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
