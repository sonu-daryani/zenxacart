"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { fadeInUp } from "@/lib/motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="bg-zencarta-surface py-16">
      <Reveal
        variants={fadeInUp}
        className="mx-auto max-w-2xl px-4 text-center sm:px-6"
      >
        <Mail className="mx-auto h-10 w-10 text-zencarta-green" />
        <h2 className="mt-4 text-2xl font-bold text-zencarta-navy sm:text-3xl dark:text-slate-100">
          Stay in the Loop
        </h2>
        <p className="mt-2 text-zencarta-muted">
          Get exclusive deals, new arrivals, and shopping tips delivered to
          your inbox.
        </p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex items-center justify-center gap-2 text-zencarta-green"
            >
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
              >
                <CheckCircle className="h-5 w-5" />
              </motion.span>
              <span className="font-medium">Thanks for subscribing!</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-zencarta-navy outline-none focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20 sm:min-w-[280px] dark:border-[#2a4530] dark:bg-[#16281b] dark:text-slate-100"
              />
              <button
                type="submit"
                className="rounded-lg bg-zencarta-green px-6 py-3 text-sm font-semibold text-white uppercase transition-colors hover:bg-zencarta-green-dark"
              >
                Subscribe
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
