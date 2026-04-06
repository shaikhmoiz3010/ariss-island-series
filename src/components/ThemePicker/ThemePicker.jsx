import { HOUSING_THEMES, BUTTON_THEMES } from "../../constants/themes";
import { useThemeStore } from "../../state/useThemeStore";

const LIGHT_IDS = ["white", "silver"];

function SwatchRow({ label, themes, activeId, onSelect }) {
  return (
    <div  style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      "12px",
        letterSpacing: "2.5px",
        textTransform: "uppercase",
        color:         "rgba(233,200,124,0.40)",
        whiteSpace:    "nowrap",
        minWidth:      "42px",
      }}>
        {label}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {themes.map((t) => {
          const isActive = t.id === activeId;
          const isLight  = LIGHT_IDS.includes(t.id);
          return (
            <button
              key={t.id}
              title={t.label}
              onClick={() => onSelect(t.id)}
              style={{
                width:        "20px",
                height:       "20px",
                borderRadius: "50%",
                flexShrink:   0,
                cursor:       "pointer",
                outline:      "none",
                position:     "relative",
                border:       isActive
                  ? "2px solid rgba(233,200,124,0.95)"
                  : "2px solid rgba(255,255,255,0.12)",
                background:   t.swatch,
                boxShadow:    isActive
                  ? "0 0 0 3px rgba(233,200,124,0.20), 0 2px 6px rgba(0,0,0,0.4)"
                  : "0 1px 4px rgba(0,0,0,0.35)",
                transform:    isActive ? "scale(1.18)" : "scale(1)",
                transition:   "all 0.18s ease",
              }}
            >
              {isActive && (
                <span style={{
                  position:       "absolute",
                  inset:          0,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "9px",
                  fontWeight:     700,
                  pointerEvents:  "none",
                  color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.90)",
                }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ThemePicker() {
  const { housingId, buttonId, setHousing, setButton } = useThemeStore();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.10)" }} />
      <SwatchRow label="Body"    themes={HOUSING_THEMES} activeId={housingId} onSelect={setHousing} />
      <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.10)" }} />
      <SwatchRow label="Buttons" themes={BUTTON_THEMES}  activeId={buttonId}  onSelect={setButton}  />
    </div>
  );
}
