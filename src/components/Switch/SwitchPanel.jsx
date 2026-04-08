import { useState, useRef, useCallback } from "react";
import DisplayRow  from "./DisplayRow";
import ButtonPanel from "./ButtonPanel";
import { useMotion }       from "../../hooks/useMotion";
import { useDeviceStore }  from "../../state/useDeviceStore";
import { useCurtainMotor } from "../../hooks/useCurtainMotor";
import { useHousingTheme, useButtonTheme } from "../../state/useThemeStore";

const FOCUS_TIMEOUT = 5000;

export default function SwitchPanel() {
  const devices      = useDeviceStore((s) => s.devices);
  const housingTheme = useHousingTheme();
  const buttonTheme  = useButtonTheme();
  useCurtainMotor(5);

  const { active: motionActive, trigger } = useMotion(12000);

  const [leftState,  setLeftStateRaw]  = useState("idle");
  const [rightState, setRightStateRaw] = useState("idle");
  const leftTimer  = useRef(null);
  const rightTimer = useRef(null);

  const setLeftState = useCallback((s) => {
    setLeftStateRaw(s);
    clearTimeout(leftTimer.current);
    if (s !== "idle" && s !== "approach") {
      leftTimer.current = setTimeout(() => setLeftStateRaw("approach"), FOCUS_TIMEOUT);
    }
  }, []);

  const setRightState = useCallback((s) => {
    setRightStateRaw(s);
    clearTimeout(rightTimer.current);
    if (s !== "idle" && s !== "approach") {
      rightTimer.current = setTimeout(() => setRightStateRaw("approach"), FOCUS_TIMEOUT);
    }
  }, []);

  const onActivity = useCallback(() => {
    setLeftStateRaw((p)  => p === "idle" ? "approach" : p);
    setRightStateRaw((p) => p === "idle" ? "approach" : p);
  }, []);

  const effectiveLeft = (() => {
    if (leftState  !== "idle" && leftState  !== "approach") return leftState;
    return motionActive ? "approach" : "idle";
  })();
  const effectiveRight = (() => {
    if (rightState !== "idle" && rightState !== "approach") return rightState;
    return motionActive ? "approach" : "idle";
  })();

  return (
    <div className="m-[2px] md:m-[30px] lg:m-[40px] sm:m-[23px] h-[322px] rounded-[30px]"
      onMouseEnter={trigger}
      style={{
        position:     "relative",
        flexShrink:   0,
        background:   housingTheme?.bg     ?? "#ffffff",
        boxShadow:   " 5px 7px 3px 3px rgba(0,0,0,0.18)",
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
