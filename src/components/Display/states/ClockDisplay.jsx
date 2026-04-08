import { useClock } from "../../../hooks/useClock";

export default function ClockDisplay() {
  const { h, m, ap } = useClock();
  return (
    <div className="flex flex-col items-center justify-center h-full px-3.5">
      <div className="font-mono text-[30px] font-light text-white/90 tracking-tight leading-none">
        {h}
        <span className="text-amber-300 animate-blink">:</span>
        {m}
        <span className="text-[10px] font-light text-white/30 ml-0.5">{ap}</span>
      </div>
      {/* <div className="text-[8px] font-mono tracking-[4px] text-amber-400/20 mt-1 uppercase">ARISS</div> */}
    </div>
  );
}