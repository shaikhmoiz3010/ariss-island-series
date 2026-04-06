// FILE: src/hooks/useClock.js
// Returns live time string, updates every second
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";

export function useClock() {
  const getTime = () => {
    const n = new Date();
    const h = n.getHours() % 12 || 12;
    const m = String(n.getMinutes()).padStart(2, "0");
    const ap = n.getHours() >= 12 ? "PM" : "AM";
    return { h, m, ap };
  };

  const [time, setTime] = useState(getTime);
  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}
