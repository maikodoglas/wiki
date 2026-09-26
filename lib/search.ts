import { argLabels, type Category, type Command } from "./commands";
import type { Locale } from "./i18n";

export function normalize(s: string) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function haystack(cmd: Command, category: Category, lang: Locale) {
  const args = (cmd.args ?? []).map((a) => argLabels[typeof a === "string" ? a : a.key][lang]);
  const group = category.groups?.find((g) => g.id === cmd.group)?.title[lang] ?? "";
  return normalize(
    [...cmd.names, cmd.desc[lang], ...args, category.title[lang], group].join(" "),
  );
}

/** Every whitespace-separated term must appear somewhere in the command. */
export function filterCategories(categories: Category[], query: string, lang: Locale) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return categories;
  return categories
    .map((category) => ({
      ...category,
      commands: category.commands.filter((cmd) => {
        const text = haystack(cmd, category, lang);
        return terms.every((term) => text.includes(term));
      }),
    }))
    .filter((c) => c.commands.length > 0);
}
