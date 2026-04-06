import { AC_SPEEDS } from "../../constants/devices";

export default function ACSpeedChips({ fanSpd }) {
  return (
    <div className="flex gap-[2px] w-full">
      {AC_SPEEDS.map((s) => (
        <div
          key={s}
          className={`flex-1 h-[10px] rounded flex items-center justify-center text-[5px] font-mono tracking-wide border transition-all duration-200
            ${s === fanSpd
              ? "bg-amber-400/14 border-amber-400/35 text-amber-300"
              : "bg-white/5 border-white/8 text-white/20"
            }`}
        >
          {s}
        </div>
      ))}
    </div>
  );
}