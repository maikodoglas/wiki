"use client";

import { ChevronRight, Copy, ExternalLink, Link2 } from "lucide-react";
import { argLabels, type Arg, type Command } from "@/lib/commands";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Highlight } from "./highlight";
import { ModBadge } from "./icons";

type Props = {
  command: Command;
  lang: Locale;
  t: Dictionary;
  query: string;
  onCopy: (text: string, message: string) => void;
};

function ArgToken({ arg, lang, t }: { arg: Arg; lang: Locale; t: Dictionary }) {
  const key = typeof arg === "string" ? arg : arg.key;
  const optional = typeof arg !== "string";
  return (
    <span
      title={optional ? t.optional : undefined}
      className={`rounded-sm px-1.5 py-0.5 font-mono text-[0.78rem] ${
        optional
          ? "border border-dashed border-cyan-300/35 text-cyan-200/75"
          : "border border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
      }`}
    >
      [{argLabels[key][lang]}
      {optional && "?"}]
    </span>
  );
}

export function CommandCard({ command, lang, t, query, onCopy }: Props) {
  const [main, ...aliases] = command.names;
  const examples = command.examples ?? [];

  const copyLink = () => {
    const url = `${location.origin}${location.pathname}#cmd-${command.id}`;
    history.replaceState(null, "", `#cmd-${command.id}`);
    onCopy(url, t.copiedLink);
  };

  return (
    <article id={`cmd-${command.id}`} className="cmd-card hud-hover group">
      <div className="hud cut h-full">
        <div className="hud-inner cut relative flex flex-col gap-3 p-4 sm:p-5">
          {/* accent tick on the left edge */}
          <span className="absolute top-5 left-0 h-6 w-[3px] bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] transition-all duration-200 group-hover:h-10" />

          <header className="flex items-start gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1.5">
              <button
                type="button"
                onClick={() => onCopy(main, t.copiedCommand(main))}
                className="group/cmd -mx-1 inline-flex max-w-full items-center gap-2 rounded-sm px-1 text-left font-mono text-lg font-bold text-white transition focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                title={t.copy}
              >
                <span className="break-all">
                  <span className="glow-accent">!</span>
                  <span className="transition-colors group-hover/cmd:text-[var(--accent)]">
                    <Highlight text={main.slice(1)} query={query} />
                  </span>
                </span>
                <Copy className="size-3.5 shrink-0 text-white/25 transition-colors group-hover/cmd:text-[var(--accent)]" />
              </button>
              {command.args?.map((arg, i) => (
                <ArgToken key={i} arg={arg} lang={lang} t={t} />
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {command.mod && (
                <span
                  title={t.modTitle}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-[#00ad03]/15 py-0.5 pr-2 pl-0.5 font-mono text-[0.68rem] font-bold tracking-wider text-[#5cf25f] ring-1 ring-[#00ad03]/40"
                >
                  <ModBadge className="size-4" />
                  {t.mod}
                </span>
              )}
              <button
                type="button"
                onClick={copyLink}
                title={t.copyLink}
                aria-label={t.copyLink}
                className="rounded-sm p-1.5 text-white/30 transition hover:bg-white/5 hover:text-white/80 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              >
                <Link2 className="size-4" />
              </button>
            </div>
          </header>

          <p className="text-[0.95rem] leading-relaxed text-white/70">
            <Highlight text={command.desc[lang]} query={query} />
          </p>

          {aliases.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="hud-label mr-1 text-[0.62rem] text-white/35">{t.aliases}</span>
              {aliases.map((alias) => (
                <button
                  key={alias}
                  type="button"
                  onClick={() => onCopy(alias, t.copiedCommand(alias))}
                  className="rounded-sm border border-white/[0.09] bg-white/[0.03] px-2 py-0.5 font-mono text-xs text-white/65 transition hover:border-[var(--accent)] hover:text-white"
                  title={t.copy}
                >
                  <Highlight text={alias} query={query} />
                </button>
              ))}
            </div>
          )}

          {examples.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="hud-label text-[0.62rem] text-white/35">
                {examples.length > 1 ? t.examples : t.example}
              </span>
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => onCopy(ex, t.copiedCommand(ex))}
                  className="group/ex flex items-center gap-2 rounded-sm border border-white/[0.06] bg-black/40 px-3 py-2 text-left font-mono text-[0.82rem] text-white/85 transition hover:border-[var(--accent)]"
                >
                  <ChevronRight className="size-3.5 shrink-0 text-[var(--accent)]" />
                  <span className="min-w-0 flex-1 break-all">{ex}</span>
                  <Copy className="size-3.5 shrink-0 text-white/25 transition-colors group-hover/ex:text-[var(--accent)]" />
                </button>
              ))}
            </div>
          )}

          {command.link && (
            <a
              href={command.link}
              target="_blank"
              rel="noopener noreferrer"
              className="cut cut-sm mt-auto inline-flex w-fit max-w-full items-center gap-2 bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
            >
              <ExternalLink className="size-3.5 shrink-0 text-[var(--accent)]" />
              <span className="font-display tracking-wide uppercase">{t.openLink}</span>
              <span className="truncate font-mono text-xs text-white/45">
                {new URL(command.link).hostname.replace(/^www\./, "")}
              </span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
