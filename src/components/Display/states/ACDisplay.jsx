import StatusPill from "../../ui/StatusPill";
import ACModeChips from "../../ui/ACModeChips";

export default function ACDisplay({ device }) {
  const { on, temp, mode } = device;
  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">AC</span>
        <StatusPill variant={on ? "ac" : "off"}>{on ? `ON · ${mode}` : "OFF"}</StatusPill>
      </div>
      <div className="flex items-center justify-center flex-1">
        {on
          ? <span className="font-mono text-[24px] font-bold text-white/90 tracking-tight drop-shadow-[0_0_20px_rgba(232,200,122,0.38)]">
              {temp}<span className="text-[8px] font-light text-white/30 ml-1">°C</span>
            </span>
          : <span className="text-[20px] opacity-15">❄️</span>
        }
      </div>
      <ACModeChips mode={mode} />
    </div>
  );
}