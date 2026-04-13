export default function ACTempDisplay({ device }) {
  const { temp } = device;
  const pct = ((temp - 16) / (30 - 16) * 100).toFixed(1);

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "center",
      height:         "100%",
      padding:        "4px 10px",
      gap:            "6px",
      boxSizing:      "border-box",
    }}>

      {/* label + value row */}
      <div className="" style={{ display:"flex", alignItems:"baseline", gap:"8px" }}>
        <span className="font-sans text-white " style={{
          fontSize:      "15px",
          fontWeight:    500,
          letterSpacing: "0.5px",
        }}>
          Temp.
        </span>
        <span style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "18px",
          fontWeight:    600,
          color:         "rgba(255,255,255,0.92)",
          letterSpacing: "-0.5px",
          lineHeight:    1,
        }}>
          {temp}
          <span style={{ fontSize:"13px", fontWeight:300, color:"rgba(255,255,255,0.45)", marginLeft:"1px" }}>°c</span>
        </span>
      </div>

      {/* slider track + blue dot */}
      <div style={{width:"90px", position:"relative", height:"1px" }}>
        {/* track */}
        <div style={{
          position:     "absolute",
          top:          "20%",
          transform:    "translateY(-50%)",
          left:         0,
          right:        0,
          height:       "6px",
          borderRadius: "6px",
          background:   "rgba(255,255,255,0.80)",
        }}/>
        {/* filled portion */}
        <div style={{
          position:     "absolute",
          top:          "50%",
          transform:    "translateY(-50%)",
          left:         0,
          width:        `${pct}%`,
          height:       "6px",
          borderRadius: "6px",
          background:   "rgba(255,255,255,0.55)",
          transition:   "width 0.2s ease",
        }}/>
        {/* blue dot thumb */}
        <div style={{
          position:     "absolute",
          top:          "50%",
          left:         `${pct}%`,
          transform:    "translate(-50%, -50%)",
          width:        "13px",
          height:       "13px",
          borderRadius: "50%",
          background:   "#3b82f6",
          boxShadow:    "0 0 6px rgba(59,130,246,0.70)",
          transition:   "left 0.2s ease",
          flexShrink:   0,
        }}/>
      </div>

    </div>
  );
}