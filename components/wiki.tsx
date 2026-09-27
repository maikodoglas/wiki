"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, totalCommands, type Category } from "@/lib/commands";
import { TWITCH_URL, locales, ui, type Dictionary, type Locale } from "@/lib/i18n";
import { filterCategories } from "@/lib/search";
import { ChatDemo } from "./chat-demo";
import { CommandCard } from "./command-card";
import { ModBadge, accentStyle, categoryIcons } from "./icons";
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

const pad = (n: number) => String(n).padStart(2, "0");
const categoryIndex = new Map(categories.map((c, i) => [c.id, i + 1]));

export function Wiki({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const { query, setQuery, deferredQuery, searchRef } = usePageSearch(lang);
  const { toast, onCopy } = useCopy();
  const [active, setActive] = useState(categories[0].id);

  const visible = useMemo(
    () => filterCategories(categories, deferredQuery, lang),
    [deferredQuery, lang],
  );
  const resultCount = visible.reduce((n, c) => n + c.commands.length, 0);

  // Scroll spy for the category nav.
  useEffect(() => {
    const sections = visible
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -70% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [visible]);

  // Keep the active mobile chip in view.
  // Scroll only the chip row sideways; scrollIntoView would also move the page.
  useEffect(() => {
    const chip = document.getElementById(`chip-${active}`);
    const row = chip?.parentElement;
    if (!chip || !row) return;
    row.scrollTo({
      left: chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  const searching = deferredQuery.trim().length > 0;

  return (
    <>
      <Backdrop />

      <Header lang={lang} t={t} query={query} />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="grid items-center gap-10 pt-10 pb-10 sm:pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-14 lg:pt-20 lg:pb-14">
          <div className="flex flex-col">
            <a
              href={TWITCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hud-label mb-5 inline-flex w-fit items-center gap-2 text-white/60 transition hover:text-white"
            >
              <span className="pulse-dot size-2 bg-[var(--accent)]" />
              twitch.tv/maikodoglas
            </a>
            <h1 className="font-display text-[2.6rem] leading-[0.95] font-bold tracking-tight uppercase text-balance sm:text-6xl xl:text-7xl">
              {t.heroTitle} <span className="text-neon">{t.heroHighlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-pretty text-white/60 sm:text-lg">{t.heroText}</p>

            <SearchBox t={t} query={query} setQuery={setQuery} inputRef={searchRef} />

            <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
              <Stat value={totalCommands} label={t.statCommands} />
              <Stat value={categories.length} label={t.statCategories} />
              <Stat value={locales.length} label={t.statLanguages} />
            </div>
          </div>

          <div className="hidden sm:block">
            <ChatDemo lang={lang} t={t} />
          </div>
        </section>

        <Legend t={t} lang={lang} />

        {/* Mobile category chips */}
        <nav
          aria-label={t.onThisPage}
          className="glass sticky top-[var(--header-h)] z-30 -mx-4 mt-8 border-b border-white/[0.06] px-4 py-2.5 sm:-mx-6 sm:px-6 lg:hidden"
        >
          <div className="no-scrollbar relative flex gap-2 overflow-x-auto">
            {visible.map((c) => {
              const Icon = categoryIcons[c.icon];
              return (
                <a
                  key={c.id}
                  id={`chip-${c.id}`}
                  href={`#${c.id}`}
                  data-active={c.id === active}
                  style={accentStyle(c.icon)}
                  className="chip cut cut-sm font-display text-sm font-semibold tracking-wide text-white/65 uppercase"
                >
                  <Icon className="size-3.5 text-[var(--accent)]" />
                  {c.title[lang]}
                  <span className="font-mono text-xs text-white/40">{c.commands.length}</span>
                </a>
              );
            })}
          </div>
        </nav>

        <div className="grid gap-10 pt-8 pb-24 lg:grid-cols-[16.5rem_1fr] lg:pt-12">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <nav aria-label={t.onThisPage} className="sticky top-[calc(var(--header-h)+1.5rem)]">
              <p className="hud-label mb-3 px-3 text-white/35">{"// "}{t.onThisPage}</p>
              <ul className="flex flex-col gap-1">
                {visible.map((c) => {
                  const Icon = categoryIcons[c.icon];
                  const isActive = c.id === active;
                  return (
                    <li key={c.id} style={accentStyle(c.icon)}>
                      <a
                        href={`#${c.id}`}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${
                          isActive
                            ? "bg-[linear-gradient(90deg,color-mix(in_srgb,var(--accent)_22%,transparent),transparent)] text-white"
                            : "text-white/55 hover:bg-white/[0.03] hover:text-white"
                        }`}
                      >
                        <span
                          className={`absolute top-0 bottom-0 left-0 w-[3px] transition-all ${
                            isActive ? "bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" : "bg-white/10"
                          }`}
                        />
                        <span className="w-5 font-mono text-[0.7rem] text-white/30">
                          {pad(categoryIndex.get(c.id) ?? 0)}
                        </span>
                        <Icon className={`size-4 shrink-0 ${isActive ? "text-[var(--accent)]" : ""}`} />
                        <span className="flex-1 font-display leading-tight font-semibold tracking-wide uppercase">
                          {c.title[lang]}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-white/35">{c.commands.length}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0">
            {searching && (
              <p className="hud-label mb-6 text-white/50" aria-live="polite">
                &gt; {t.results(resultCount)}
              </p>
            )}

            {visible.length === 0 ? (
              <EmptyState t={t} onClear={() => setQuery("")} />
            ) : (
              <div className="flex flex-col gap-20">
                {visible.map((category) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    lang={lang}
                    t={t}
                    query={deferredQuery}
                    onCopy={onCopy}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer t={t} />

      <Overlays t={t} toast={toast} />
    </>
  );
}

function Legend({ t, lang }: { t: Dictionary; lang: Locale }) {
  const user = lang === "pt" ? "usuário" : "user";
  return (
    <div className="border-y border-white/[0.06] bg-white/[0.015] py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
        <p className="hud-label shrink-0 text-[var(--accent)]">{"// "}{t.howTo}</p>
        <ul className="grid flex-1 gap-x-6 gap-y-2.5 text-sm text-white/60 sm:grid-cols-2 xl:grid-cols-4">
          <li className="flex items-center gap-2.5">
            <span className="shrink-0 rounded-sm border border-cyan-300/25 bg-cyan-300/10 px-1.5 py-0.5 font-mono text-xs text-cyan-200">
              [{user}]
            </span>
            {t.legendParam}
          </li>
          <li className="flex items-center gap-2.5">
            <span className="shrink-0 rounded-sm border border-dashed border-cyan-300/35 px-1.5 py-0.5 font-mono text-xs text-cyan-200/75">
              [{user}?]
            </span>
            {t.legendOptional}
          </li>
          <li className="flex items-center gap-2.5">
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-[#00ad03]/15 py-0.5 pr-2 pl-0.5 font-mono text-[0.68rem] font-bold text-[#5cf25f] ring-1 ring-[#00ad03]/40">
              <ModBadge className="size-4" />
              {t.mod}
            </span>
            {t.legendMod}
          </li>
          <li className="flex items-center gap-2.5">
            <span className="shrink-0 rounded-sm border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-white">
              <span className="text-[var(--accent)]">!</span>cmd
            </span>
            {t.legendCopy}
          </li>
        </ul>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  lang,
  t,
  query,
  onCopy,
}: {
  category: Category;
  lang: Locale;
  t: Dictionary;
  query: string;
  onCopy: OnCopy;
}) {
  const Icon = categoryIcons[category.icon];
  const groups = category.groups
    ?.map((g) => ({ ...g, commands: category.commands.filter((c) => c.group === g.id) }))
    .filter((g) => g.commands.length > 0);

  const grid = (commands: Category["commands"]) => (
    <div className="grid gap-4 md:grid-cols-2">
      {commands.map((cmd) => (
        <CommandCard key={cmd.id} command={cmd} lang={lang} t={t} query={query} onCopy={onCopy} />
      ))}
    </div>
  );

  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`} style={accentStyle(category.icon)}>
      <div className="mb-7">
        <div className="flex items-end gap-4">
          <span className="index-outline text-6xl leading-[0.8] sm:text-7xl">
            {pad(categoryIndex.get(category.id) ?? 0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="hud-label glow-accent mb-1 flex items-center gap-2">
              <Icon className="size-3.5" />
              {t.commandCount(category.commands.length)}
            </p>
            <h2
              id={`${category.id}-title`}
              className="font-display text-2xl leading-none font-bold tracking-wide uppercase sm:text-4xl"
            >
              <a href={`#${category.id}`} className="transition-colors hover:text-[var(--accent)]">
                {category.title[lang]}
              </a>
            </h2>
          </div>
        </div>
        <div className="mt-4 h-px bg-gradient-to-r from-[var(--accent)] via-white/10 to-transparent" />
        <p className="mt-3 text-pretty text-white/55">{category.desc[lang]}</p>
      </div>

      {groups ? (
        <div className="flex flex-col gap-9">
          {groups.map((g) => (
            <div key={g.id}>
              <h3 className="mb-4 flex items-center gap-3">
                <span className="cut cut-sm bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] px-3 py-1 font-display text-sm font-bold tracking-widest text-[var(--accent)] uppercase">
                  {g.title[lang]}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </h3>
              {grid(g.commands)}
            </div>
          ))}
        </div>
      ) : (
        grid(category.commands)
      )}
    </section>
  );
}
