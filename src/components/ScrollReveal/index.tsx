"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  id?: string;
};

// A single, subtle fade-and-rise the first time a section enters the viewport.
// Kept intentionally simple — no continuous scroll-linked tilt/scale — so the
// page reads as calm scrolling rather than a constantly-animating surface.
export const ScrollReveal = ({
  children,
  className = "",
  style,
  delay = 0,
  id,
}: ScrollRevealProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default ScrollReveal;

export const StaggerContainer = ({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};
