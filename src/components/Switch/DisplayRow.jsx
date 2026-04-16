import LeftDisplay  from "../Display/LeftDisplay";
import RightDisplay from "../Display/RightDisplay";
import { useHousingTheme } from "../../state/useThemeStore";

export default function DisplayRow({ leftState, rightState, devices }) {
  const housingTheme = useHousingTheme();

  const borderColor = housingTheme?.id === "black" ? "#1a1a1a" : "#FFFFFF";

  return (
    <div
      className="flex w-[336px] h-[54px] ml-[2px] mb-[1px] rounded-full overflow-hidden relative bg-black"
      style={{
        border: `3px solid ${borderColor}`,
        boxShadow: [
          "inset 0 2px 40px rgba(0,0,0,0.98)",
          "inset 0 0 0 1px rgba(255,255,255,0.03)",
          "inset 0 8px 16px rgba(0,0,0,0.90)",
          "inset 0 -4px 8px rgba(0,0,0,0.70)",
          "-2px 4px 3px rgba(0,0,0,0.6)",
        ].join(", "),
      }}
    >
      {/* Glass glare */}
      <div
        className="absolute inset-0 z-30 pointer-events-none rounded-[inherit]"
        style={{
          background: "linear-gradient(70deg, rgba(255,255,255,0.23) 40%, transparent 70%)",
        }}
      />

      <LeftDisplay  displayState={leftState}  devices={devices} />
      <RightDisplay displayState={rightState} devices={devices} />
    </div>
  );
}