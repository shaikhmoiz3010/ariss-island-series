import { useState, useRef, useCallback } from "react";
import DisplayRow        from "./DisplayRow";
import ButtonPanel       from "./ButtonPanel";
import { useMotion }       from "../../hooks/useMotion";
import { useDeviceStore }  from "../../state/useDeviceStore";
import { useCurtainMotor } from "../../hooks/useCurtainMotor";
import { useHousingTheme, useButtonTheme } from "../../state/useThemeStore";

const FOCUS_TIMEOUT =994000;

export default function SwitchPanel() {
  const devices      = useDeviceStore((s) => s.devices);
  const housingTheme = useHousingTheme();
  const buttonTheme  = useButtonTheme();
  useCurtainMotor(5);

  const { active: motionActive, trigger } = useMotion(906000);

  const [leftState,  setLeftStateRaw]  = useState("idle");
  const [rightState, setRightStateRaw] = useState("idle");
  const [hovered,    setHovered]       = useState(false);
  const leftTimer  = useRef(null);
  const rightTimer = useRef(null);

const setLeftState = useCallback((s) => {
  setLeftStateRaw(s);
  clearTimeout(leftTimer.current);
  if (s !== "idle" && s !== "approach") {
    leftTimer.current = setTimeout(() => setLeftStateRaw("idle"), FOCUS_TIMEOUT);
  }
}, []);

const setRightState = useCallback((s) => {
  setRightStateRaw(s);
  clearTimeout(rightTimer.current);
  if (s !== "idle" && s !== "approach") {
    rightTimer.current = setTimeout(() => setRightStateRaw("idle"), FOCUS_TIMEOUT);
  }
}, []);

  const onActivity = useCallback(() => {
    setLeftStateRaw((p)  => p === "idle" ? "approach" : p);
    setRightStateRaw((p) => p === "idle" ? "approach" : p);
  }, []);

  /* ── use the callbacks, not inline arrows ── */
  const handleMouseEnter = useCallback(() => {
    trigger();
    setHovered(true);
  }, [trigger]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    /* only snap back if no focused interaction is active */
    setLeftStateRaw((p)  => p === "approach" ? "idle" : p);
    setRightStateRaw((p) => p === "approach" ? "idle" : p);
  }, []);

  /* ── hovered is used directly here — no raw state needed for approach ── */
  const effectiveLeft = (() => {
    if (leftState !== "idle" && leftState !== "approach") return leftState;
    if (hovered || motionActive) return "approach";
    return "idle";
  })();

  const effectiveRight = (() => {
    if (rightState !== "idle" && rightState !== "approach") return rightState;
    if (hovered || motionActive) return "approach";
    return "idle";
  })();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="m-[2px] md:m-[30px] lg:m-[40px] sm:m-[23px] h-[322px] rounded-[30px]"
      style={{
        position:   "relative",
        flexShrink: 0,
        background: housingTheme?.bg ?? "#ffffff",
        boxShadow:  "5px 7px 3px 3px rgba(0,0,0,0.18)",
      }}
    >
      <DisplayRow
        leftState={effectiveLeft}
        rightState={effectiveRight}
        devices={devices}
      />
      <ButtonPanel
        setLeftState={setLeftState}
        setRightState={setRightState}
        onActivity={onActivity}
        onMotion={trigger}
        buttonTheme={buttonTheme}
      />
    </div>
  );
}