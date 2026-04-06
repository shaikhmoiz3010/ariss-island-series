// FILE: src/hooks/usePointer.js
// Handles tap / double-tap / hold on a button half.
// Returns { bind } — spread onto the target element.
// ─────────────────────────────────────────────
import { useRef, useCallback } from "react";

const HOLD_DELAY = 500;
const DBL_WINDOW = 380;

export function usePointer({ onTap, onDoubleTap, onHoldStart, onHoldEnd }) {
  const t0 = useRef(0);
  const holdTimer = useRef(null);
  const dblTimer = useRef(null);
  const lastTap = useRef(0);
  const isHolding = useRef(false);

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    t0.current = Date.now();
    isHolding.current = false;

    holdTimer.current = setTimeout(() => {
      isHolding.current = true;
      onHoldStart?.();
    }, HOLD_DELAY);
  }, [onHoldStart]);

  const onPointerUp = useCallback(() => {
    clearTimeout(holdTimer.current);
    if (isHolding.current) {
      isHolding.current = false;
      onHoldEnd?.();
      return;
    }
    if (Date.now() - t0.current >= HOLD_DELAY) return;

    const now = Date.now();
    if (lastTap.current && now - lastTap.current < DBL_WINDOW) {
      clearTimeout(dblTimer.current);
      lastTap.current = 0;
      onDoubleTap?.();
    } else {
      lastTap.current = now;
      dblTimer.current = setTimeout(() => {
        if (lastTap.current === now) onTap?.();
      }, 220);
    }
  }, [onTap, onDoubleTap, onHoldEnd]);

  const onPointerCancel = useCallback(() => {
    clearTimeout(holdTimer.current);
    isHolding.current = false;
    onHoldEnd?.();
  }, [onHoldEnd]);

  return { onPointerDown, onPointerUp, onPointerCancel };
}
