"use client";

import { Box, Headphones, Shield, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { IconFeature } from "@/components/ui/IconFeature";
import { Reveal } from "@/components/motion/Reveal";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const icons = { box: Box, truck: Truck, shield: Shield, headphones: Headphones };

const features = [
  { icon: "box" as const, title: "Top Quality", subtitle: "Premium Products" },
  { icon: "truck" as const, title: "Fast Shipping", subtitle: "Across the USA" },
  { icon: "shield" as const, title: "Secure Payments", subtitle: "100% Protected" },
  { icon: "headphones" as const, title: "24/7 Support", subtitle: "We're Here to Help" },
];

export function HeroFeatures() {
  return (
    <div className="border-t border-slate-100 bg-white py-8 dark:border-[#1f3524] dark:bg-[#0e1c12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal
          variants={staggerContainer}
          className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeInUp} className="group">
              <IconFeature icon={icons[f.icon]} title={f.title} subtitle={f.subtitle} />
            </motion.div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
