import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "glass rounded-2xl p-6 shadow-card",
        hover && "transition-shadow hover:shadow-[0_20px_60px_-15px_oklch(0.78_0.16_200/0.3)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
