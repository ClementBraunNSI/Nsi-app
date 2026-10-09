"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SuggestPage = {
  path: string;
  title: string;
  levelLabel: string;
  chapter?: string;
  privateLesson?: boolean;
};

function fold(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function PageSuggest({
  label,
  pages,
  text,
  onChange,
}: {
  label: string;
  pages: SuggestPage[];
  text: string;
  onChange: (next: { text: string; path: string }) => void;
}) {
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const suggestions = useMemo(() => {
    const needle = fold(text.trim());
    if (!needle) return [];
    return pages
      .filter((page) => fold(`${page.title} ${page.levelLabel} ${page.chapter || ""}`).includes(needle))
      .slice(0, 8);
  }, [pages, text]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (page: SuggestPage) => {
    onChange({ text: page.title, path: page.path });
    setOpen(false);
    setActive(-1);
  };

  return (
    <div ref={boxRef} className="relative">
      <label className="mb-1 block text-xs font-semibold text-slate-500">{label}</label>
      <input
        value={text}
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Titre d’une page du site"
        onChange={(event) => {
          onChange({ text: event.target.value, path: "" });
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (!open || suggestions.length === 0) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((current) => (current + 1) % suggestions.length);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
          } else if (event.key === "Enter" && active >= 0) {
            event.preventDefault();
            choose(suggestions[active]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
      />
      {open && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {suggestions.map((page, index) => (
            <li key={page.path} role="option" aria-selected={index === active}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(page)}
                onMouseEnter={() => setActive(index)}
                className={`block w-full px-3 py-2 text-left text-sm ${index === active ? "bg-orange-50" : "hover:bg-slate-50"}`}
              >
                <span className="font-medium text-slate-800">{page.title}</span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {page.privateLesson ? "Particulier · " : ""}
                  {page.levelLabel}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
