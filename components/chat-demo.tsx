"use client";

import { Send, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { chatDemo, type ChatLine } from "@/lib/chat-demo";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ModBadge } from "./icons";

const VISIBLE = 7;

function Badge({ kind }: { kind: NonNullable<ChatLine["badge"]> }) {
  if (kind === "mod") return <ModBadge className="size-[18px] shrink-0" />;
  const style =
    kind === "vip"
      ? "bg-[#e005b9] text-white"
      : "bg-[#a970ff] text-white";
  return (
    <span
      className={`grid h-[18px] shrink-0 place-items-center rounded-[2px] px-1 font-mono text-[9px] leading-none font-bold ${style}`}
    >
      {kind === "vip" ? "VIP" : "BOT"}
    </span>
  );
}

function Message({ line, lang }: { line: ChatLine; lang: Locale }) {
  const text = typeof line.text === "string" ? line.text : line.text[lang];
  const [command, ...rest] = text.split(" ");
  const isCommand = command.startsWith("!");
  return (
    <p className="chat-in text-[0.85rem] leading-6 break-words text-white/85">
      {line.badge && (
        <span className="mr-1 inline-flex translate-y-[3px]">
          <Badge kind={line.badge} />
        </span>
      )}
      <span className="font-bold" style={{ color: line.color }}>
        {line.user}
      </span>
      <span className="text-white/50">: </span>
      {isCommand ? (
        <>
          <span className="rounded-[3px] bg-white/10 px-1 font-mono text-[0.8rem] text-white">
            {command}
          </span>{" "}
          {rest.join(" ")}
        </>
      ) : (
        text
      )}
    </p>
  );
}

/** A fake Twitch chat that scrolls through example commands. */
export function ChatDemo({ lang, t }: { lang: Locale; t: Dictionary }) {
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setCount((c) => c + 1), 2200);
    return () => clearInterval(timer);
  }, []);

  const lines = Array.from({ length: Math.min(count, VISIBLE) }, (_, i) => {
    const n = count - Math.min(count, VISIBLE) + i;
    return { key: n, line: chatDemo[n % chatDemo.length] };
  });

  return (
    <div className="brackets w-full" aria-hidden>
      <div className="hud cut">
        <div className="hud-inner cut flex h-[21rem] flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
            <span className="hud-label text-white/70">{t.chatTitle}</span>
            <span className="hud-label rounded-sm bg-white/[0.06] px-1.5 py-0.5 text-[0.6rem] text-white/40">
              {t.chatDemo}
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-1 overflow-hidden px-4 py-3 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
            {lines.map(({ key, line }) => (
              <Message key={key} line={line} lang={lang} />
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-white/[0.07] p-3">
            <div className="flex h-9 flex-1 items-center gap-2 rounded-md bg-white/[0.06] px-3 text-sm text-white/35 ring-1 ring-white/10">
              <span className="caret h-4 w-px bg-violet-400" />
              <span className="truncate">{t.chatInput}</span>
              <Smile className="ml-auto size-4 shrink-0" />
            </div>
            <span className="grid size-9 place-items-center rounded-md bg-twitch text-white">
              <Send className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
