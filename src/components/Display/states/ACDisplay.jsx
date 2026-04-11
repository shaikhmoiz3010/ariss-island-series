export default function ACDisplay({ device }) {
  const { on, temp, mode } = device;

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "center",
      height:         "100%",
      padding:        "1px 30px",
      gap:            "0px",
      boxSizing:      "border-box",
    }}>

      {/* device name */}
      <span className="mx-5" style={{

        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      "15px",
        letterSpacing: "2.5px",
        color:         "rgba(255,255,255,0.75)",
        fontWeight:    700,
      }}>
        AC
      </span>

      {/* toggle pill + temp */}
      <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>

        {/* ── toggle pill ── */}
        <div style={{
          position:     "relative",
          width:        "45px",
          height:       "19px",
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
            /* label sits on the opposite side of the knob */
            left:          on ? "6px"  : "auto",
            right:         on ? "auto" : "6px",
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "9.5px",
            fontWeight:    700,
            letterSpacing: "0.8px",
            color:         "rgba(255,255,255,0.90)",
            pointerEvents: "none",
            transition:    "all 0.28s ease",
            userSelect:    "none",
          }}>
            {on ? "ON" : "OFF"}
          </span>

          {/* sliding knob */}
          <div style={{
            position:     "absolute",
            top:          "1px",
            /* slides from left when OFF to right when ON */
            left:         on ? "calc(100% - 18px)" : "2px",
            width:        "16px",
            height:       "16px",
            borderRadius: "50%",
            background:   "rgba(255,255,255,0.96)",
            boxShadow:    "0 1px 4px rgba(0,0,0,0.35)",
            transition:   "left 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}/>

        </div>

        {/* temp — only when on */}
        {on && (
          <span style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "22px",
            fontWeight:    600,
            color:         "rgba(255,255,255,0.92)",
            letterSpacing: "-0.5px",
            lineHeight:    1,
          }}>
            {temp}
            <span className="" style={{
              fontSize:   "13px",
              fontWeight: 300,
              color:      "rgba(255,255,255,0.50)",
              marginLeft: "1px",
            }}>°c</span>
          </span>
        )}

      </div>
    </div>
  );
}