import { AC_MODES } from "../../constants/devices";

export default function ACModeChips({ mode }) {
  return (
    <div className="flex gap-[2px]">
      {AC_MODES.map((m) => (
        <div
          key={m}
          className={`flex-1 h-[11px] rounded flex items-center justify-center text-[5px] font-mono tracking-wide border transition-all duration-200
            ${m === mode
              ? "bg-amber-400/20 border-amber-400/45 text-amber-300"
              : "bg-white/6 border-white/9 text-white/20"
            }`}
        >
          {m}
        </div>
      ))}
    </div>
  );
}