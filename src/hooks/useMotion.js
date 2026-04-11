import { useState, useCallback, useRef } from "react";

export function useMotion(timeout = 8000) {
  const [active, setActive] = useState(false);
  const timer = useRef(null);

  const trigger = useCallback(() => {
    setActive(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(false), timeout);
  }, [timeout]);

  return { active, trigger };
}