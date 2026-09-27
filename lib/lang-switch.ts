/**
 * Keeps the reader's place when switching languages. Text lengths differ
 * between languages, so we anchor on the card at the top of the screen
 * rather than restoring the raw scroll offset.
 */
const KEY = "maiko-wiki-lang-switch";

export type SavedPosition = { id: string | null; top: number; scrollY: number; query: string };

export function rememberPosition(query: string) {
  const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
  let anchor: HTMLElement | null = null;
  if (window.scrollY > 200) {
    for (const el of document.querySelectorAll<HTMLElement>(".cmd-card, section h2[id], [data-anchor]")) {
      if (el.getBoundingClientRect().bottom > headerBottom + 80) {
        anchor = el;
        break;
      }
    }
  }
  const saved: SavedPosition = {
    id: anchor?.id ?? null,
    top: anchor?.getBoundingClientRect().top ?? 0,
    scrollY: window.scrollY,
    query,
  };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(saved));
  } catch {}
}

export function peekSavedPosition(): SavedPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedPosition) : null;
  } catch {
    return null;
  }
}

export function clearSavedPosition() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}

export function restorePosition(saved: SavedPosition) {
  const el = saved.id ? document.getElementById(saved.id) : null;
  const top = el ? el.getBoundingClientRect().top + window.scrollY - saved.top : saved.scrollY;
  window.scrollTo({ top, behavior: "instant" });
}
