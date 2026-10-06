"use client";

import { Ban, Check, Copy, Dices, Lock, Mic, RotateCcw, SkipForward } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { calls, soundCheats, type CallId, type ScriptLine, type Speaker } from "@/lib/cheats";
import { ui, type Dictionary, type Locale } from "@/lib/i18n";
import { normalize } from "@/lib/search";
import redeemImage from "@/public/redeemCheat.jpeg";
import { Highlight } from "./highlight";
import {
  Backdrop,
  EmptyState,
  Footer,
  Header,
  Overlays,
  SearchBox,
  Stat,
  useCopy,
  usePageSearch,
  type OnCopy,
} from "./shell";

const accent = {
  sounds: "#22d3ee",
  bety: "#ff4fa3",
  fernanda: "#fb923c",
  ivone: "#facc15",
  seuferreira: "#f87171",
  clone: "#a970ff",
  cloneSide: "#4ade80",
};

const withAccent = (color: string) => ({ "--accent": color }) as React.CSSProperties;

const speakerName: Record<Speaker, string> = {
  bety: "Bety",
  fernanda: "Fernanda",
  ivone: "Ivone",
  seuferreira: "Seu Ferreira",
};

const callLines = calls.flatMap((call) => call.lines);
const speakerOf = new Map(callLines.map((line) => [line.code, line.speaker]));
const lineTotal = calls.reduce((n, call) => n + call.lines.length + call.randoms.length, 0);
const actTotal = calls.reduce((n, call) => n + call.script.length, 0);

function matcher(query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return (...fields: string[]) => {
    const text = normalize(fields.join(" "));
    return terms.every((term) => text.includes(term));
  };
}

