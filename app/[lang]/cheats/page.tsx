import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cheats } from "@/components/cheats";
import { isLocale, ui } from "@/lib/i18n";

// Hidden page: not linked from the wiki and kept out of search engines.
export async function generateMetadata({ params }: PageProps<"/[lang]/cheats">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: ui[lang].cheatsMetaTitle,
    description: ui[lang].cheatsMetaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: PageProps<"/[lang]/cheats">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <Cheats lang={lang} />;
}
