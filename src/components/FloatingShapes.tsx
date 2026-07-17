"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

type FloatingShapesProps = {
  className?: string;
};

type Shape = {
  size: number;
  top: string;
  left: string;
  color: string;
  rotate: number;
  speed: "slow" | "normal";
  opacity: number;
};

const SHAPES: Shape[] = [
  { size: 120, top: "8%", left: "6%", color: "#ffd93d", rotate: 12, speed: "slow", opacity: 0.55 },
  { size: 80, top: "62%", left: "10%", color: "#ff8fa3", rotate: -20, speed: "normal", opacity: 0.5 },
  { size: 150, top: "18%", left: "78%", color: "#ff6b6b", rotate: 30, speed: "slow", opacity: 0.32 },
  { size: 64, top: "74%", left: "82%", color: "#9caf88", rotate: -10, speed: "normal", opacity: 0.5 },
  { size: 42, top: "40%", left: "48%", color: "#ffd93d", rotate: 8, speed: "normal", opacity: 0.7 },
];

export function FloatingShapes({ className }: FloatingShapesProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {SHAPES.map((s, i) => (
        <FloatingBlob key={i} shape={s} />
      ))}
    </div>
  );
}

function FloatingBlob({ shape }: { shape: Shape }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      className="absolute rounded-[42%_58%_55%_45%/48%_42%_58%_52%] blur-[1px]"
      style={{
        width: shape.size,
        height: shape.size,
        top: shape.top,
        left: shape.left,
        background: shape.color,
        opacity: shape.opacity,
      }}
      animate={{
        y: [0, -26, 0],
        x: [0, 14, 0],
        rotate: [shape.rotate, shape.rotate + 12, shape.rotate],
      }}
      transition={{
        duration: shape.speed === "slow" ? 13 : 9,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function SoftBlur({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
