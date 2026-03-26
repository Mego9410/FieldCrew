"use client";

import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  role: string;
  topic: "support" | "onboarding" | "partnership" | "general";
  message: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  topic: "support",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Unable to submit form.");
      }

      setStatus("success");
      setForm(INITIAL_STATE);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unable to submit form.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-fc-border bg-white p-6 shadow-fc-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-fc-brand">Name</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="rounded-md border border-fc-border bg-white px-3 py-2.5 text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
            placeholder="Your name"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-fc-brand">Work email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="rounded-md border border-fc-border bg-white px-3 py-2.5 text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
            placeholder="you@company.com"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-fc-brand">Company</span>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            className="rounded-md border border-fc-border bg-white px-3 py-2.5 text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
            placeholder="Company name"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-fc-brand">Your role</span>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            className="rounded-md border border-fc-border bg-white px-3 py-2.5 text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
            placeholder="Owner, Ops Manager, Admin..."
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-fc-brand">Topic</span>
        <select
          value={form.topic}
          onChange={(e) =>
            setForm((p) => ({ ...p, topic: e.target.value as FormState["topic"] }))
          }
          className="rounded-md border border-fc-border bg-white px-3 py-2.5 text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
        >
          <option value="support">Support</option>
          <option value="onboarding">Onboarding</option>
          <option value="partnership">Partnership</option>
          <option value="general">General</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-fc-brand">Message</span>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className="rounded-md border border-fc-border bg-white px-3 py-2.5 text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
          placeholder="Tell us what you need and what outcome you are aiming for."
        />
      </label>

      {status === "success" ? (
        <p className="text-sm text-green-700">Thanks. Your message was sent successfully.</p>
      ) : null}
      {status === "error" ? <p className="text-sm text-red-700">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-fc-accent px-6 py-3 text-sm font-semibold text-white hover:bg-fc-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
