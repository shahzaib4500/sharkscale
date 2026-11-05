"use client";
import { cn } from "@shared/lib/utils";
import { Loader2 } from "lucide-react";
import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes
} from "react";
import { createPortal } from "react-dom";

const FOCUSABLE = "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)";

export const inputClass =
  "w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-[15px] text-[#12141F] outline-none transition-colors placeholder:text-black/35 focus:border-[#2F5BFF] focus:ring-3 focus:ring-[#2F5BFF]/15 disabled:bg-black/4 disabled:text-black/50";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}

export function AdminButton({ variant = "primary", loading = false, className, children, disabled, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-primary text-white hover:bg-tertiary",
    secondary: "border border-black/12 bg-white text-[#12141F] hover:border-black/25",
    danger: "bg-[#e5484d] text-white hover:bg-[#cf3e43]",
    ghost: "text-[#12141F]/70 hover:bg-black/5 hover:text-[#12141F]"
  };
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4.5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        className
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}

export function AdminField({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-[#12141F]">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 block text-xs font-medium text-[#e5484d]">
          {error}
        </span>
      ) : (
        hint && <span className="mt-1.5 block text-xs leading-snug text-black/50">{hint}</span>
      )}
    </label>
  );
}

export function AdminInput({ className, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return <input {...props} aria-invalid={error || undefined} className={cn(inputClass, error && "border-[#e5484d]", className)} />;
}

export function AdminTextarea({ className, error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return <textarea {...props} aria-invalid={error || undefined} className={cn(inputClass, "resize-y", error && "border-[#e5484d]", className)} />;
}

export function AdminSelect({ className, error, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select {...props} aria-invalid={error || undefined} className={cn(inputClass, "appearance-auto", error && "border-[#e5484d]", className)}>
      {children}
    </select>
  );
}

export function AdminCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-[20px] border border-black/6 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]", className)}>{children}</div>;
}

export function Notice({ tone, children }: { tone: "success" | "error" | "muted"; children: ReactNode }) {
  const tones = { success: "text-[#1a7f4b]", error: "text-[#e5484d]", muted: "text-black/50" };
  return (
    <p aria-live="polite" className={cn("min-h-5 text-xs font-medium", tones[tone])}>
      {children}
    </p>
  );
}

interface DialogProps {
  title: string;
  message?: string;
  onClose: () => void;
  children: ReactNode;
}

/** An accessible modal: focus moves in and is trapped, Escape and clicking outside close it. */
export function AdminDialog({ title, message, onClose, children }: DialogProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const target = panel.current?.querySelector<HTMLElement>("input, select, textarea") ?? panel.current?.querySelector<HTMLElement>("button");
    target?.focus();
    return () => previousFocus?.focus?.();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panel.current) {
      return;
    }
    const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) {
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-tertiary/55 p-5 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-[22px] bg-white p-6 shadow-[0_30px_80px_-24px_rgba(27,10,80,0.6)] sm:p-7"
      >
        <h2 className="text-xl font-bold tracking-[-0.025em] text-[#12141F]">{title}</h2>
        {message && <p className="mt-2 text-sm leading-relaxed text-black/60">{message}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

/** A full-screen branded panel for sign-in and status messages. */
export function AdminScreen({ title, message, children, eyebrow }: { title?: string; message?: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-tertiary p-5">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-24 size-[36rem] rounded-full bg-[#2F5BFF]/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-24 size-[30rem] rounded-full bg-secondary/15 blur-3xl" />
      <div className="relative w-full max-w-md rounded-[22px] bg-white p-7 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.6)] sm:p-9">
        {eyebrow && <span className="inline-flex bg-secondary px-2 py-1 font-mono text-[11px] tracking-[0.12em] text-tertiary uppercase">{eyebrow}</span>}
        {title && <h1 className="mt-4 text-[28px] leading-tight font-extrabold tracking-[-0.04em] text-[#12141F]">{title}</h1>}
        {message && <p className="mt-2 text-[15px] leading-relaxed text-black/60">{message}</p>}
        {children}
      </div>
    </div>
  );
}
