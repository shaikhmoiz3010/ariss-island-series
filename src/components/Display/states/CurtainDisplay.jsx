import { useEffect, useRef } from "react";

export default function CurtainDisplay({ device }) {
  const { pos, moving, dir } = device;
  const canvasRef = useRef(null);

  const pillText    = moving
    ? (dir === "open" ? "OPENING →" : "← CLOSING")
    : pos >= 100 ? "OPEN" : pos <= 0 ? "CLOSED" : "PAUSED";
  const pillVariant = moving || pos >= 100 ? "curtain" : "off";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c  = canvas.getContext("2d");
    const W  = canvas.width;
    const H  = canvas.height;

    c.clearRect(0, 0, W, H);

    /* ── window frame ── */
    const fX = 3, fY = 1, fW = W - 10, fH = H - 1;
    const fR = 3;




    /* ── curtain track rod ── */
    c.fillStyle   = "rgba(105,105,105)";
    c.fillRect(fX + 2, fY + 1, fW - 2, 1);


    /* ── curtain panels ── */
    /* pos 0 = fully closed (panels cover whole window)
       pos 100 = fully open (panels stacked at edges)   */
    const openFraction = pos / 100;
    /* how much each panel is pulled toward its edge */
    const stackW  = (fW / 2) * openFraction * 0.88;
    const panelW  = fW / 2 - stackW;
    const panelH  = fH - 5;
    const panelY  = fY + 2;

    /* left panel */
    if (panelW > 1) {
      drawCurtainPanel(c, fX + 5, panelY, panelW, panelH, "left", pos);
    }
    /* right panel */
    if (panelW > 1) {
      drawCurtainPanel(c, fX + fW - 3 - panelW, panelY, panelW, panelH, "right", pos);
    }

    /* ── paused icon overlay ── */
    if (!moving && pos > 0 && pos < 100) {
      const cx = W / 2, cy = H / 2 + 2;
      /* circle bg */
      c.fillStyle = "rgba(237,66,66)";
      c.beginPath(); c.arc(cx, cy, 11, 0, Math.PI * 2); c.fill();
      c.strokeStyle = "rgba(237,66,66)";
      c.lineWidth = 0.8;
      c.beginPath(); c.arc(cx, cy,8, 0, Math.PI * 2); c.stroke();
      /* two pause bars */
      c.fillStyle   = "rgba(255,255,255)";
      c.fillRect(cx - 4.5, cy - 5, 2.5, 11);
      c.fillRect(cx + 2,   cy - 5, 2.5, 11);
    }



  }, [pos, moving, dir]);

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "space-between",
      height:         "100%",
      padding:        "4px 28px 4px",

    }}>

      {/* top row — label + status pill */}


      {/* canvas — animated curtain */}
      <canvas
        ref={canvasRef}
        width={105}
        height={39}
        style={{ width: "100%", height: "39px", display: "block" }}
      />



    </div>
  );
}


function drawCurtainPanel(c, x, y, w, h, side, pos) {
  if (w < 1) return;

  /* fabric gradient */
  const g = c.createLinearGradient(x, y, x + w, y);
  if (side === "left") {
    g.addColorStop(0.00, "rgba(255,255,255)");
    g.addColorStop(0.30, "rgba(255,255,255)");
    g.addColorStop(0.70, "rgba(255,255,255)");
    g.addColorStop(1.00, "rgba(255,255,255)");
  } else {
    g.addColorStop(0.00, "rgba(255,255,255)");
    g.addColorStop(0.30, "rgba(255,255,255)");
    g.addColorStop(0.70, "rgba(255,255,255)");
    g.addColorStop(1.00, "rgba(255,255,255)");
  }
  c.fillStyle = g;
  c.fillRect(x, y, w, h);

  /* pleat fold lines */
  const foldCount = Math.max(2, Math.floor(w / 6));
  const foldStep  = w / foldCount;
  for (let i = 1; i < foldCount; i++) {
    const fx = x + i * foldStep;
    /* shadow */
    c.strokeStyle = "rgba(0,0,0,0.4)";
    c.lineWidth   = 0.8;
    c.beginPath(); c.moveTo(fx, y); c.lineTo(fx, y + h); c.stroke();
    /* highlight */
    c.strokeStyle = "rgba(143,143,143)";
    c.lineWidth   = 0.5;
    c.beginPath(); c.moveTo(fx + 1.8, y); c.lineTo(fx + 0.8, y + h); c.stroke();
  }

}
