import LeftDisplay  from "../Display/LeftDisplay";
import RightDisplay from "../Display/RightDisplay";
import { useHousingTheme } from "../../state/useThemeStore";

export default function DisplayRow({ leftState, rightState, devices }) {
  const housingTheme = useHousingTheme();

  const borderColor = housingTheme?.id === "black"
    ? "#0a0a0b"
    : "#c8c8c8";

  return (
    <div className="flex w-[336px] h-[54px] ml-[2px] mb-[1px] rounded-full overflow-hidden"
      style={{
        border:       `3px solid ${borderColor}`,
        position:     "relative",
        background:   "#000000",
        boxShadow: [
          "inset 0 2px 40px rgba(0,0,0,0.98)",
          "inset 0 0 0 1px rgba(255,255,255,0.03)",
          "inset 0 8px 16px rgba(0,0,0,0.90)",
          "inset 0 -4px 8px rgba(0,0,0,0.70)",
          "-2px 4px 3px rgba(0,0,0,0.6)",
        ].join(", "),
      }}
    >

      {/* Glass glare — two-layer for realism */}
      <div style={{
        position:      "absolute",
        inset:         0,
        zIndex:        30,
        pointerEvents: "none",
        borderRadius:  "inherit",
        background: [
          "linear-gradient(280deg, rgba(255,255,255,0.24) 0%, transparent 60%)",
          // "radial-gradient(ellipse 80% 35% at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 100%)",
        ].join(", "),
      }} />


      <LeftDisplay  displayState={leftState}  devices={devices} />
      <RightDisplay displayState={rightState} devices={devices} />
    </div>
  );
}