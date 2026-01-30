"use client";

import Link from "next/link";
import { History, PlusCircle, Trophy, Users, Book } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Historial", icon: History, href: "/" },
  { label: "Jugadores", icon: Users, href: "/players" },
  { label: "Ranking", icon: Trophy, href: "/ranking" },
  { label: "Wiki", icon: Book, href: "/wiki" },
  { label: "Admin", icon: PlusCircle, href: "/admin" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50">
      <div className="glass rounded-[2rem] px-6 py-4 flex items-center justify-between border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-background/40 backdrop-blur-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-500 relative",
                isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_10px_#eab308]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
