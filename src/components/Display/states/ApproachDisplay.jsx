import { IC_ON_COLOUR } from "../../../constants/colours";

const LABEL_TYPE = {
  "Lights":  "dimmer",
  "Night":   "scene",
  "Fan":     "fan",
  "Pendant": "relay",
  "AC":      "ac",
  "Curtain": "curtain",
};

function DotRow({ label, on }) {
  const type     = LABEL_TYPE[label] ?? "dimmer";
  const dotColor = IC_ON_COLOUR[type] ?? "#e8c87a";

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-[7px] h-[7px] rounded-full flex-shrink-0 transition-all duration-300"
        style={{
          background: on ? dotColor : "rgba(160,160,160,0.40)",
          boxShadow:  on ? `0 0 5px ${dotColor}88` : "none",
        }}
      />
      <span className={`
        font-mono text-[9.5px] tracking-[0.2px] whitespace-nowrap
        transition-all duration-300
        ${on ? "font-semibold text-white/90" : "font-normal text-white/35"}
      `}>
        {label}
      </span>
    </div>
  );
}

/* ── LEFT list — adjust px/py/gap/margin here ── */
export function ApproachLeft({ items }) {
  return (
    <div className="flex flex-col justify-center h-full px-[36px] py-1 gap-[1px]">
      {items.map(({ label, on }, i) => (
        <DotRow key={i} label={label} on={on} />
      ))}
    </div>
  );
}

/* ── RIGHT list — adjust px/py/gap/margin here ── */
export function ApproachRight({ items }) {
  return (
    <div className="flex flex-col justify-center h-full px-[56px] py-1 gap-[1px]">
      {items.map(({ label, on }, i) => (
        <DotRow key={i} label={label} on={on} />
      ))}
    </div>
  );
}

/* default export kept for backward compat */
export default function ApproachDisplay({ items, align = "left" }) {
  return align === "right"
    ? <ApproachRight items={items} />
    : <ApproachLeft  items={items} />;
}