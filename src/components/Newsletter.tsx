"use client";

import { useState } from "react";
import { Mail, CheckCircle, Sparkles } from "lucide-react";
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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variants={fadeInUp}>
          <div className="relative overflow-hidden rounded-3xl bg-zencarta-navy px-6 py-12 sm:px-12 sm:py-14">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-zencarta-green/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-zencarta-green-light/10 blur-3xl"
              aria-hidden
            />

            <div className="relative mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zencarta-green/20 text-zencarta-green-light">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                Stay in the Loop
              </h2>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
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
                    className="mt-8 flex items-center justify-center gap-2 text-zencarta-green-light"
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
                    className="mt-8 flex flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-slate-400 outline-none backdrop-blur-sm transition-colors focus:border-zencarta-green-light focus:bg-white/15 focus:ring-2 focus:ring-zencarta-green-light/30"
                    />
                    <button
                      type="submit"
                      className="group flex items-center justify-center gap-2 rounded-xl bg-zencarta-green px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zencarta-green-dark"
                    >
                      <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
                      Subscribe
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <p className="mt-4 text-xs text-slate-400">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
