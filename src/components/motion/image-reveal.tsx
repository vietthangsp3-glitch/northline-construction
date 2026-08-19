"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealDirection = "left" | "right" | "up" | "down";

interface ImageRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
}

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  left: { x: -72, y: 0 },
  right: { x: 72, y: 0 },
  up: { x: 0, y: 64 },
  down: { x: 0, y: -64 },
};

export function ImageReveal({ children, direction = "up", delay = 0 }: ImageRevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = offsets[direction];

  return (
    <motion.div
      className="scroll-image-reveal"
      initial={reduceMotion ? false : { opacity: 0, x: offset.x, y: offset.y, scale: 0.965 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.05, margin: "120px 0px" }}
      transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
