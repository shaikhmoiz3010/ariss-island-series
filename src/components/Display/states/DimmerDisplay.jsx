import StatusPill from "../../ui/StatusPill";
import ProgressBar from "../../ui/ProgressBar";

export default function DimmerDisplay({ device }) {
  const { on, bright } = device;
  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">BRI</span>
        <StatusPill variant={on ? "on" : "off"}>{on ? `ON · ${bright}%` : "OFF"}</StatusPill>
      </div>
      <div className="flex items-center justify-center flex-1">
        {on
          ? <span className="font-mono text-[28px] font-bold text-white/90 tracking-tight drop-shadow-[0_0_24px_rgba(232,200,122,0.4)]">
              {bright}<span className="text-[11px] font-light text-amber-300 ml-0.5">%</span>
            </span>
          : <span className="text-[20px] opacity-15">💡</span>
        }
      </div>
      <div className="flex flex-col gap-1">
        <ProgressBar percent={on ? bright : 0} />
        <span className="text-[5.5px] font-mono text-white/25 text-center tracking-wide uppercase">
          {on ? "BRIGHTNESS · HOLD TO ADJUST" : `LAST: ${bright}%`}
        </span>
      </div>
    </div>
  );
}