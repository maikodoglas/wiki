export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export type Localized = Record<Locale, string>;

export const defaultLocale: Locale = "pt";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en" };

export const TWITCH_URL = "https://www.twitch.tv/maikodoglas";

export const ui = {
  pt: {
    metaTitle: "Comandos da live — maikodoglas",
    metaDescription:
      "Todos os comandos do chat da live do maikodoglas na Twitch: música, text to speech, Stream Avatars, Pokémon e mais.",
    badge: "Wiki de comandos",
    heroTitle: "Todos os comandos da live,",
    heroHighlight: "num só lugar.",
    heroText:
      "Pesquise, entenda o que cada comando faz e copie direto para o chat da Twitch.",
    searchPlaceholder: "Buscar… ex: música, pokémon, !sr",
    searchLabel: "Buscar comandos",
    clear: "Limpar",
    watchLive: "Assistir na Twitch",
    watchLiveShort: "Twitch",
    commands: "comandos",
    commandCount: (n: number) => `${n} ${n === 1 ? "comando" : "comandos"}`,
    categories: "categorias",
    results: (n: number) => `${n} ${n === 1 ? "resultado" : "resultados"}`,
    copy: "Copiar",
    copied: "Copiado!",
    copiedCommand: (c: string) => `${c} copiado — cole no chat!`,
    copiedLink: "Link do comando copiado!",
    copyLink: "Copiar link deste comando",
    aliases: "Também funciona com",
    example: "Exemplo",
    examples: "Exemplos",
    openLink: "Abrir link",
    mod: "MOD",
    modTitle: "Apenas moderadores",
    optional: "opcional",
    noResults: "Nenhum comando encontrado",
    noResultsHint: "Tente outra palavra, ou limpe a busca para ver tudo.",
    howTo: "Como ler os comandos",
    legendParam: "Parâmetro: o que você escreve depois do comando",
    legendOptional: "Parâmetro opcional",
    legendMod: "Só moderadores podem usar",
    legendCopy: "Clique em qualquer comando para copiar",
    onThisPage: "Categorias",
    language: "Idioma",
    backToTop: "Voltar ao topo",
    footer: "Feito pela comunidade, para a comunidade.",
    footerNote: "Não afiliado à Twitch.",
    shortcut: "para buscar",
  },
  en: {
    metaTitle: "Stream commands — maikodoglas",
    metaDescription:
      "Every chat command on maikodoglas's Twitch stream: music, text to speech, Stream Avatars, Pokémon and more.",
    badge: "Command wiki",
    heroTitle: "Every stream command,",
    heroHighlight: "in one place.",
    heroText:
      "Search, learn what each command does and copy it straight into Twitch chat.",
    searchPlaceholder: "Search… e.g. music, pokémon, !sr",
    searchLabel: "Search commands",
    clear: "Clear",
    watchLive: "Watch on Twitch",
    watchLiveShort: "Twitch",
    commands: "commands",
    commandCount: (n: number) => `${n} ${n === 1 ? "command" : "commands"}`,
    categories: "categories",
    results: (n: number) => `${n} ${n === 1 ? "result" : "results"}`,
    copy: "Copy",
    copied: "Copied!",
    copiedCommand: (c: string) => `${c} copied — paste it in chat!`,
    copiedLink: "Command link copied!",
    copyLink: "Copy link to this command",
    aliases: "Also works with",
    example: "Example",
    examples: "Examples",
    openLink: "Open link",
    mod: "MOD",
    modTitle: "Moderators only",
    optional: "optional",
    noResults: "No commands found",
    noResultsHint: "Try another word, or clear the search to see everything.",
    howTo: "How to read commands",
    legendParam: "Parameter: what you type after the command",
    legendOptional: "Optional parameter",
    legendMod: "Only moderators can use it",
    legendCopy: "Click any command to copy it",
    onThisPage: "Categories",
    language: "Language",
    backToTop: "Back to top",
    footer: "Made by the community, for the community.",
    footerNote: "Not affiliated with Twitch.",
    shortcut: "to search",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export type Dictionary = (typeof ui)[Locale];
