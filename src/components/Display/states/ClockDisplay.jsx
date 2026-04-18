import { useClock } from "../../../hooks/useClock";

export default function ClockDisplay() {
  const { h, m, ap } = useClock();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className=" font-sans text-[26px] font-extralight text-white leading-none">
        {h}
        <span className="text-white">:</span>
        {m}
        <span className="text-[10px]  font-sans font-light text-white ml-0.5">{ap}</span>
      </div>
    </div>
  );
}