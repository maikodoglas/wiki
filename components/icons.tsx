import {
  Eye,
  Fish,
  Gamepad2,
  Mic,
  Music,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIcon } from "@/lib/commands";

export const categoryIcons: Record<CategoryIcon, LucideIcon> = {
  sparkles: Sparkles,
  music: Music,
  mic: Mic,
  eye: Eye,
  fish: Fish,
  users: Users,
  gamepad: Gamepad2,
};

/** Accent per category: icon tile gradient + text color. */
export const categoryAccent: Record<CategoryIcon, string> = {
  sparkles: "from-violet-500/30 to-fuchsia-500/10 text-violet-300",
  music: "from-pink-500/30 to-rose-500/10 text-pink-300",
  mic: "from-sky-500/30 to-cyan-500/10 text-sky-300",
  eye: "from-amber-400/30 to-yellow-500/10 text-amber-300",
  fish: "from-cyan-400/30 to-teal-500/10 text-cyan-300",
  users: "from-emerald-400/30 to-green-500/10 text-emerald-300",
  gamepad: "from-red-500/30 to-orange-500/10 text-red-300",
};

export function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}
