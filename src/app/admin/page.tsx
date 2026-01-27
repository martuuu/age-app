import Link from "next/link";
import { Users, Sword, BarChart3, Settings, PlusCircle } from "lucide-react";

const ADMIN_LINKS = [
  {
    title: "Cargar Partida",
    desc: "Registra un nuevo encuentro",
    href: "/admin/matches/new",
    icon: Sword,
    color: "text-primary",
    bg: "bg-primary/20",
  },
  {
    title: "Jugadores",
    desc: "Gestionar lista de guerreros",
    href: "/admin/players",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/20",
  },
  {
    title: "Estadísticas",
    desc: "Ver rendimiento grupal",
    href: "/ranking",
    icon: BarChart3,
    color: "text-emerald-400",
    bg: "bg-emerald-400/20",
  },
  {
    title: "Configuración",
    desc: "Ajustes de la aplicación",
    href: "#",
    icon: Settings,
    color: "text-slate-400",
    bg: "bg-slate-400/20",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter">Panel <span className="text-primary italic">Admin</span></h1>
        <p className="text-muted-foreground text-sm">Control central del Imperio.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {ADMIN_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.title}
              href={link.href}
              className="glass-card flex items-center gap-4 group"
            >
              <div className={`${link.bg} p-3 rounded-2xl ${link.color} transition-transform group-hover:scale-110`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </div>
              <PlusCircle className="text-muted-foreground/30 group-hover:text-primary transition-colors" size={20} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
