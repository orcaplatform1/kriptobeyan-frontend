"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface CustomSelectOption {
  value: string;
  label: ReactNode;
}

// Native <select>'in acilir listesi tarayici/OS tarafindan cizilir ve CSS'le
// (accent-color disinda) neredeyse hic kontrol edilemez — bazi Android
// Chrome surumlerinde sistemin varsayilan mavi/lacivert vurgusuyla aciliyor,
// site paletiyle uyusmuyordu (bkz. kullanici raporu). Bu bilerek elle
// yazilmis, tamamen kendi CSS'imizle cizilen bir dropdown.
export function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  disabled,
  renderValue,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  className?: string;
  disabled?: boolean;
  renderValue?: (option: CustomSelectOption | undefined) => ReactNode;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 text-left outline-none disabled:opacity-60 ${className}`}
      >
        <span className="truncate">{renderValue ? renderValue(selected) : (selected?.label ?? value)}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-64 w-full min-w-max overflow-y-auto rounded-lg border border-gold/25 bg-parchment py-1 shadow-lg"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-cream ${
                  option.value === value ? "bg-cream font-semibold text-gold-deep" : "text-ink"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
