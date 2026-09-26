"use client";

import { Copy, ExternalLink, Link2, ShieldCheck } from "lucide-react";
import { argLabels, type Arg, type Command } from "@/lib/commands";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Highlight } from "./highlight";

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
      className={`rounded-md px-1.5 py-0.5 font-mono text-[0.8rem] ${
        optional
          ? "border border-dashed border-sky-400/30 text-sky-300/80"
          : "bg-sky-400/10 text-sky-300"
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
    <article
      id={`cmd-${command.id}`}
      className="cmd-card group relative flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors duration-200 hover:border-violet-400/30 hover:bg-white/[0.04] sm:p-5"
    >
      <header className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1.5">
          <button
            type="button"
            onClick={() => onCopy(main, t.copiedCommand(main))}
            className="group/cmd -mx-1 inline-flex max-w-full items-center gap-2 rounded-lg px-1 text-left font-mono text-lg font-semibold text-white transition-colors hover:text-violet-200 focus-visible:outline-2 focus-visible:outline-violet-400"
            title={t.copy}
          >
            <span className="break-all">
              <Highlight text={main} query={query} />
            </span>
            <Copy className="size-3.5 shrink-0 text-white/30 transition-colors group-hover/cmd:text-violet-300" />
          </button>
          {command.args?.map((arg, i) => (
            <ArgToken key={i} arg={arg} lang={lang} t={t} />
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {command.mod && (
            <span
              title={t.modTitle}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[0.7rem] font-bold tracking-wide text-emerald-300 ring-1 ring-emerald-400/25"
            >
              <ShieldCheck className="size-3" />
              {t.mod}
            </span>
          )}
          <button
            type="button"
            onClick={copyLink}
            title={t.copyLink}
            aria-label={t.copyLink}
            className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/5 hover:text-white/80 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
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
          <span className="mr-0.5 text-xs text-white/40">{t.aliases}</span>
          {aliases.map((alias) => (
            <button
              key={alias}
              type="button"
              onClick={() => onCopy(alias, t.copiedCommand(alias))}
              className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-xs text-white/65 transition hover:border-violet-400/40 hover:text-white"
              title={t.copy}
            >
              <Highlight text={alias} query={query} />
            </button>
          ))}
        </div>
      )}

      {examples.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-white/40">
            {examples.length > 1 ? t.examples : t.example}
          </span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onCopy(ex, t.copiedCommand(ex))}
              className="group/ex flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2 text-left font-mono text-[0.82rem] text-violet-100/90 transition hover:border-violet-400/30"
            >
              <span className="text-violet-400/60 select-none">›</span>
              <span className="min-w-0 flex-1 break-all">{ex}</span>
              <Copy className="size-3.5 shrink-0 text-white/25 transition-colors group-hover/ex:text-violet-300" />
            </button>
          ))}
        </div>
      )}

      {command.link && (
        <a
          href={command.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-fit max-w-full items-center gap-2 rounded-lg bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-200 ring-1 ring-violet-400/20 transition hover:bg-violet-500/20 hover:ring-violet-400/40"
        >
          <ExternalLink className="size-3.5 shrink-0" />
          <span>{t.openLink}</span>
          <span className="truncate text-violet-300/50">
            {new URL(command.link).hostname.replace(/^www\./, "")}
          </span>
        </a>
      )}
    </article>
  );
}
