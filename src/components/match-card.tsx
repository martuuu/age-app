import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Participant {
  team: number;
  civilization: string;
  player_color: string;
  is_winner: boolean;
  player: {
    id: string;
    name: string;
    nickname?: string;
    avatar_url?: string;
  };
}

interface MatchCardProps {
  match: {
    id: string;
    played_at: string;
    map_name: string;
    winner_team: number;
    game_mode: string;
    duration_minutes?: number;
    participants: Participant[];
  };
}

export function MatchCard({ match }: MatchCardProps) {
  const team1 = match.participants.filter((p) => p.team === 1);
  const team2 = match.participants.filter((p) => p.team === 2);

  return (
    <div className="glass-card mb-4 animate-fade-in-up group hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold font-outfit text-primary flex items-center gap-2">
              {match.map_name}
            </h3>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground uppercase">{match.game_mode}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Calendar size={12} />
            {format(new Date(match.played_at), "d 'de' MMMM, yyyy", { locale: es })}
            {match.duration_minutes && (
              <>
                <span>•</span>
                <span>{match.duration_minutes} min</span>
              </>
            )}
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold border",
          match.winner_team === 1 ? "bg-primary/10 text-primary border-primary/20" : "bg-blue-400/10 text-blue-400 border-blue-400/20" 
        )}>
          Equipo {match.winner_team} Gana
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/10 font-black text-4xl italic select-none">
          VS
        </div>

        {/* Team 1 */}
        <div className={cn(
          "space-y-3 transition-opacity",
          match.winner_team === 1 ? "opacity-100" : "opacity-60"
        )}>
          {team1.map((p, i) => (
            <PlayerRow key={i} participant={p} align="left" />
          ))}
        </div>

        {/* Team 2 */}
        <div className={cn(
          "space-y-3 transition-opacity",
          match.winner_team === 2 ? "opacity-100" : "opacity-60"
        )}>
          {team2.map((p, i) => (
            <PlayerRow key={i} participant={p} align="right" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerRow({ participant, align }: { participant: Participant, align: "left" | "right" }) {
  const content = (
    <>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border overflow-hidden shrink-0",
        `border-${participant.player_color.toLowerCase()}-500/50`
      )}
      style={{ borderColor: participant.player_color }}
      >
        {participant.player.avatar_url ? (
          <img src={participant.player.avatar_url} alt={participant.player.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            {participant.player.name[0]}
          </div>
        )}
      </div>
      <div className={cn("flex flex-col", align === "right" && "items-end")}>
        <span className="text-sm font-bold flex items-center gap-2">
          {participant.player.nickname || participant.player.name}
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: participant.player_color }}
          />
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{participant.civilization}</span>
      </div>
    </>
  );

  return (
    <Link 
      href={`/players/${participant.player.id}`}
      className={cn(
        "flex items-center gap-3 hover:opacity-80 transition-opacity",
        align === "right" ? "flex-row-reverse text-right" : "flex-row"
      )}
    >
      {content}
    </Link>
  );
}
