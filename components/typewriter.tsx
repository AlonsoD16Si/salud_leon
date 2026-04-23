"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  phrases: string[];
};

export function Typewriter({ phrases }: TypewriterProps) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex] ?? "";
    const delay = deleting ? 35 : 65;

    const timeout = window.setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setDeleting(false);
          window.setTimeout(() => setDeleting(true), 900);
        }
      } else {
        const next = current.slice(0, Math.max(0, text.length - 1));
        setText(next);
        if (next.length === 0) {
          setDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, phraseIndex, phrases, text.length]);

  return (
    <p className="text-base text-slate-700 sm:text-lg">
      {text}
      <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-emerald-600 align-middle" />
    </p>
  );
}
