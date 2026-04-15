import { HOUSING_THEMES, BUTTON_THEMES } from "../../constants/themes";
import { useThemeStore } from "../../state/useThemeStore";

const LIGHT_IDS = ["white", "silver"];

function Divider({ isDark }) {
  return (
    <div
      className="w-px h-7 flex-shrink-0"
      style={{
        background: isDark
          ? "linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent)"
          : "linear-gradient(180deg, transparent, rgba(99,102,241,0.22), transparent)",
      }}
    />
  );
}

function SwatchRow({ label, themes, activeId, onSelect, isDark }) {
  return (
    <div className="flex items-center gap-[10px]">
      {/* label */}
      <span
        className="font-mono text-[10px] font-semibold tracking-[2px] uppercase whitespace-nowrap min-w-[44px] bg-clip-text text-transparent"
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          backgroundImage: isDark
            ? "linear-gradient(90deg, #fbbf24 0%, #fb923c 100%)"
            : "linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)",
        }}
      >
        {label}
      </span>

      {/* swatches */}
      <div className="flex items-center gap-[7px]">
        {themes.map((t) => {
          const isActive = t.id === activeId;
          const isLight  = LIGHT_IDS.includes(t.id);
          return (
            <button
              key={t.id}
              title={t.label}
              onClick={() => onSelect(t.id)}
              className="flex-shrink-0 cursor-pointer outline-none relative transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"
              style={{
                width:       isActive ? "22px" : "18px",
                height:      isActive ? "22px" : "18px",
                background:  t.swatch,
                border: isActive
                  ? isDark ? "2px solid rgba(251,191,36,0.95)" : "2px solid rgba(99,102,241,0.85)"
                  : isDark ? "1.5px solid rgba(255,255,255,0.14)" : "1.5px solid rgba(99,102,241,0.18)",
                boxShadow: isActive
                  ? isDark
                    ? "0 0 0 3px rgba(251,191,36,0.22), 0 3px 10px rgba(0,0,0,0.45)"
                    : "0 0 0 3px rgba(99,102,241,0.20), 0 3px 10px rgba(99,102,241,0.22)"
                  : isDark
                    ? "0 1px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
                    : "0 1px 4px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              {isActive && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                    strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ stroke: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.92)" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ThemePicker() {
  const { housingId, buttonId, setHousing, setButton, bgMode } = useThemeStore();
  const isDark = bgMode === "dark";

  return (
    <div
      className="flex items-center gap-[14px] px-[14px] py-[6px] rounded-full transition-all duration-300 ease-in-out backdrop-blur-md"
      style={{
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.70) 0%, rgba(235,240,255,0.55) 100%)",
        boxShadow: isDark
          ? "0 0 0 1px rgba(255,255,255,0.08), 0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 0 0 1px rgba(99,102,241,0.15), 0 2px 16px rgba(99,102,241,0.10), inset 0 1px 0 rgba(255,255,255,0.95)",
      }}
    >
      <SwatchRow
        label="Body"
        themes={HOUSING_THEMES}
        activeId={housingId}
        onSelect={setHousing}
        isDark={isDark}
      />

      <Divider isDark={isDark} />

      <SwatchRow
        label="Buttons"
        themes={BUTTON_THEMES}
        activeId={buttonId}
        onSelect={setButton}
        isDark={isDark}
      />
    </div>
  );
}