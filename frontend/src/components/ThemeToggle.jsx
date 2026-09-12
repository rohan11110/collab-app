import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ compact = false }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center justify-center rounded-xl border border-border/70 bg-card/80 text-muted-foreground transition hover:bg-muted hover:text-foreground ${compact ? "h-9 w-9" : "h-10 w-10"}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={isDark ? "sun" : "moon"} initial={{ opacity: 0, rotate: -45, scale: .75 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 45, scale: .75 }} transition={{ duration: .16 }}>
          {isDark ? <Sun size={compact ? 16 : 17}/> : <Moon size={compact ? 16 : 17}/>} 
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
