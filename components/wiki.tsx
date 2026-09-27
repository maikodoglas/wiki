"use client";

import { ArrowUp, Check, Search, X } from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { categories, totalCommands, type Category } from "@/lib/commands";
import { TWITCH_URL, locales, ui, type Dictionary, type Locale } from "@/lib/i18n";
import {
  clearSavedPosition,
  peekSavedPosition,
  rememberPosition,
  restorePosition,
} from "@/lib/lang-switch";
import { filterCategories } from "@/lib/search";
import { LANG_STORAGE_KEY } from "@/lib/storage";
import { ChatDemo } from "./chat-demo";
import { CommandCard } from "./command-card";
import { ModBadge, TwitchIcon, accentStyle, categoryIcons } from "./icons";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  }
}

const pad = (n: number) => String(n).padStart(2, "0");
const categoryIndex = new Map(categories.map((c, i) => [c.id, i + 1]));

export function Wiki({ lang }: { lang: Locale }) {
  const t = ui[lang];
  // Set when arriving from the language switch: restore search + scroll position.
  const [saved] = useState(peekSavedPosition);
  const pendingRestore = useRef(saved);
  const [query, setQuery] = useState(saved?.query ?? "");
  const deferredQuery = useDeferredValue(query);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [active, setActive] = useState(categories[0].id);
  const [showTop, setShowTop] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(
    () => filterCategories(categories, deferredQuery, lang),
    [deferredQuery, lang],
  );
  const resultCount = visible.reduce((n, c) => n + c.commands.length, 0);

  const onCopy = useCallback((text: string, message: string) => {
    void copyText(text);
    setToast({ id: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
    clearSavedPosition();
  }, [lang]);

  // After a language switch, wait until the restored search has rendered, then scroll back.
  useLayoutEffect(() => {
    const pending = pendingRestore.current;
    if (!pending || deferredQuery !== pending.query) return;
    restorePosition(pending);
    pendingRestore.current = null;
  }, [deferredQuery]);

  // "/" or Ctrl+K focuses search, Escape clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      } else if (e.key === "Escape" && e.target === searchRef.current) {
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <div className="stage" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-1] h-[900px] overflow-hidden" aria-hidden>
        <div className="stage-floor" />
      </div>
      <div className="scanlines" aria-hidden />

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

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label={t.backToTop}
          title={t.backToTop}
          className="btn-neon cut fixed right-4 bottom-4 z-40 grid size-11 place-items-center text-white sm:right-6 sm:bottom-6"
        >
          <ArrowUp className="size-5" />
        </button>
      )}

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 drop-shadow-[0_0_24px_rgb(169_112_255/0.55)]"
        >
          <div className="toast hud cut">
            <div className="hud-inner cut flex items-center gap-3 px-4 py-2.5">
              <span className="grid size-7 place-items-center bg-[var(--accent)] text-black">
                <Check className="size-4" strokeWidth={3} />
              </span>
              <span className="text-sm whitespace-nowrap text-white">{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Header({ lang, t, query }: { lang: Locale; t: Dictionary; query: string }) {
  return (
    <header className="glass sticky top-0 z-40 h-[var(--header-h)] border-b border-white/[0.06]">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href={`/${lang}/`} className="flex min-w-0 items-center gap-3">
          <span className="cut cut-sm grid size-9 shrink-0 place-items-center bg-gradient-to-br from-[#a970ff] to-[#ff4fa3] font-display text-lg font-bold text-white">
            M
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-base font-bold tracking-wider uppercase">
              maikodoglas
            </span>
            <span className="hud-label truncate text-[0.6rem] text-white/40">{t.badge}</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div
            role="group"
            aria-label={t.language}
            className="cut cut-sm flex bg-white/[0.06] p-0.5 font-mono text-xs font-bold"
          >
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}/`}
                scroll={false}
                onClick={() => rememberPosition(query)}
                hrefLang={l === "pt" ? "pt-BR" : "en"}
                aria-current={l === lang ? "page" : undefined}
                className={`cut cut-sm px-3 py-1.5 transition-colors ${
                  l === lang ? "bg-white text-black" : "text-white/55 hover:text-white"
                }`}
              >
                {l === "pt" ? "PT" : "EN"}
              </Link>
            ))}
          </div>
          <a
            href={TWITCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon cut inline-flex items-center gap-2 px-3 py-2 font-display text-sm font-bold tracking-wide text-white uppercase sm:px-4"
          >
            <TwitchIcon className="size-4" />
            <span className="hidden sm:inline">{t.watchLive}</span>
            <span className="sr-only sm:hidden">{t.watchLiveShort}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function SearchBox({
  t,
  query,
  setQuery,
  inputRef,
}: {
  t: Dictionary;
  query: string;
  setQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="mt-8 w-full max-w-xl drop-shadow-[0_0_20px_rgb(169_112_255/0.25)] focus-within:drop-shadow-[0_0_28px_rgb(169_112_255/0.55)]">
      <div className="hud cut">
        <div className="hud-inner cut relative flex items-center">
          <Search className="pointer-events-none absolute left-4 size-5 text-[var(--accent)]" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchLabel}
            autoComplete="off"
            spellCheck={false}
            className="h-14 w-full bg-transparent pr-24 pl-12 font-mono text-[0.95rem] text-white placeholder:text-white/35 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <div className="absolute right-4 flex items-center gap-2">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="hud-label inline-flex items-center gap-1 bg-white/10 px-2 py-1 text-white/80 transition hover:bg-white/15"
              >
                <X className="size-3.5" />
                {t.clear}
              </button>
            ) : (
              <kbd
                title={t.shortcut}
                className="hidden border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-xs text-white/50 sm:block"
              >
                /
              </kbd>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="hud cut cut-sm">
      <div className="hud-inner cut cut-sm px-3 py-2.5">
        <div className="font-display text-2xl leading-none font-bold text-white sm:text-3xl">{value}</div>
        <div className="hud-label mt-1.5 text-[0.6rem] text-white/45">{label}</div>
      </div>
    </div>
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
  onCopy: (text: string, message: string) => void;
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

function EmptyState({ t, onClear }: { t: Dictionary; onClear: () => void }) {
  return (
    <div className="brackets">
      <div className="flex flex-col items-center border border-dashed border-white/10 px-6 py-16 text-center">
        <p className="hud-label mb-3 text-[var(--accent)]">404</p>
        <p className="font-display text-2xl font-bold uppercase">{t.noResults}</p>
        <p className="mt-1 text-white/50">{t.noResultsHint}</p>
        <button
          type="button"
          onClick={onClear}
          className="btn-neon cut mt-6 px-6 py-2.5 font-display text-sm font-bold tracking-wide text-white uppercase"
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
}

function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="border-t border-white/[0.06] bg-black/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-white/40 sm:flex-row sm:px-6 lg:px-8">
        <p>
          {t.footer} <span className="text-white/25">{t.footerNote}</span>
        </p>
        <a
          href={TWITCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hud-label inline-flex items-center gap-2 transition hover:text-white"
        >
          <TwitchIcon className="size-4" />
          twitch.tv/maikodoglas
        </a>
      </div>
    </footer>
  );
}
