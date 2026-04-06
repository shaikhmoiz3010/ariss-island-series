import StatusPill from "../../ui/StatusPill";
import ProgressBar from "../../ui/ProgressBar";

export default function ACTempDisplay({ device }) {
  const { temp } = device;
  const pct = ((temp - 16) / 14 * 100).toFixed(0);
  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">AC · Temp</span>
        <StatusPill variant="ac">ADJUSTING</StatusPill>
      </div>
      <div className="flex items-center justify-center flex-1">
        <span className="font-mono text-[24px] font-bold text-white/90 tracking-tight drop-shadow-[0_0_20px_rgba(232,200,122,0.38)]">
          {temp}<span className="text-[8px] font-light text-white/30 ml-1">°C</span>
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <ProgressBar percent={pct} />
        <span className="text-[5.5px] font-mono text-white/25 text-center tracking-wide uppercase">16°C ←——→ 30°C · RELEASE TO SET</span>
      </div>
    </div>
  );
}