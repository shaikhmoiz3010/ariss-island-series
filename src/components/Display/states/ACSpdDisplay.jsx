import { AC_SPEEDS } from "../../../constants/devices";


const BAR_SETS = {
  LOW:  [0.35, 0.60, 0.85, 1.00],   /* 1 fully lit */
  MED:  [0.35, 0.60, 0.85, 1.00],   /* 2 fully lit */
  HIGH: [0.35, 0.60, 0.85, 1.00],   /* all lit */
};

const ACTIVE_BARS = { LOW: 1, MED: 2, HIGH: 3 };

export default function ACSpdDisplay({ device }) {
  const fanSpd    = device.fanSpd ?? "MED";
  const activeCount = ACTIVE_BARS[fanSpd] ?? 2;

  /* relative heights — tallest on right like signal bars */
  const heights = [0.38, 0.58, 0.78, 1.00];

  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      height:         "100%",
      padding:        "6px 10px 5px 40px",
      gap:            "3px",
      boxSizing:      "border-box",
    }}>
      {heights.map((h, i) => {
        const lit = i < activeCount;
        return (
          <div
            key={i}
            style={{
              width:        "10px",
              height:       `${h * 32}px`,
              borderRadius: "2px",
              background:   lit ? "#3b82f6" : "rgba(59,130,246,0.20)",
              boxShadow:    lit ? "0 0 6px rgba(59,130,246,0.55)" : "none",
              transition:   "all 0.25s ease",
              alignSelf:    "flex-end",
            }}
          />
        );
      })}
    </div>
  );
}