"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { LANG_STORAGE_KEY } from "@/lib/storage";

function preferredLocale(): Locale {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && isLocale(saved)) return saved;
  } catch {}
  const browser = navigator.languages?.[0] ?? navigator.language ?? "";
  if (browser.toLowerCase().startsWith("pt")) return "pt";
  return browser ? "en" : defaultLocale;
}

export function LanguageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${preferredLocale()}/${window.location.hash}`);
  }, [router]);

  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="size-10 animate-spin rounded-full border-2 border-white/15 border-t-violet-400" />
        <div className="flex gap-3 text-sm">
          <Link href="/pt/" className="chip">
            Português
          </Link>
          <Link href="/en/" className="chip">
            English
          </Link>
        </div>
      </div>
    </main>
  );
}
