import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-glow hover:bg-indigo-500 border border-white/10",
  secondary:
    "bg-surface-elevated text-ink border border-surface-border hover:border-white/15",
  ghost: "text-ink-muted hover:text-ink hover:bg-white/5",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: Omit<ComponentProps<typeof motion.button>, "children"> & { variant?: Variant; children: ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
