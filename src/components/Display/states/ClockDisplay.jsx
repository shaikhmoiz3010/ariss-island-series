import { useClock } from "../../../hooks/useClock";

export default function ClockDisplay() {
  const { h, m, ap } = useClock();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="p-9 font-sans text-[30px] font-light text-white leading-none">
        {h}
        <span className="text-white">:</span>
        {m}
        <span className="text-[10px] font-light text-white ml-0.5">{ap}</span>
      </div>
      {/* <div className="text-[8px] font-mono tracking-[4px] text-amber-400/20 mt-1 uppercase">ARISS</div> */}
    </div>
  );
}