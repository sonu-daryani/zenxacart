"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInUp } from "@/lib/motion";

export function Reveal({
  children,
  className,
  variants = fadeInUp,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
