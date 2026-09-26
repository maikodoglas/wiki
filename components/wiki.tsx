"use client";

import { ArrowUp, Check, Search, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { categories, totalCommands, type Category } from "@/lib/commands";
import { TWITCH_URL, locales, ui, type Dictionary, type Locale } from "@/lib/i18n";
import { filterCategories } from "@/lib/search";
import { LANG_STORAGE_KEY } from "@/lib/storage";
import { CommandCard } from "./command-card";
import { TwitchIcon, categoryAccent, categoryIcons } from "./icons";

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

export function Wiki({ lang }: { lang: Locale }) {
  const t = ui[lang];
  const [query, setQuery] = useState("");
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
  }, [lang]);

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
  useEffect(() => {
    document
      .getElementById(`chip-${active}`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  const searching = deferredQuery.trim().length > 0;

  return (
    <>
      <div className="aurora" aria-hidden>
        <div className="grid-bg" />
      </div>

      <Header lang={lang} t={t} />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="flex flex-col items-center pt-12 pb-8 text-center sm:pt-20 sm:pb-12">
          <a
            href={TWITCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="chip mb-6 text-xs font-medium text-white/75"
          >
            <span className="live-dot size-2 rounded-full bg-red-500" />
            twitch.tv/maikodoglas
          </a>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl">
            {t.heroTitle} <span className="text-gradient">{t.heroHighlight}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-pretty text-white/60 sm:text-lg">{t.heroText}</p>

          <SearchBox t={t} query={query} setQuery={setQuery} inputRef={searchRef} />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/50">
            <span>
              <strong className="font-semibold text-white">{totalCommands}</strong> {t.commands}
            </span>
            <span className="size-1 rounded-full bg-white/20" />
            <span>
              <strong className="font-semibold text-white">{categories.length}</strong> {t.categories}
            </span>
          </div>

          <Legend t={t} lang={lang} />
        </section>

        {/* Mobile category chips */}
        <nav
          aria-label={t.onThisPage}
          className="glass sticky top-[var(--header-h)] z-30 -mx-4 border-b border-white/[0.06] px-4 py-2.5 sm:-mx-6 sm:px-6 lg:hidden"
        >
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {visible.map((c) => {
              const Icon = categoryIcons[c.icon];
              const isActive = c.id === active;
              return (
                <a
                  key={c.id}
                  id={`chip-${c.id}`}
                  href={`#${c.id}`}
                  className={`chip text-sm ${
                    isActive ? "!border-violet-400/50 !bg-violet-500/20 text-white" : "text-white/65"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {c.title[lang]}
                  <span className="text-xs text-white/40">{c.commands.length}</span>
                </a>
              );
            })}
          </div>
        </nav>

        <div className="grid gap-10 pt-6 pb-24 lg:grid-cols-[16.5rem_1fr] lg:pt-2">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <nav aria-label={t.onThisPage} className="sticky top-[calc(var(--header-h)+1.5rem)]">
              <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-white/40 uppercase">
                {t.onThisPage}
              </p>
              <ul className="flex flex-col gap-0.5">
                {visible.map((c) => {
                  const Icon = categoryIcons[c.icon];
                  const isActive = c.id === active;
                  return (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        className={`relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-white/[0.06] text-white"
                            : "text-white/55 hover:bg-white/[0.03] hover:text-white/90"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-violet-400" />
                        )}
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1 truncate">{c.title[lang]}</span>
                        <span className="text-xs tabular-nums text-white/35">{c.commands.length}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0">
            {searching && (
              <p className="mb-6 text-sm text-white/50" aria-live="polite">
                {t.results(resultCount)}
              </p>
            )}

            {visible.length === 0 ? (
              <EmptyState t={t} onClear={() => setQuery("")} />
            ) : (
              <div className="flex flex-col gap-16">
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
          className="glass fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full border border-white/10 text-white/70 shadow-lg transition hover:text-white sm:right-6 sm:bottom-6"
        >
          <ArrowUp className="size-5" />
        </button>
      )}

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="toast glass fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-violet-400/30 px-4 py-2.5 text-sm whitespace-nowrap text-white shadow-2xl shadow-violet-900/40"
        >
          <Check className="size-4 text-emerald-400" />
          {toast.message}
        </div>
      )}
    </>
  );
}

function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <header className="glass sticky top-0 z-40 h-[var(--header-h)] border-b border-white/[0.06]">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href={`/${lang}/`} className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 font-display text-lg font-extrabold text-white shadow-lg shadow-violet-900/50">
            M
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display font-bold">maikodoglas</span>
            <span className="truncate text-xs text-white/45">{t.badge}</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div
            role="group"
            aria-label={t.language}
            className="flex rounded-full border border-white/10 bg-white/[0.04] p-0.5 text-xs font-semibold"
          >
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}/`}
                hrefLang={l === "pt" ? "pt-BR" : "en"}
                aria-current={l === lang ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  l === lang ? "bg-white text-black" : "text-white/60 hover:text-white"
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
            className="inline-flex items-center gap-2 rounded-full bg-twitch px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 sm:px-4"
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
    <div className="relative mt-8 w-full max-w-2xl">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-500/50 via-fuchsia-500/30 to-pink-500/50 opacity-60 blur-sm" />
      <div className="relative flex items-center rounded-2xl border border-white/10 bg-surface/95">
        <Search className="pointer-events-none absolute left-4 size-5 text-white/40" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchLabel}
          autoComplete="off"
          spellCheck={false}
          className="h-14 w-full rounded-2xl bg-transparent pr-24 pl-12 text-base text-white placeholder:text-white/35 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs text-white/80 transition hover:bg-white/15"
            >
              <X className="size-3.5" />
              {t.clear}
            </button>
          ) : (
            <kbd
              title={t.shortcut}
              className="hidden rounded-md border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-xs text-white/50 sm:block"
            >
              /
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}

function Legend({ t, lang }: { t: Dictionary; lang: Locale }) {
  return (
    <div className="mt-8 w-full max-w-2xl rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left">
      <p className="mb-3 text-xs font-semibold tracking-wider text-white/40 uppercase">{t.howTo}</p>
      <ul className="grid gap-2.5 text-sm text-white/65 sm:grid-cols-2">
        <li className="flex items-center gap-2.5">
          <span className="shrink-0 rounded-md bg-sky-400/10 px-1.5 py-0.5 font-mono text-xs text-sky-300">
            [{lang === "pt" ? "usuário" : "user"}]
          </span>
          {t.legendParam}
        </li>
        <li className="flex items-center gap-2.5">
          <span className="shrink-0 rounded-md border border-dashed border-sky-400/30 px-1.5 py-0.5 font-mono text-xs text-sky-300/80">
            [{lang === "pt" ? "usuário" : "user"}?]
          </span>
          {t.legendOptional}
        </li>
        <li className="flex items-center gap-2.5">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[0.7rem] font-bold text-emerald-300 ring-1 ring-emerald-400/25">
            <ShieldCheck className="size-3" />
            {t.mod}
          </span>
          {t.legendMod}
        </li>
        <li className="flex items-center gap-2.5">
          <span className="shrink-0 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-white">
            !cmd
          </span>
          {t.legendCopy}
        </li>
      </ul>
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
    <div className="grid gap-3 md:grid-cols-2">
      {commands.map((cmd) => (
        <CommandCard key={cmd.id} command={cmd} lang={lang} t={t} query={query} onCopy={onCopy} />
      ))}
    </div>
  );

  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`}>
      <div className="mb-6 flex items-start gap-4">
        <span
          className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ring-1 ring-white/10 ${categoryAccent[category.icon]}`}
        >
          <Icon className="size-6" />
        </span>
        <div className="min-w-0">
          <h2
            id={`${category.id}-title`}
            className="flex flex-wrap items-baseline gap-x-3 font-display text-2xl font-bold tracking-tight sm:text-3xl"
          >
            <a href={`#${category.id}`} className="hover:text-violet-200">
              {category.title[lang]}
            </a>
            <span className="font-sans text-sm font-medium text-white/35">
              {t.commandCount(category.commands.length)}
            </span>
          </h2>
          <p className="mt-1 text-pretty text-white/55">{category.desc[lang]}</p>
        </div>
      </div>

      {groups ? (
        <div className="flex flex-col gap-8">
          {groups.map((g) => (
            <div key={g.id}>
              <h3 className="mb-3 flex items-center gap-3 text-sm font-semibold tracking-wider text-white/45 uppercase">
                {g.title[lang]}
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
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-white/5">
        <Search className="size-6 text-white/40" />
      </div>
      <p className="font-display text-xl font-bold">{t.noResults}</p>
      <p className="mt-1 text-white/50">{t.noResultsHint}</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
      >
        {t.clear}
      </button>
    </div>
  );
}

function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-white/40 sm:flex-row sm:px-6 lg:px-8">
        <p>
          {t.footer} <span className="text-white/25">{t.footerNote}</span>
        </p>
        <a
          href={TWITCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition hover:text-white"
        >
          <TwitchIcon className="size-4" />
          twitch.tv/maikodoglas
        </a>
      </div>
    </footer>
  );
}
