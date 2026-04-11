export default function ApproachDisplay({ items, align = "left" }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "space-around",
      height:         "100%",
      width:          "100%",
      padding:        "5px 8px",
      boxSizing:      "border-box",
    }}>
      {items.map(({ iconOff, iconOn, label, on }, i) => (
        <div key={i} style={{
          display:       "flex",
          alignItems:    "center",
          flexDirection: align === "right" ? "row-reverse" : "row",
          gap:           "5px",
          width:         "100%",
        }}>

          {/* icon — colourful when on, b&w when off */}
          <img
            src={on ? iconOn : iconOff}
            alt={label}
            style={{
              width:      "13px",
              height:     "13px",
              flexShrink: 0,
              objectFit:  "contain",
              opacity:    on ? 1 : 0.45,
              transition: "opacity 0.25s ease",
            }}
          />

          {/* label */}
          <span style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "8.5px",
            letterSpacing: "0.04em",
            lineHeight:    1,
            flex:          1,
            color:         on ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.28)",
            textAlign:     align === "right" ? "right" : "left",
            transition:    "color 0.25s ease",
          }}>
            {label}
          </span>



        </div>
      ))}
    </div>
  );
}