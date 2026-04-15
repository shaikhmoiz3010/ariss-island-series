export default function ACTempDisplay({ device }) {
  const { on, temp } = device;
  const pct = ((temp - 16) / (30 - 16) * 100).toFixed(1);

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "center",
      height:         "100%",
      padding:        "4px 12px",
      gap:            "6px",
      boxSizing:      "border-box",
    }}>

      {/* ── Temp value + On/Off label in one row ── */}
      <div style={{
        display:     "flex",
        alignItems:  "baseline",
        gap:         "10px",
      }}>
        <span style={{
          fontFamily:  "sans-serif",
          fontSize:    "15px",
          fontWeight:  400,
          color:       on ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)",
          transition:  "color 0.25s ease",
          whiteSpace:  "nowrap",
        }}>
          Temp. {temp}°C
        </span>

        <span style={{
          fontFamily:  "sans-serif",
          fontSize:    "15px",
          fontWeight:  400,
          color:       on ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)",
          transition:  "color 0.25s ease",
        }}>
          {on ? "On" : "Off"}
        </span>
      </div>

      {/* ── slider — only show when ON ── */}
      {on && (
        <div style={{ position:"relative", height:"13px", display:"flex", alignItems:"center" }}>
          {/* full track */}
          <div style={{
            position:     "absolute",
            left:         0,
            right:        0,
            height:       "3px",
            borderRadius: "3px",
            background:   "rgba(255,255,255,0.85)",
          }}/>
          {/* blue dot thumb */}
          <div style={{
            position:     "absolute",
            left:         `${pct}%`,
            transform:    "translateX(-50%)",
            width:        "13px",
            height:       "13px",
            borderRadius: "50%",
            background:   "#3b82f6",
            boxShadow:    "0 0 8px rgba(59,130,246,0.80)",
            transition:   "left 0.2s ease",
            flexShrink:   0,
          }}/>
        </div>
      )}

    </div>
  );
}