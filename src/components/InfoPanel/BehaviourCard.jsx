import { useThemeStore } from "../../state/useThemeStore";

const CARD = {
  light: {
    bg:      "rgba(255,255,255,0.55)",
    border:  "rgba(0,0,0,0.07)",
    shadow:  "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.80)",
    title:   "rgba(180,130,20,0.50)",
    body:    "rgba(0,0,0,0.42)",
    strong:  "rgba(0,0,0,0.75)",
    kbd:     { bg: "rgba(0,0,0,0.07)", border: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.50)" },
  },
  dark: {
    bg:      "rgba(6,7,9,0.78)",
    border:  "rgba(255,255,255,0.06)",
    shadow:  "0 4px 24px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.04)",
    title:   "rgba(233,200,124,0.28)",
    body:    "rgba(255,255,255,0.28)",
    strong:  "rgba(255,255,255,0.82)",
    kbd:     { bg: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.40)" },
  },
};

export default function BehaviourCard({ bgMode = "dark" }) {
  const c = CARD[bgMode];

  function Kbd({ children }) {
    return (
      <span style={{
        display:      "inline-block",
        background:   c.kbd.bg,
        border:       `1px solid ${c.kbd.border}`,
        borderRadius: "4px",
        padding:      "1.5px 6px",
        fontFamily:   "'JetBrains Mono', monospace",
        fontSize:     "9px",
        color:        c.kbd.color,
        transition:   "all 0.4s ease",
      }}>
        {children}
      </span>
    );
  }

  return (
    <div style={{
      background:     c.bg,
      border:         `1px solid ${c.border}`,
      borderRadius:   "16px",
      padding:        "16px",
      boxShadow:      c.shadow,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      transition:     "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
    }}>
      <h3 style={{
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      "8.5px",
        letterSpacing: "3px",
        textTransform: "uppercase",
        color:         c.title,
        marginBottom:  "12px",
        transition:    "color 0.4s ease",
      }}>
        Display Behaviour
      </h3>

      <p style={{
        fontSize:   "11px",
        color:      c.body,
        lineHeight: "1.75",
        transition: "color 0.4s ease",
      }}>
        <strong style={{ color: c.strong }}>Idle</strong> — L: Clock &nbsp; R: Weather<br />
        <strong style={{ color: c.strong }}>Approach</strong> — Labels appear on hover<br />
        <strong style={{ color: c.strong }}>Left press</strong> — L goes to focus mode<br />
        <strong style={{ color: c.strong }}>Right press</strong> — R goes to focus mode<br />
        <strong style={{ color: c.strong }}>2.5s timeout</strong> — returns to approach<br />
        <br />
        <Kbd>tap</Kbd>&nbsp; ON/OFF &nbsp;
        <Kbd>2×</Kbd>&nbsp; mode switch &nbsp;
        <Kbd>hold</Kbd>&nbsp; adjust
      </p>
    </div>
  );
}