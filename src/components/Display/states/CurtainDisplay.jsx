import StatusPill from "../../ui/StatusPill";
import ProgressBar from "../../ui/ProgressBar";

export default function CurtainDisplay({ device }) {
  const { pos, moving, dir } = device;
  const pillText = moving ? (dir === "open" ? "OPENING →" : "← CLOSING") : pos >= 100 ? "OPEN" : pos <= 0 ? "CLOSED" : "PAUSED";
  const pillVariant = moving || pos >= 100 ? "curtain" : "off";
  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">Curtain</span>
        <StatusPill variant={pillVariant}>{pillText}</StatusPill>
      </div>
      <div className="flex items-center justify-center flex-1">
        <span className="font-mono text-[24px] font-bold text-white/90 tracking-tight">
          {Math.round(pos)}<span className="text-[11px] font-light text-amber-300 ml-0.5">%</span>
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <ProgressBar percent={pos} />
        <span className="text-[5.5px] font-mono text-white/25 text-center tracking-wide uppercase">
          {moving ? "DOUBLE TAP TO STOP" : "TAP RESUME · HOLD SET"}
        </span>
      </div>
    </div>
  );
}