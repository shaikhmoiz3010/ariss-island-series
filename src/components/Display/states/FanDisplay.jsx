import StatusPill from "../../ui/StatusPill";
import FanSteps from "../../ui/FanSteps";

export default function FanDisplay({ device }) {
  const { speed } = device;
  const on = speed > 0;
  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">Fan</span>
        <StatusPill variant={on ? "on" : "off"}>{on ? `SPD ${speed}` : "OFF"}</StatusPill>
      </div>
      <div className="flex items-center justify-center flex-1">
        {on
          ? <span className="font-mono text-[28px] font-bold text-white/90 tracking-tight drop-shadow-[0_0_24px_rgba(232,200,122,0.45)]">{speed}</span>
          : <span className="text-[22px] opacity-15">🌀</span>
        }
      </div>
      <div className="flex flex-col gap-1">
        <FanSteps speed={speed} />
        <span className="text-[5.5px] font-mono text-white/25 text-center tracking-wide uppercase">HOLD TO CYCLE SPEED</span>
      </div>
    </div>
  );
}