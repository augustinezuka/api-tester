"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface DarkLightToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function DarkLightToggle({
  className,
  size = "md",
}: DarkLightToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Cycle through modes: light → dark → system
  const modes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
  //eslint-disable-next-line
  const currentIndex = modes.indexOf(theme as any);
  const nextMode = modes[(currentIndex + 1) % modes.length];

  const handleToggle = () => setTheme(nextMode);

  // Resolve actual applied theme (needed for UI feedback when in "system")
  const effectiveTheme =
    theme === "system"
      ? (systemTheme as "light" | "dark")
      : (theme as "light" | "dark");

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const labels = {
    light: "Light",
    dark: "Dark",
    system: "System",
  };

  const icons = {
    light: <Sun className="w-full h-full" />,
    dark: <Moon className="w-full h-full" />,
    system: <Monitor className="w-full h-full" />,
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        className,
      )}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={false}
        animate={{
          backgroundColor:
            effectiveTheme === "dark"
              ? "#1e293b"
              : effectiveTheme === "light"
                ? "#fbbf24"
                : "#10b981", // green hint for system
          opacity: 0.1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Icon */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className={cn("flex-shrink-0", iconSizes[size])}
          initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {icons[theme as "light" | "dark" | "system"]}
        </motion.div>
      </AnimatePresence>

      {/* Label */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            className="block font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {labels[theme as "light" | "dark" | "system"]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Dot indicator */}
      <motion.div
        className="w-2 h-2 rounded-full"
        animate={{
          backgroundColor:
            effectiveTheme === "dark"
              ? "#64748b"
              : effectiveTheme === "light"
                ? "#f59e0b"
                : "#10b981",
          scale: [1, 1.3, 1],
        }}
        transition={{
          backgroundColor: { duration: 0.3, ease: "easeInOut" },
          scale: { duration: 0.2, ease: "easeInOut" },
        }}
      />
    </motion.button>
  );
}
