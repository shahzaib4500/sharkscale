"use client";
import { inputClass } from "@features/blog/admin/components/AdminUi";
import { matchesSearch } from "@features/blog/lib/blogUtils";
import { cn } from "@shared/lib/utils";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export interface SearchSelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SearchSelectProps {
  name: string;
  label: string;
  value: string;
  options: SearchSelectOption[];
  onChange: (value: string) => void;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
}

/** A dropdown with a search box, for picking from a list that may grow long. */
export default function SearchSelect({ name, label, value, options, onChange, searchPlaceholder, emptyText, disabled = false }: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];
  const filtered = options.filter((option) => matchesSearch({ title: option.label, category: option.hint ?? "" }, query));

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    search.current?.focus();
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const openList = () => {
    setQuery("");
    setActiveIndex(
      Math.max(
        0,
        options.findIndex((option) => option.value === value)
      )
    );
    setOpen(true);
  };

  const choose = (option: SearchSelectOption | undefined) => {
    if (!option) {
      return;
    }
    setOpen(false);
    if (option.value !== value) {
      onChange(option.value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(filtered[activeIndex]);
    } else if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        name={name}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        className={cn(inputClass, "flex items-center justify-between gap-3 text-left disabled:cursor-not-allowed")}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className={cn("size-4 flex-none text-black/45 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_24px_60px_-20px_rgba(27,10,80,0.35)]">
          <div className="flex items-center gap-2 border-b border-black/8 px-3.5">
            <Search className="size-4 flex-none text-black/40" aria-hidden />
            <input
              ref={search}
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-activedescendant={filtered[activeIndex] ? `${listId}-${activeIndex}` : undefined}
              aria-label={searchPlaceholder}
              name={`${name}Search`}
              autoComplete="off"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent py-3 text-[15px] text-[#12141F] outline-none placeholder:text-black/35"
            />
          </div>
          <ul id={listId} role="listbox" aria-label={label} className="max-h-72 overflow-y-auto p-1.5">
            {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-black/50">{emptyText}</li>}
            {filtered.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value || "none"}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5", index === activeIndex && "bg-[#f6f5f2]")}
                >
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[14px] text-[#12141F]", isSelected && "font-semibold")}>{option.label}</span>
                    {option.hint && <span className="block truncate text-xs text-black/45">{option.hint}</span>}
                  </span>
                  {isSelected && <Check className="size-4 flex-none text-primary" aria-hidden />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
