import { notFound } from "next/navigation";
import { Wiki } from "@/components/wiki";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <Wiki lang={lang} />;
}
