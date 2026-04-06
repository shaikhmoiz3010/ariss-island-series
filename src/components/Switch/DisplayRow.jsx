import LeftDisplay  from "../Display/LeftDisplay";
import RightDisplay from "../Display/RightDisplay";
import { useHousingTheme } from "../../state/useThemeStore";

export default function DisplayRow({ leftState, rightState, devices }) {
  const housingTheme = useHousingTheme();

  // Border colour matches the switch body
  // White housing → light grey border, Black housing → near-black border
  const borderColor = housingTheme?.id === "black"
    ? "#1a1c1f"   // dark border for black housing
    : "#e2e2e2";  // light border for white housing

  return (
    <div className="flex w-[344px] h-[54px] ml-[2px] mb-[1px] rounded-full overflow-hidden bg-black"  style={{
      border:       `3px solid ${borderColor}`,
      position:     "relative",
      boxShadow:    "inset 0 2px 30px rgba(0,0,0,0.92), inset 0 4px 0 rgba(255,255,255,0.025), -2px 4px 3px rgba(0,0,0,0.6)",
    }}>

      {/* Glass glare overlay */}
      <div className="rounded-full " style={{
        position:      "absolute",
        inset:         0,
        zIndex:        30,
        pointerEvents: "none",
        background:    "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 55%)",
      }} />

      <LeftDisplay  displayState={leftState}  devices={devices} />
      <RightDisplay displayState={rightState} devices={devices} />
    </div>
  );
}