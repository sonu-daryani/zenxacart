"use client";

import { Headphones, ShieldCheck, Truck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const items = [
  { icon: ShieldCheck, title: "Quality You Can Trust", subtitle: "Premium products only" },
  { icon: Truck, title: "Fast Delivery", subtitle: "On time, every time" },
  { icon: Users, title: "Happy Customers", subtitle: "Join our growing family" },
  { icon: Headphones, title: "24/7 Support", subtitle: "We're here to help" },
];

export function TrustStrip() {
  return (
    <section className="border-t border-slate-100 bg-white py-10 dark:border-[#1f3524] dark:bg-[#0e1c12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal
          variants={staggerContainer}
          className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4"
        >
          {items.map(({ icon: Icon, title, subtitle }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-zencarta-surface/80 dark:hover:bg-[#16281b]/60"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zencarta-green/10 text-zencarta-green transition-all duration-300 group-hover:scale-105 group-hover:bg-zencarta-green group-hover:text-white group-hover:shadow-lg group-hover:shadow-zencarta-green/25">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zencarta-navy dark:text-slate-100">
                  {title}
                </p>
                <p className="text-xs text-zencarta-muted">{subtitle}</p>
              </div>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
