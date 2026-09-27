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

/** Neon accent per category, exposed to CSS as --accent. */
export const categoryAccent: Record<CategoryIcon, string> = {
  sparkles: "#a970ff",
  music: "#ff4fa3",
  mic: "#38bdf8",
  eye: "#facc15",
  fish: "#2dd4bf",
  users: "#4ade80",
  gamepad: "#fb7185",
};

export function accentStyle(icon: CategoryIcon) {
  return { "--accent": categoryAccent[icon] } as React.CSSProperties;
}

export function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

/** Twitch-style moderator sword badge. */
export function ModBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden className={className}>
      <rect width="18" height="18" rx="2" fill="#00ad03" />
      <path
        fill="#fff"
        d="M13.5 3.5 8.2 8.8l1 1 5.3-5.3v-1zM5.3 10.4l1.4-1.4 2.3 2.3-1.4 1.4-.7-.7-1.8 1.8-.7-.7 1.8-1.8z"
      />
    </svg>
  );
}
