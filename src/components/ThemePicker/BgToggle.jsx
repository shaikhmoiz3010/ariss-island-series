import { useThemeStore } from "../../state/useThemeStore";

export default function BgToggle() {
  const { bgMode, toggleBg } = useThemeStore();
  const isDark = bgMode === "dark";

  return (
    <button
      onClick={toggleBg}
      title={isDark ? "Switch to light background" : "Switch to dark background"}
      className="flex items-center gap-2 pl-2 pr-[13px] py-[5px] rounded-full cursor-pointer border-none outline-none relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] backdrop-blur-md"
      style={{
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        background: isDark
          ? "linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(249,115,22,0.10) 100%)"
          : "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(56,189,248,0.08) 100%)",
        boxShadow: isDark
          ? "0 0 0 1px rgba(251,191,36,0.28), 0 2px 12px rgba(251,191,36,0.12), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 0 0 1px rgba(99,102,241,0.22), 0 2px 12px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      {/* animated shimmer sweep */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none animate-[bgToggleSweep_2.8s_linear_infinite] bg-[length:200%_100%]"
        style={{
          background: isDark
            ? "linear-gradient(105deg, transparent 35%, rgba(251,191,36,0.12) 50%, transparent 65%)"
            : "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)",
          backgroundSize: "200% 100%",
        }}
      />

      {/* icon pill */}
      <span
        className="flex items-center justify-center w-[22px] h-[22px] rounded-full flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-[12px] leading-none"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(251,191,36,0.30) 0%, rgba(249,115,22,0.22) 100%)"
            : "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(56,189,248,0.14) 100%)",
          boxShadow: isDark
            ? "0 0 8px rgba(251,191,36,0.35), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 0 8px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
          transform: isDark ? "rotate(0deg)" : "rotate(-25deg)",
        }}
      >
        {isDark ? "☀️" : "🌙"}
      </span>

      {/* label */}
      <span
        className="font-mono text-[10px] font-semibold tracking-[1.8px] uppercase relative transition-all duration-[250ms] ease-in-out bg-clip-text text-transparent"
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          backgroundImage: isDark
            ? "linear-gradient(90deg, #fbbf24 0%, #fb923c 100%)"
            : "linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)",
        }}
      >
        {isDark ? "Light" : "Dark"}
      </span>

      <style>{`
        @keyframes bgToggleSweep {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </button>
  );
}