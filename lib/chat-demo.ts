import type { Localized } from "./i18n";

export type ChatLine = {
  user: string;
  color: string;
  badge?: "mod" | "vip" | "bot";
  text: string | Localized;
};

/** Scripted example chat shown in the hero. Users and replies are illustrative. */
export const chatDemo: ChatLine[] = [
  { user: "capivara_gamer", color: "#ff7ab8", text: "!sr rick astley never gonna give you up" },
  {
    user: "StreamElements",
    color: "#a970ff",
    badge: "bot",
    text: {
      pt: "@capivara_gamer adicionou Never Gonna Give You Up na fila (#3)",
      en: "@capivara_gamer added Never Gonna Give You Up to the queue (#3)",
    },
  },
  { user: "ninja_do_lag", color: "#4ade80", text: "!pokecatch ultraball" },
  { user: "bruxa_do_71", color: "#38bdf8", badge: "vip", text: "!hug capivara_gamer" },
  {
    user: "tio_pedrao",
    color: "#facc15",
    text: { pt: "!8ball vai ter live amanhã?", en: "!8ball stream tomorrow?" },
  },
  {
    user: "StreamElements",
    color: "#a970ff",
    badge: "bot",
    text: { pt: "🎱 Com certeza.", en: "🎱 It is certain." },
  },
  { user: "mod_zeca", color: "#fb923c", badge: "mod", text: "!code 4KZMAK" },
  { user: "lurker_supremo", color: "#c084fc", text: "!lurk" },
  { user: "ninja_do_lag", color: "#4ade80", text: "!explode bruxa_do_71" },
  { user: "capivara_gamer", color: "#ff7ab8", text: "!sueli duas" },
  { user: "tio_pedrao", color: "#facc15", text: "!vol 21" },
  { user: "bruxa_do_71", color: "#38bdf8", badge: "vip", text: "!mass fart" },
];
