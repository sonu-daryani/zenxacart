"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="bg-zencarta-surface py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <Mail className="mx-auto h-10 w-10 text-zencarta-green" />
        <h2 className="mt-4 text-2xl font-bold text-zencarta-navy sm:text-3xl">
          Stay in the Loop
        </h2>
        <p className="mt-2 text-zencarta-muted">
          Get exclusive deals, new arrivals, and shopping tips delivered to
          your inbox.
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-zencarta-green">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Thanks for subscribing!</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-zencarta-navy outline-none focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20 sm:min-w-[280px]"
            />
            <button
              type="submit"
              className="rounded-lg bg-zencarta-green px-6 py-3 text-sm font-semibold text-white uppercase transition-colors hover:bg-zencarta-green-dark"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
