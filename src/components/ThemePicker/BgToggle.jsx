import { useThemeStore } from "../../state/useThemeStore";

export default function BgToggle() {
  const { bgMode, toggleBg } = useThemeStore();
  const isDark = bgMode === "dark";

  return (
    <button
      onClick={toggleBg}
      title={isDark ? "Switch to light background" : "Switch to dark background"}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          "7px",
        background:   isDark ? "rgba(233,200,124,0.12)" : "rgba(255,255,255,0.08)",
        border:       isDark ? "1px solid rgba(233,200,124,0.30)" : "1px solid rgba(255,255,255,0.14)",
        borderRadius: "20px",
        padding:      "5px 12px 5px 9px",
        cursor:       "pointer",
        transition:   "all 0.22s ease",
      }}
    >
      <span style={{ fontSize: "13px", lineHeight: 1 }}>
        {isDark ? "☀️" : "🌙"}
      </span>
      <span style={{
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      "10px",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color:         isDark ? "rgba(233,200,124,0.85)" : "rgba(255,255,255,0.55)",
      }}>
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}