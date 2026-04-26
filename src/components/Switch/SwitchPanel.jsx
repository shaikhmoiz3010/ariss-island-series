import { useState, useRef, useCallback, useEffect } from "react";
import DisplayRow          from "./DisplayRow";
import ButtonPanel         from "./ButtonPanel";
import { useMotion }       from "../../hooks/useMotion";
import { useDeviceStore }  from "../../state/useDeviceStore";
import { useCurtainMotor } from "../../hooks/useCurtainMotor";
import { useHousingTheme, useButtonTheme } from "../../state/useThemeStore";

const FOCUS_TIMEOUT = 6000;

// Slot ID → side mapping
const LEFT_IDS  = [0, 2, 4];
const RIGHT_IDS = [1, 3, 5];

export default function SwitchPanel() {
  const devices      = useDeviceStore(s => s.devices);
  const housingTheme = useHousingTheme();
  const buttonTheme  = useButtonTheme();

  useCurtainMotor(5);

  const { active: motionActive, trigger } = useMotion(6000);

  const [leftState,  setLeftStateRaw]  = useState("idle");
  const [rightState, setRightStateRaw] = useState("idle");
  const [hovered,    setHovered]       = useState(false);

  const leftTimer  = useRef(null);
  const rightTimer = useRef(null);

  // Track previous device types to detect changes
  const prevTypesRef = useRef({});

  // When any device's type changes, reset that side's display state to idle
  // so the stale display string (e.g. "dim") doesn't block the new type rendering
  useEffect(() => {
    const prev = prevTypesRef.current;
    let leftDirty  = false;
    let rightDirty = false;

    devices.forEach(d => {
      if (prev[d.id] !== undefined && prev[d.id] !== d.type) {
        if (LEFT_IDS.includes(d.id))  leftDirty  = true;
        if (RIGHT_IDS.includes(d.id)) rightDirty = true;
      }
      prev[d.id] = d.type;
    });

    if (leftDirty)  setLeftStateRaw("idle");
    if (rightDirty) setRightStateRaw("idle");
  }, [devices]);

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
    setLeftStateRaw(p  => p === "idle" ? "approach" : p);
    setRightStateRaw(p => p === "idle" ? "approach" : p);
  }, []);

  const handleMouseEnter = useCallback(() => {
    trigger();
    setHovered(true);
  }, [trigger]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setLeftStateRaw(p  => p === "approach" ? "idle" : p);
    setRightStateRaw(p => p === "approach" ? "idle" : p);
  }, []);

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
      className="relative flex-shrink-0 m-[2px] sm:m-[23px] md:m-[30px] lg:m-[40px] h-[322px] rounded-[30px] shadow-[5px_7px_3px_3px_rgba(0,0,0,0.18)]"
      style={{
        background: housingTheme?.bg ?? "#ffffff",
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