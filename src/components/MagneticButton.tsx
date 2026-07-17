"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "gradient" | "outline";
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "gradient",
  className = "",
  type = "button",
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 14, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 14, mass: 0.4 });

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    mx.set(relX * 0.35);
    my.set(relY * 0.35);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-shadow will-change-transform";
  const styles =
    variant === "gradient"
      ? "text-white shadow-soft bg-[linear-gradient(120deg,#ff6b6b_0%,#ffd93d_55%,#ff8fa3_100%)] hover:shadow-lift"
      : "text-charcoal border border-charcoal/15 bg-white/40 hover:border-charcoal/30 hover:bg-white/70";

  const inner = (
    <motion.span
      ref={ref}
      className={`${base} ${styles} ${className}`}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} onClick={onClick} className="inline-block">
        {inner}
      </a>
    );
  }

  return (
    <button type={type} aria-label={ariaLabel} onClick={onClick} className="inline-block">
      {inner}
    </button>
  );
}
