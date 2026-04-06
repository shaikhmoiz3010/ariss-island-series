export default function FanSteps({ speed }) {
  return (
    <div className="flex gap-[2px]">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className={`flex-1 h-3 rounded flex items-center justify-center text-[6px] font-mono border transition-all duration-200
            ${n === speed
              ? "bg-amber-400/42 border-amber-300 text-[#1a1000] font-bold shadow-[0_0_6px_rgba(232,200,122,0.4)]"
              : n < speed
              ? "bg-amber-400/20 border-amber-400/45 text-amber-300"
              : "bg-white/7 border-white/10 text-white/30"
            }`}
        >
          {n}
        </div>
      ))}
    </div>
  );
}