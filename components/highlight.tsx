import { Fragment } from "react";
import { normalize } from "@/lib/search";

/** Wraps parts of `text` matching any query term in <mark>, accent-insensitive. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return <>{text}</>;

  // normalize() keeps string length for latin text, so indexes line up.
  const haystack = normalize(text);
  if (haystack.length !== text.length) return <>{text}</>;

  const marked = new Array<boolean>(text.length).fill(false);
  for (const term of terms) {
    let i = haystack.indexOf(term);
    while (i !== -1) {
      marked.fill(true, i, i + term.length);
      i = haystack.indexOf(term, i + term.length);
    }
  }

  const parts: { text: string; mark: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    const last = parts.at(-1);
    if (last && last.mark === marked[i]) last.text += text[i];
    else parts.push({ text: text[i], mark: marked[i] });
  }

  return (
    <>
      {parts.map((p, i) =>
        p.mark ? <mark key={i}>{p.text}</mark> : <Fragment key={i}>{p.text}</Fragment>,
      )}
    </>
  );
}
