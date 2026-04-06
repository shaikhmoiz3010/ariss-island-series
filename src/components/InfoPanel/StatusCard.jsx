import { useDeviceStore } from "../../state/useDeviceStore";
import { IC_ON_COLOUR } from "../../constants/colours";

function formatValue(d) {
  if (d.type === "dimmer")  return d.on ? `ON · ${d.bright}%` : `OFF · ${d.bright}%`;
  if (d.type === "relay")   return d.on ? "ON" : "OFF";
  if (d.type === "scene")   return "SCENE";
  if (d.type === "ac")      return d.on ? `ON · ${d.temp}°C · ${d.mode}` : `OFF · ${d.temp}°C`;
  if (d.type === "fan")     return d.speed > 0 ? `ON · SPD ${d.speed}` : "OFF";
  if (d.type === "curtain") return `${Math.round(d.pos)}% · ${d.moving ? (d.dir === "open" ? "OPENING" : "CLOSING") : "STOPPED"}`;
  return "—";
}

function isActiveDevice(d) {
  if (d.type === "fan")     return d.speed > 0;
  if (d.type === "curtain") return d.moving;
  return d.on;
}

const CARD = {
  light: {
    bg:           "rgba(255,255,255,0.72)",
    border:       "rgba(0,0,0,0.08)",
    shadow:       "0 4px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.80)",
    title:        "rgba(180,130,20,0.55)",
    rowBorder:    "rgba(0,0,0,0.06)",
    nameInactive: "rgba(0,0,0,0.35)",
    nameActive:   "rgba(0,0,0,0.82)",
    valInactive:  "rgba(0,0,0,0.22)",
    valActive:    "#b8860a",
  },
  dark: {
    bg:           "rgba(10,11,14,0.82)",
    border:       "rgba(255,255,255,0.07)",
    shadow:       "0 4px 24px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.04)",
    title:        "rgba(233,200,124,0.28)",
    rowBorder:    "rgba(255,255,255,0.05)",
    nameInactive: "rgba(255,255,255,0.30)",
    nameActive:   "rgba(255,255,255,0.88)",
    valInactive:  "rgba(255,255,255,0.20)",
    valActive:    "#e9c87c",
  },
};

export default function StatusCard({ bgMode = "dark" }) {
  const devices = useDeviceStore((s) => s.devices);
  const c = CARD[bgMode];

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
        Device Status
      </h3>

      {devices.map((d) => {
        const active = isActiveDevice(d);
        return (
          <div key={d.id} style={{
            display:       "flex",
            alignItems:    "center",
            justifyContent:"space-between",
            padding:       "6px 0",
            borderBottom:  `1px solid ${c.rowBorder}`,
            transition:    "border-color 0.4s ease",
          }}
          className="last:border-0"
          >
            <span style={{
              display:    "flex",
              alignItems: "center",
              gap:        "8px",
              fontSize:   "12.5px",
              fontWeight: active ? 500 : 400,
              color:      active ? c.nameActive : c.nameInactive,
              transition: "color 0.3s ease",
            }}>
              <span style={{
                width:       "7px",
                height:      "7px",
                borderRadius:"50%",
                flexShrink:  0,
                background:  IC_ON_COLOUR[d.type],
                opacity:     active ? 1 : 0.35,
              }} />
              {d.label}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize:   "10px",
              fontWeight: active ? 500 : 400,
              color:      active ? c.valActive : c.valInactive,
              transition: "color 0.3s ease",
            }}>
              {formatValue(d)}
            </span>
          </div>
        );
      })}
    </div>
  );
}