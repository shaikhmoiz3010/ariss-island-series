import StatusPill from "../../ui/StatusPill";

function cctLabel(k) {
  if (k <= 3000) return "WARM WHITE";
  if (k <= 4000) return "NEUTRAL";
  if (k <= 5000) return "COOL WHITE";
  return "DAYLIGHT";
}

function cctColour(k) {
  if (k <= 3000) return "#ffcc80";
  if (k <= 4000) return "#ffe0b2";
  if (k <= 5000) return "#e8eaf6";
  return "#bbdefb";
}

export default function CCTDisplay({ device }) {
  const { cct } = device;
  const pct = ((cct - 2700) / 3800 * 82 + 9).toFixed(1);

  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="font-mono text-[7px] tracking-widest uppercase text-white-lo">CCT</span>
        <StatusPill variant="cct">{cctLabel(cct)}</StatusPill>
      </div>

      <div className="flex items-center justify-center flex-1">
        <span
          className="font-mono text-[22px] font-bold tracking-tight leading-none transition-all duration-150"
          style={{ color: cctColour(cct), textShadow: `0 0 20px ${cctColour(cct)}66` }}
        >
          {cct}
          <span className="text-[8px] font-light ml-1 text-white-lo">K</span>
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-[3px] rounded-[3px] bg-gradient-to-r from-[#ffb347] via-[#fff8e0] to-[#b8d0ff] relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[7px] h-[7px] bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.7)] transition-all duration-300"
            style={{ left: `${pct}%` }}
          />
        </div>

        <div className="flex justify-between">
          <span className="font-mono text-[5px] tracking-wide text-[#ffcc8088]">
            ◀ HOLD WARM
          </span>
          <span className="font-mono text-[5px] tracking-wide text-[#bbdefb88]">
            COOL HOLD ▶
          </span>
        </div>
      </div>
    </div>
  );
}