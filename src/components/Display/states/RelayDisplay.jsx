export default function RelayDisplay({ device }) {
  const { on, label } = device;

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "center",
      alignItems:     "flex-start",
      height:         "100%",
      padding:        "1px 0px 0 75px",
      gap:            "2px",
      boxSizing:      "border-box",
    }}>

      {/* device name */}
      <span style={{
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      "10px",
        fontWeight:    600,
        color:         "rgba(255,255,255,0.88)",
        letterSpacing: "1.5px",
      }}>
        Switch
      </span>

      {/* sliding toggle pill */}
      <div style={{
        position:     "relative",
        width:        "46px",
        height:       "20px",
        borderRadius: "999px",
        background:   on ? "#22c55e" : "#ef4444",
        flexShrink:   0,
        transition:   "background 0.28s ease",
        boxShadow:    on
          ? "0 0 8px rgba(34,197,94,0.45)"
          : "0 0 8px rgba(239,68,68,0.40)",
      }}>

        {/* ON / OFF label */}
        <span style={{
          position:      "absolute",
          top:           "50%",
          transform:     "translateY(-50%)",
          left:          on ? "6px"  : "auto",
          right:         on ? "auto" : "6px",
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "6.5px",
          fontWeight:    700,
          letterSpacing: "0.8px",
          color:         "rgba(255,255,255,0.92)",
          pointerEvents: "none",
          userSelect:    "none",
          transition:    "all 0.28s ease",
        }}>
          {on ? "ON" : "OFF"}
        </span>

        {/* sliding knob */}
        <div style={{
          position:     "absolute",
          top:          "2px",
          left:         on ? "calc(100% - 18px)" : "2px",
          width:        "16px",
          height:       "16px",
          borderRadius: "50%",
          background:   "rgba(255,255,255,0.96)",
          boxShadow:    "0 1px 4px rgba(0,0,0,0.35)",
          transition:   "left 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        }}/>

      </div>
    </div>
  );
}