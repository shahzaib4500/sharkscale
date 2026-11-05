"use client";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast.success("You're on the list!");
      setEmail("");
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-w-62.5">
      <h2 className="text-[clamp(26px,2.9vw,40px)] leading-[1.05] font-bold tracking-[-0.035em] text-white">Get the playbook</h2>

      <form onSubmit={handleSubmit} className="mt-8 flex max-w-105 items-center gap-0 border-b border-dashed border-white/35 pb-2">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/45"
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-3.5 bg-white/15 px-4.5 py-3.5 font-mono text-xs tracking-[0.14em] text-white uppercase transition-colors hover:bg-white/25 disabled:opacity-60"
        >
          Sign up <ArrowRight className="size-3.5" />
        </button>
      </form>

      <p className="mt-5 max-w-[36ch] text-[13.5px] leading-relaxed text-white/60">One email a month. The flow teardowns we send clients, nothing else.</p>
    </div>
  );
}
