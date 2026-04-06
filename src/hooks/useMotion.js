// FILE: src/hooks/useMotion.js
// Detects mouse enter on the switch.
// Returns { active, handleMouseEnter }
// active=true  → show approach screens
// active=false → show idle screens
// ─────────────────────────────────────────────
import { useState, useCallback, useRef } from "react";

export function useMotion(timeout = 8000) {
  const [active, setActive] = useState(false);
  const timer = useRef(null);

  const handleMouseEnter = useCallback(() => {
    setActive(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(false), timeout);
  }, [timeout]);

  return { active, handleMouseEnter };
}