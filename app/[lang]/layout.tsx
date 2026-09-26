import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { htmlLang, isLocale, locales, ui } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = ui[lang];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      type: "website",
      locale: htmlLang[lang].replace("-", "_"),
    },
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [htmlLang[l], `../${l}/`]),
      ),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0914",
  colorScheme: "dark",
};

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={htmlLang[lang]} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