export function Cheats({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const { query, setQuery, deferredQuery, searchRef } = usePageSearch(lang);
  const { toast, onCopy } = useCopy();
  const [speaker, setSpeaker] = useState<Record<CallId, Speaker | "all">>({ bety: "all", ivone: "all" });

  const searching = deferredQuery.trim().length > 0;

  const { sounds, packs } = useMemo(() => {
    const match = matcher(deferredQuery);
    return {
      sounds: soundCheats.map((code, i) => ({ code, i })).filter(({ code }) => match(code)),
      packs: calls.map((call, n) => {
        const filter = speaker[call.id];
        const randoms = call.randoms.filter((r) => match(r.code, r.desc[lang]));
        const lines = call.lines
          .map((line, i) => ({ ...line, i }))
          .filter((l) => (filter === "all" || l.speaker === filter) && match(l.code, l.text, l.speaker));
        return {
          call,
          randoms,
          lines,
          filter,
          index: 2 + n * 2,
          color: accent[call.speakers[0]],
          show: randoms.length + lines.length > 0 || filter !== "all",
        };
      }),
    };
  }, [deferredQuery, lang, speaker]);

  const copyCheat = (code: string) => onCopy(code, t.copiedCheat(code));

  const sections = [
    { id: "sons", title: t.soundTitle, count: sounds.length, color: accent.sounds, show: sounds.length > 0 },
    ...packs.flatMap(({ call, randoms, lines, color, show }) => [
      { id: call.id, title: t[`${call.id}Title`], count: randoms.length + lines.length, color, show },
      {
        id: `${call.id}-clone`,
        title: t[`${call.id}CloneTitle`],
        count: call.script.length,
        color: accent.clone,
        show: !searching,
      },
    ]),
  ].filter((s) => s.show);

  return (
    <>
      <Backdrop />
      <Header lang={lang} t={t} query={query} path="cheats/" subtitle={t.cheatsBadge} />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="grid items-center gap-10 pt-10 pb-10 sm:pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-14 lg:pt-20 lg:pb-14">
          <div className="flex flex-col">
            <p className="hud-label mb-5 inline-flex items-center gap-2 text-white/60">
              <Lock className="size-3.5 text-[var(--accent)]" />
              {t.cheatsKicker}
            </p>
            <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-tight uppercase sm:text-7xl xl:text-8xl">
              {t.cheatsTitle} <span className="text-neon">{t.cheatsHighlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-pretty text-white/60 sm:text-lg">{t.cheatsText}</p>

            <SearchBox
              t={t}
              query={query}
              setQuery={setQuery}
              inputRef={searchRef}
              placeholder={t.cheatsSearch}
            />

            <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
              <Stat value={soundCheats.length} label={t.statCheats} />
              <Stat value={lineTotal} label={t.statLines} />
              <Stat value={actTotal} label={t.statScript} />
            </div>
          </div>

          <div className="hidden sm:block">
            <CheatConsole t={t} />
          </div>
        </section>

        <RedeemGuide t={t} />

        {/* Section nav */}
        <nav
          aria-label={t.sections}
          className="glass sticky top-[var(--header-h)] z-30 -mx-4 border-y border-white/[0.06] px-4 py-2.5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={withAccent(s.color)}
                className="chip cut cut-sm font-display text-sm font-semibold tracking-wide text-white/70 uppercase"
              >
                <span className="size-2 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                {s.title}
                <span className="font-mono text-xs text-white/40">{s.count}</span>
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-20 pt-10 pb-24 lg:pt-14">
          {searching && sections.length === 0 && <EmptyState t={t} onClear={() => setQuery("")} />}

          {sounds.length > 0 && (
            <section id="sons" style={withAccent(accent.sounds)}>
              <SectionHeader
                index={1}
                id="sons"
                title={t.soundTitle}
                meta={t.cheatCount(sounds.length)}
                desc={t.soundDesc}
                action={
                  <button
                    type="button"
                    title={t.randomCheatTitle}
                    onClick={() => copyCheat(soundCheats[Math.floor(Math.random() * soundCheats.length)])}
                    className="btn-neon cut inline-flex shrink-0 items-center gap-2 px-4 py-2 font-display text-sm font-bold tracking-wide text-white uppercase"
                  >
                    <Dices className="size-4" />
                    {t.randomCheat}
                  </button>
                }
              />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {sounds.map(({ code, i }) => (
                  <button
                    key={code}
                    id={`s-${i}`}
                    data-anchor
                    type="button"
                    title={t.copy}
                    onClick={() => copyCheat(code)}
                    className="hud-hover group text-left"
                  >
                    <div className="hud cut cut-sm h-full">
                      <div className="hud-inner cut cut-sm flex items-center gap-2 px-3 py-3">
                        <span className="min-w-0 flex-1 font-mono text-[0.88rem] font-bold break-all text-white">
                          <span className="glow-accent">!</span>
                          <Highlight text={code.slice(1)} query={deferredQuery} />
                        </span>
                        <Copy className="size-3.5 shrink-0 text-white/25 transition-colors group-hover:text-[var(--accent)]" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {packs.map(({ call, randoms, lines, filter, index, color, show }) => (
            <Fragment key={call.id}>
              {show && (
                <section id={call.id} style={withAccent(color)}>
                  <SectionHeader
                    index={index}
                    id={call.id}
                    title={t[`${call.id}Title`]}
                    meta={t.lineCount(randoms.length + lines.length)}
                    desc={t[`${call.id}Desc`]}
                  />

                  {randoms.length > 0 && (
                    <div className="mb-8 grid gap-3 sm:grid-cols-3">
                      {randoms.map((r) => (
                        <button
                          key={r.code}
                          type="button"
                          onClick={() => copyCheat(r.code)}
                          className="hud-hover group text-left"
                        >
                          <div className="hud cut h-full">
                            <div className="hud-inner cut flex flex-col gap-2 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_70%)] p-4">
                              <span className="hud-label flex items-center gap-1.5 text-[0.62rem] text-[var(--accent)]">
                                <Dices className="size-3.5" />
                                {t.betyRandomTitle}
                              </span>
                              <span className="flex items-center gap-2 font-mono text-base font-bold text-white">
                                <span className="min-w-0 flex-1 break-all">
                                  <span className="glow-accent">!</span>
                                  <Highlight text={r.code.slice(1)} query={deferredQuery} />
                                </span>
                                <Copy className="size-3.5 shrink-0 text-white/25 transition-colors group-hover:text-[var(--accent)]" />
                              </span>
                              <span className="text-sm text-white/60">{r.desc[lang]}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div role="group" className="mb-5 flex flex-wrap gap-2">
                    {(["all", ...call.speakers] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={filter === s}
                        data-active={filter === s}
                        onClick={() => setSpeaker((prev) => ({ ...prev, [call.id]: s }))}
                        style={withAccent(s === "all" ? color : accent[s])}
                        className="chip cut cut-sm font-display text-sm font-semibold tracking-wide text-white/65 uppercase"
                      >
                        {s === "all" ? t.filterAll : speakerName[s]}
                      </button>
                    ))}
                  </div>

                  {lines.length === 0 ? (
                    <EmptyState t={t} onClear={() => setQuery("")} />
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {lines.map((line) => (
                        <button
                          key={line.code}
                          id={`${call.id}-${line.i}`}
                          data-anchor
                          type="button"
                          onClick={() => copyCheat(line.code)}
                          style={withAccent(accent[line.speaker])}
                          className="hud-hover group text-left"
                        >
                          <div className="hud cut h-full">
                            <div className="hud-inner cut flex h-full flex-col gap-2 p-4">
                              <span className="flex items-center gap-2">
                                <span className="min-w-0 flex-1 font-mono text-[0.92rem] font-bold break-all text-white">
                                  <span className="glow-accent">!</span>
                                  <Highlight text={line.code.slice(1)} query={deferredQuery} />
                                </span>
                                <span className="hud-label shrink-0 bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] px-1.5 py-0.5 text-[0.58rem] text-[var(--accent)]">
                                  {speakerName[line.speaker]}
                                </span>
                                <Copy className="size-3.5 shrink-0 text-white/25 transition-colors group-hover:text-[var(--accent)]" />
                              </span>
                              <span className="text-[0.92rem] leading-relaxed text-white/70">
                                <span className="text-[var(--accent)]">“</span>
                                <Highlight text={line.text} query={deferredQuery} />
                                <span className="text-[var(--accent)]">”</span>
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {!searching && (
                <section id={`${call.id}-clone`} style={withAccent(accent.clone)}>
                  <SectionHeader
                    index={index + 1}
                    id={`${call.id}-clone`}
                    title={t[`${call.id}CloneTitle`]}
                    meta={t.cheatCount(call.script.flat().filter((l) => l.code).length)}
                    desc={t.cloneDesc}
                  />
                  <div className="flex flex-col gap-14">
                    {call.script.map((act, a) => (
                      <CloneAct
                        key={a}
                        id={`${call.id}-clone-${a}`}
                        act={act}
                        index={a}
                        lead={call.speakers[0]}
                        t={t}
                        onCopy={onCopy}
                      />
                    ))}
                  </div>
                </section>
              )}
            </Fragment>
          ))}
        </div>
      </main>

      <Footer t={t} />
      <Overlays t={t} toast={toast} />
    </>
  );
}

/** Cheats are redeemed through the "Cheat Code" channel points reward, not typed in chat. */
function RedeemGuide({ t }: { t: Dictionary }) {
  return (
    <section aria-labelledby="redeem-title" className="mb-10 lg:mb-14" style={withAccent(accent.clone)}>
      <div className="hud cut">
        <div className="hud-inner cut grid items-center gap-6 p-5 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-6">
          <div className="brackets mx-auto w-full max-w-[15rem] sm:w-56">
            <Image
              src={redeemImage}
              alt={t.redeemAlt}
              sizes="15rem"
              className="cut w-full shadow-[0_0_40px_-8px_var(--accent)]"
            />
          </div>
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2
                id="redeem-title"
                className="font-display text-2xl leading-none font-bold tracking-wide uppercase sm:text-3xl"
              >
                {t.redeemTitle}
              </h2>
              <span className="hud-label inline-flex items-center gap-1.5 bg-[#ff4f6d]/15 px-2 py-1 text-[0.62rem] text-[#ff8198] ring-1 ring-[#ff4f6d]/35">
                <Ban className="size-3.5" />
                {t.redeemNotChat}
              </span>
            </div>
            <ol className="flex flex-col gap-3">
              {t.redeemSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <span className="cut cut-sm grid size-8 shrink-0 place-items-center bg-[var(--accent)] font-display text-base font-bold text-black">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-pretty text-white/75">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  index,
  id,
  title,
  meta,
  desc,
  action,
}: {
  index: number;
  id: string;
  title: string;
  meta: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      <div className="flex flex-wrap items-end gap-4">
        <span className="index-outline text-6xl leading-[0.8] sm:text-7xl">{String(index).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <p className="hud-label glow-accent mb-1">{meta}</p>
          <h2
            id={`${id}-title`}
            className="font-display text-2xl leading-none font-bold tracking-wide uppercase sm:text-4xl"
          >
            <a href={`#${id}`} className="transition-colors hover:text-[var(--accent)]">
              {title}
            </a>
          </h2>
        </div>
        {action}
      </div>
      <div className="mt-4 h-px bg-gradient-to-r from-[var(--accent)] via-white/10 to-transparent" />
      <p className="mt-3 max-w-3xl text-pretty text-white/55">{desc}</p>
    </div>
  );
}

function CloneAct({
  id,
  act,
  index,
  lead,
  t,
  onCopy,
}: {
  id: string;
  act: ScriptLine[];
  index: number;
  /** Who speaks the lines that have no cheat of their own. */
  lead: Speaker;
  t: Dictionary;
  onCopy: OnCopy;
}) {
  const [done, setDone] = useState<ReadonlySet<number>>(() => new Set());
  const cheatIdx = act.flatMap((line, i) => (line.code ? [i] : []));
  const next = cheatIdx.find((i) => !done.has(i));
  const doneCount = cheatIdx.filter((i) => done.has(i)).length;
  const pct = cheatIdx.length ? (doneCount / cheatIdx.length) * 100 : 0;

  const copyLine = (i: number) => {
    const code = act[i].code;
    if (!code) return;
    onCopy(code, t.copiedCheat(code));
    setDone((prev) => new Set(prev).add(i));
  };

  const copyNext = () => {
    if (next === undefined) return;
    copyLine(next);
    const after = cheatIdx.find((i) => i > next && !done.has(i));
    if (after !== undefined) {
      document.getElementById(`${id}-${after}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Act toolbar stays visible while following the script */}
      <div className="glass sticky top-[calc(var(--header-h)+3.6rem)] z-20 -mx-4 mb-5 border-y border-white/[0.06] px-4 py-3 sm:mx-0 sm:border sm:px-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 className="font-display text-lg font-bold tracking-widest text-[var(--accent)] uppercase">
            {t.act(index + 1)}
          </h3>
          <div className="flex min-w-32 flex-1 items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden bg-white/10">
              <div
                className="h-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="hud-label shrink-0 text-[0.62rem] text-white/50">
              {t.progress(doneCount, cheatIdx.length)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDone(new Set())}
              disabled={doneCount === 0}
              className="chip cut cut-sm hud-label text-[0.62rem] text-white/70 disabled:opacity-40"
            >
              <RotateCcw className="size-3.5" />
              {t.restart}
            </button>
            <button
              type="button"
              onClick={copyNext}
              disabled={next === undefined}
              className="btn-neon cut inline-flex items-center gap-2 px-3 py-1.5 font-display text-sm font-bold tracking-wide text-white uppercase disabled:opacity-40"
            >
              <SkipForward className="size-4" />
              {next === undefined ? t.finished : t.copyNext}
            </button>
          </div>
        </div>
      </div>

      <ol className="flex flex-col gap-2.5">
        {act.map((line, i) => (
          <ScriptBubble
            key={i}
            id={`${id}-${i}`}
            line={line}
            lead={lead}
            t={t}
            isNext={i === next}
            isDone={done.has(i)}
            onUse={() => copyLine(i)}
          />
        ))}
      </ol>
    </div>
  );
}

function ScriptBubble({
  id,
  line,
  lead,
  t,
  isNext,
  isDone,
  onUse,
}: {
  id: string;
  line: ScriptLine;
  lead: Speaker;
  t: Dictionary;
  isNext: boolean;
  isDone: boolean;
  onUse: () => void;
}) {
  const clone = line.side === "b";
  const speaker = (line.code && speakerOf.get(line.code)) || lead;
  const color = clone ? accent.cloneSide : accent[speaker];
  const name = clone ? t.cloneSide : speakerName[speaker];

  return (
    <li
      id={id}
      data-anchor
      style={withAccent(color)}
      className={`flex flex-col ${clone ? "items-end" : "items-start"} transition-opacity ${
        isDone ? "opacity-45" : ""
      }`}
    >
      <span className={`hud-label mb-1 flex items-center gap-2 text-[0.6rem] ${clone ? "flex-row-reverse" : ""}`}>
        <span className="text-[var(--accent)]">{name}</span>
        {isNext && (
          <span className="pulse-dot bg-[var(--accent)] px-1.5 py-px font-bold text-black">▶ {t.next}</span>
        )}
      </span>

      {line.code ? (
        <button
          type="button"
          onClick={onUse}
          className={`hud-hover group max-w-[90%] text-left sm:max-w-[70%] ${isNext ? "drop-shadow-[0_0_14px_var(--accent)]" : ""}`}
        >
          <div className="hud cut cut-sm">
            <div className="hud-inner cut cut-sm flex flex-col gap-1 px-3.5 py-2.5">
              <span className="flex items-center gap-2 font-mono text-[0.88rem] font-bold break-all text-white">
                <span>
                  <span className="glow-accent">!</span>
                  {line.code.slice(1)}
                </span>
                {isDone ? (
                  <Check className="size-3.5 shrink-0 text-[var(--accent)]" strokeWidth={3} />
                ) : (
                  <Copy className="size-3.5 shrink-0 text-white/25 transition-colors group-hover:text-[var(--accent)]" />
                )}
              </span>
              <span className="text-sm text-white/65">“{line.text}”</span>
              {line.note && (
                <span className="hud-label text-[0.58rem] text-white/40">
                  {t.alternative}: <span className="normal-case tracking-normal">{line.note}</span>
                </span>
              )}
            </div>
          </div>
        </button>
      ) : (
        <div className="flex max-w-[90%] items-start gap-2 border border-dashed border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-3.5 py-2.5 text-sm text-white/75 italic sm:max-w-[70%]">
          <Mic className="mt-0.5 size-3.5 shrink-0 text-[var(--accent)]" aria-label={t.spoken} />
          {line.text}
        </div>
      )}
    </li>
  );
}

/** Decorative terminal that "activates" random cheats. */
function CheatConsole({ t }: { t: Dictionary }) {
  const pool = useRef([...soundCheats, ...callLines.map((l) => l.code)]);
  const [log, setLog] = useState(() =>
    ["!TOASTY", "!FATALITY", "!BONK", "!WINDOWSXP", "!BETYALO"].map((code, i) => ({ id: i, code })),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setLog((prev) => {
        const code = pool.current[Math.floor(Math.random() * pool.current.length)];
        return [...prev.slice(-7), { id: prev.at(-1)!.id + 1, code }];
      });
    }, 1700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="brackets w-full" aria-hidden>
      <div className="hud cut">
        <div className="hud-inner cut flex h-[21rem] flex-col font-mono text-[0.85rem]">
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
            <span className="hud-label ml-2 text-white/50">{t.cheatsConsole}</span>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden px-4 py-3 [mask-image:linear-gradient(to_bottom,transparent,black_35%)]">
            {log.map(({ id, code }) => (
              <p key={id} className="chat-in flex items-center gap-2">
                <span className="text-[var(--accent)]">&gt;</span>
                <span className="truncate text-white">{code}</span>
                <span className="flex-1 truncate text-white/15">.............................</span>
                <span className="shrink-0 text-[#4ade80] uppercase">[{t.cheatsActivated}]</span>
              </p>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-white/[0.07] px-4 py-3">
            <span className="text-[var(--accent)]">&gt;</span>
            <span className="caret h-4 w-2 bg-[var(--accent)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
