"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas. Solo para el Admin.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[70vh]">
      <div className="text-center space-y-2">
        <div className="bg-primary/20 p-4 rounded-full w-fit mx-auto mb-4 border border-primary/30">
          <ShieldCheck className="text-primary" size={32} />
        </div>
        <h1 className="text-3xl font-black font-outfit">LOGIN ADMIN</h1>
      </div>

      <form onSubmit={handleLogin} className="glass-card w-full max-w-sm space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-xl border border-destructive/20 text-center font-bold">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full"
            placeholder="admin@imperio.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
