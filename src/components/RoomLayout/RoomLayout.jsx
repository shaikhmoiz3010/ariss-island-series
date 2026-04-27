import { useEffect, useRef, useCallback } from "react";
import { useDeviceStore } from "../../state/useDeviceStore";
import room from "../../assets/layout5.png";

function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r);
  c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r);
  c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r);
  c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r);
  c.closePath();
}
function cctRgb(k) {
  if (k <= 3200) return [255, 168, 50];
  if (k <= 4200) return [255, 200, 105];
  if (k <= 5200) return [255, 230, 175];
  return [185, 210, 255];
}
function drawDownlight(c, x, y, on, br, lr, lg, lb) {
  if (on && br > 0) {
    const pool = c.createRadialGradient(x, y, 0, x, y, 56 + br * 55);
    pool.addColorStop(0,   `rgba(${lr},${lg},${lb},${0.42 * br})`);
    pool.addColorStop(0.1, `rgba(${lr},${lg},${lb},${0.20 * br})`);
    pool.addColorStop(1,   `rgba(${lr},${lg},${lb},0)`);
    c.fillStyle = pool;
    c.beginPath(); c.arc(x, y, 95 + br * 85, 0, Math.PI * 2); c.fill();
  }
  // c.lineWidth = on ? 1.4 : 0.1;
  // c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.stroke();
}

const MODE_CFG = {
  COOL: { w: [64,  160, 255], led: '#2090ff', temp: 'rgba(110,195,255,0.92)', core: [180, 235, 255] },
  HOT:  { w: [255, 140,  60], led: '#ff5510', temp: 'rgba(255,165,85,0.92)',  core: [255, 220, 190] },
  AUTO: { w: [100, 220, 130], led: '#28b855', temp: 'rgba(115,225,140,0.92)', core: [200, 255, 220] },
  DRY:  { w: [ 90, 195, 255], led: '#35ccff', temp: 'rgba(115,210,255,0.92)', core: [170, 230, 255] },
};

const BG_IMAGE_URL = room;
const DW = 600, DH = 500;
const SPEED_TO_DPF = { 1: 6, 2: 10, 3: 14, 4: 19 };
const DECEL = 0.12;

function byType(devices, type) {
  return devices.find(d => d.type === type) ?? null;
}

// ─── Draw one sonar arc wave ───────────────────────────────────────────────────
// cx, cy  : origin point (the AC vent)
// radius  : current radius of this arc
// phase   : 0..1 lifecycle — controls alpha and line weight
// wr,wg,wb: mode colour
// cr,cg,cb: core (bright) colour
// arcSpan : how many radians the arc spans (partial circle facing left)
function drawSonarArc(c, cx, cy, radius, phase, wr, wg, wb, cr, cg, cb) {
  if (radius <= 0) return;

  // Fade: starts faint when tiny, peaks in mid-life, fades at full size
  const alpha     = Math.pow(Math.sin(phase * Math.PI), 1.1) * 0.5;
  if (alpha < 0.02) return;

  // Arc spans roughly 140° facing LEFT (the direction air flows)
  // Centred on the horizontal-left direction from the vent
  const arcHalf   = (70 * Math.PI) / 280;   // 70° either side of leftward direction
  const startAng  = Math.PI - arcHalf;       // pointing upper-left
  const endAng    = Math.PI + arcHalf;       // pointing lower-left

  // Line gets thinner as it expands
  const glowW = (3.5 + (1 - phase) * 1) * (0.6 + alpha * 0.04);
  const coreW = (1.0 + (0 - phase) * 1.0);

  // ── Outer glow ──
  c.beginPath();
  c.arc(cx, cy, radius, startAng, endAng);
  c.strokeStyle = `rgba(${wr},${wg},${wb},${alpha * 0.015})`;
  c.lineWidth   = glowW * 1.2;
  c.lineCap     = 'round';
  c.stroke();

  // ── Mid glow ──
  c.beginPath();
  c.arc(cx, cy, radius, startAng, endAng);
  c.strokeStyle = `rgba(${wr},${wg},${wb},${alpha * 0.35})`;
  c.lineWidth   = glowW;
  c.lineCap     = 'round';
  c.stroke();

  // ── Bright core ──
  c.beginPath();
  c.arc(cx, cy, radius, startAng, endAng);
  c.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * 0.015})`;
  c.lineWidth   = coreW;
  c.lineCap     = 'round';
  c.stroke();
}

// ─── Curtain panel ────────────────────────────────────────────────────────────
function drawCurtainPanel(c, cx, cy, pw, ph, side, br, lr, lg, lb) {
  if (pw < 2) return;
  const pleatCount = Math.max(8, Math.floor(pw / 8));
  const pleatW     = pw / pleatCount;

  const fabricBase = c.createLinearGradient(0, cy, 0, cy + ph);
  fabricBase.addColorStop(0,   'hsl(34,44%,70%)');
  fabricBase.addColorStop(0.4, 'hsl(34,44%,68%)');
  fabricBase.addColorStop(1,   'hsl(34,40%,58%)');
  c.fillStyle = fabricBase;
  rr(c, cx, cy, pw, ph, 3); c.fill();

  for (let p = 0; p < pleatCount; p++) {
    const px      = cx + p * pleatW;
    const isFront = (p % 2 === (side === 'l' ? 0 : 1));
    const lightL  = isFront ? 76 : 52;
    const shadowL = isFront ? 62 : 42;

    const faceG = c.createLinearGradient(px, 0, px + pleatW, 0);
    faceG.addColorStop(0,    `hsl(34,44%,${lightL + 6}%)`);
    faceG.addColorStop(0.35, `hsl(34,44%,${lightL}%)`);
    faceG.addColorStop(0.72, `hsl(34,42%,${(lightL + shadowL) / 2}%)`);
    faceG.addColorStop(1,    `hsl(34,40%,${shadowL}%)`);
    c.fillStyle = faceG; c.fillRect(px, cy, pleatW, ph);

    const creaseW = Math.min(pleatW * 0.22, 4);
    const creaseG = c.createLinearGradient(px, 0, px + creaseW, 0);
    creaseG.addColorStop(0, `rgba(0,0,0,${isFront ? 0.18 : 0.32})`);
    creaseG.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = creaseG; c.fillRect(px, cy, creaseW, ph);

    if (isFront) {
      const sheenG = c.createLinearGradient(px + pleatW * 0.15, 0, px + pleatW * 0.65, 0);
      sheenG.addColorStop(0,   'rgba(255,255,255,0)');
      sheenG.addColorStop(0.4, 'rgba(255,255,255,0.10)');
      sheenG.addColorStop(1,   'rgba(255,255,255,0)');
      c.fillStyle = sheenG; c.fillRect(px, cy, pleatW, ph);
    }
    if (pleatW > 6) {
      c.strokeStyle = 'rgba(0,0,0,0.06)'; c.lineWidth = 0.4;
      for (let tx = px + pleatW * 0.5; tx < px + pleatW - 1; tx += 3.5) {
        c.beginPath(); c.moveTo(tx, cy + 2); c.lineTo(tx, cy + ph - 2); c.stroke();
      }
    }
  }

  const hemH = Math.max(3, ph * 0.10);
  const hemG = c.createLinearGradient(0, cy, 0, cy + hemH);
  hemG.addColorStop(0, 'hsl(34,42%,54%)'); hemG.addColorStop(1, 'hsl(34,42%,60%)');
  c.fillStyle = hemG; c.fillRect(cx, cy, pw, hemH);
  c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 0.8;
  c.beginPath(); c.moveTo(cx + 2, cy + 1); c.lineTo(cx + pw - 2, cy + 1); c.stroke();

  const bHemG = c.createLinearGradient(0, cy + ph - hemH, 0, cy + ph);
  bHemG.addColorStop(0, 'rgba(0,0,0,0)'); bHemG.addColorStop(1, 'rgba(0,0,0,0.22)');
  c.fillStyle = bHemG; c.fillRect(cx, cy + ph - hemH, pw, hemH);

  const edgeW = Math.min(pw * 0.08, 5);
  const edgeG = c.createLinearGradient(
    side === 'l' ? cx + pw - edgeW : cx, 0,
    side === 'l' ? cx + pw         : cx - edgeW, 0
  );
  edgeG.addColorStop(0, 'rgba(0,0,0,0.30)'); edgeG.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = edgeG;
  c.fillRect(side === 'l' ? cx + pw - edgeW : cx, cy, edgeW, ph);

  if (br > 0) {
    c.fillStyle = `rgba(${lr},${lg},${lb},${0.07 * br})`;
    c.fillRect(cx, cy, pw, ph);
  }
  c.strokeStyle = 'hsl(34,36%,42%)'; c.lineWidth = 0.6;
  rr(c, cx, cy, pw, ph, 3); c.stroke();
}

export default function RoomLayout() {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const fanAngleRef  = useRef(0);
  const fanVelocRef  = useRef(0);
  const acPhaseRef   = useRef(0);   // 0..1, drives arc expansion
  const bgImageRef   = useRef(null);
  const bgReadyRef   = useRef(false);
  const S            = useRef([]);

  const { devices } = useDeviceStore();
  useEffect(() => { S.current = devices; }, [devices]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => { bgImageRef.current = img; bgReadyRef.current = true; };
    img.onerror = () => { bgReadyRef.current = false; };
    img.src = BG_IMAGE_URL;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const devs = S.current;
    if (!devs || devs.length === 0) return;

    const lights  = byType(devs, "dimmer");
    const pendant = byType(devs, "relay");
    const scene   = byType(devs, "scene");
    const ac      = byType(devs, "ac");
    const fan     = byType(devs, "fan");
    const curtain = byType(devs, "curtain");

    const br  = (lights?.on && (lights?.bright ?? 65) > 0) ? (lights.bright ?? 65) / 100 : 0;
    const cct = lights?.cct ?? 4000;
    const [lr, lg, lb] = cctRgb(cct);

    const fa      = fanAngleRef.current;
    const fanVel  = fanVelocRef.current;
    const acPhase = acPhaseRef.current;
    const acMode  = (ac?.mode && MODE_CFG[ac.mode]) ? ac.mode : 'COOL';
    const mc      = MODE_CFG[acMode];
    const [wr, wg, wb] = mc.w;
    const [cr, cg, cb] = mc.core;

    c.clearRect(0, 0, W, H);
    c.save();
    c.scale(W / DW, H / DH);

    const WALL = 1;
    const WX = WALL, WY = WALL, WW = DW + WALL * 12, WH = DH - WALL;

    // ── Background ──
    c.save();
    rr(c, WX, WY, WW, WH, 12); c.clip();
    if (bgReadyRef.current && bgImageRef.current) {
      const img    = bgImageRef.current;
      const imgAR  = img.width / img.height;
      const roomAR = WW / WH;
      let sx = 2, sy = 1, sw = img.width, sh = img.height;
      if (imgAR > roomAR) { sw = img.height * roomAR; sx = (img.width - sw) / 2; }
      else                { sh = img.width / roomAR;  sy = (img.height - sh) / 2; }
      c.drawImage(img, sx, sy, sw, sh, WX, WY, WW, WH);
    } else {
      const flG = c.createRadialGradient(WX + WW / 2, WY + WH * 0.45, 0, WX + WW / 2, WY + WH * 0.45, WW * 0.8);
      flG.addColorStop(0, 'rgba(22,32,52,1)'); flG.addColorStop(1, 'rgba(10,16,28,1)');
      c.fillStyle = flG; c.fillRect(WX, WY, WW, WH);
    }
    if (br > 0) {
      const ag = c.createRadialGradient(WX + WW / 2, WY + WH * 0.38, 0, WX + WW / 2, WY + WH * 0.38, WW * 0.75);
      ag.addColorStop(0,   `rgba(${lr},${lg},${lb},${0.12 * br})`);
      ag.addColorStop(0.5, `rgba(${lr},${lg},${lb},${0.04 * br})`);
      ag.addColorStop(1,   `rgba(${lr},${lg},${lb},0)`);
      c.fillStyle = ag; c.fillRect(WX, WY, WW, WH);
    }
    if (scene?.on) {
      const sg = c.createRadialGradient(WX + WW / 2, WY + WH / 2, 0, WX + WW / 2, WY + WH / 2, WW * 0.65);
      sg.addColorStop(0, 'rgba(90,45,200,0.12)'); sg.addColorStop(1, 'rgba(90,45,200,0)');
      c.fillStyle = sg; c.fillRect(WX, WY, WW, WH);
    }
    c.restore();

    // ── LED strip ──
    const sT = 5, gS = 50 + br * 44;
    if (br > 0) {
      const grad = c.createLinearGradient(0, WY + sT, 0, WY + sT + gS);
      grad.addColorStop(0,    `rgba(${lr},${lg},${lb},${0.42 * br})`);
      grad.addColorStop(0.35, `rgba(${lr},${lg},${lb},${0.14 * br})`);
      grad.addColorStop(1,    `rgba(${lr},${lg},${lb},0)`);
      c.fillStyle = grad; c.fillRect(WX, WY + sT, WW, gS);
    }
    c.fillStyle = br > 0 ? `rgba(${lr},${lg},${lb},0.92)` : 'rgba(255,255,255,0.05)';
    c.fillRect(WX, WY, WW, sT);
    if (br > 0) {
      c.fillStyle = `rgba(${lr},${lg},${lb},1)`;
      const step = 9, cnt = Math.floor(WW / step);
      for (let i = 0; i < cnt; i++) {
        c.beginPath(); c.arc(WX + i * step + 4, WY + sT / 2, 0.9, 0, Math.PI * 2); c.fill();
      }
    }

    // ── Pendant lamps ──
    const BX = WX + WW / 2 - 105, BY = WY + 34, BW = 230;
    const lLX = BX - 44, lRX = BX + BW + 26, lY = BY + 52;
    const pendantOn = pendant?.on ?? false;
    [lLX, lRX].forEach(lx => {
      if (pendantOn) {
        const lg3 = c.createRadialGradient(lx, lY, 0, lx, lY, 55);
        lg3.addColorStop(0,   'rgba(255,185,55,0.65)');
        lg3.addColorStop(0.4, 'rgba(255,185,55,0.40)');
        lg3.addColorStop(1,   'rgba(255,185,55,0)');
        c.fillStyle = lg3; c.beginPath(); c.arc(lx, lY, 55, 0, Math.PI * 2); c.fill();
      }
    });

    // ── Downlights ──
    [
      [WX + WW * 0.24, WY + WH * 0.34], [WX + WW * 0.75, WY + WH * 0.34],
      [WX + WW * 0.24, WY + WH * 0.53], [WX + WW * 0.75, WY + WH * 0.53],
      [WX + WW * 0.24, WY + WH * 0.78], [WX + WW * 0.75, WY + WH * 0.78],
      [WX + WW * 0.50, WY + WH * 0.78],
    ].forEach(([x, y]) => drawDownlight(c, x, y, lights?.on ?? false, br, lr, lg, lb));

    // ══ AC UNIT + SONAR ARC WAVES ══════════════════════════════════════════════
    const ACX = WX + WW - 45;
    const ACY = WY + WH * 0.35;
    const ACW = 10;
    const ACH = 145;
    const acOn = ac?.on ?? false;

    const ventX = ACX - 11;
    const ventY = ACY + ACH * 0.42;

    if (acOn) {
      // Clip to left of wall so arcs don't draw behind the AC unit
      c.save();
      c.beginPath(); c.rect(WX, WY, ventX - WX + 2, WH); c.clip();

      // Soft ambient room glow
      const roomGlow = c.createRadialGradient(ventX, ventY, 0, ventX - 180, ventY, 350);
      roomGlow.addColorStop(0,    `rgba(${wr},${wg},${wb},0.06)`);
      roomGlow.addColorStop(0.40, `rgba(${wr},${wg},${wb},0.025)`);
      roomGlow.addColorStop(1,    `rgba(${wr},${wg},${wb},0)`);
      c.fillStyle = roomGlow; c.fillRect(WX, WY, WW, WH);

      // ── 5 arc waves, evenly staggered in phase ──
      // Max radius: arcs expand up to ~430px (most of room width)
      const ARC_COUNT  = 4;
      const MAX_RADIUS = 430;

      for (let i = 0; i < ARC_COUNT; i++) {
        // Each arc has its own lifecycle phase offset by 1/ARC_COUNT
        const arcPhase  = (acPhase + i / ARC_COUNT) % 1.0;
        const radius    = arcPhase * MAX_RADIUS;
        drawSonarArc(c, ventX, ventY, radius, arcPhase, wr, wg, wb, cr, cg, cb);
      }

      c.restore();

      // Vent glow (always on, gentle pulse)
      const pulse = 0.28 + Math.sin(acPhase * Math.PI * 0) * 0.08;
      const halo  = c.createRadialGradient(ventX, ventY, 0, ventX, ventY, 28);
      // halo.addColorStop(0,   `rgba(${cr},${cg},${cb},${pulse})`);
      halo.addColorStop(0.4, `rgba(${wr},${wg},${wb},${pulse * 0.35})`);
      halo.addColorStop(1,   `rgba(${wr},${wg},${wb},0)`);
      c.fillStyle = halo;
      c.beginPath(); c.ellipse(ventX - 3, ventY, 48, 100, 10, 0, Math.PI * 2); c.fill();

      // AC LED & temp
      const ledHalo = c.createRadialGradient(ACX + ACW - 7, ACY + 6, 0, ACX + ACW - 7, ACY + 6, 9);
      ledHalo.addColorStop(0, `rgba(${wr},${wg},${wb},0.55)`);
      ledHalo.addColorStop(1, `rgba(${wr},${wg},${wb},0)`);
      c.fillStyle = ledHalo; c.beginPath(); c.arc(ACX + ACW - 7, ACY + 6, 9, 0, Math.PI * 2); c.fill();
      c.fillStyle = mc.led;  c.beginPath(); c.arc(ACX + ACW - 7, ACY + 6, 2.8, 0, Math.PI * 2); c.fill();
      c.font = "700 10px 'JetBrains Mono',monospace"; c.textAlign = 'center';
      c.fillStyle = mc.temp; c.fillText(`${ac.temp}°`, ACX + ACW / 3, ACY + ACH - 4);
    }

    // ══ CURTAIN ════════════════════════════════════════════════════════════════
    const CX   = WX + WW * 0.15;
    const CY2  = WY + WH - 25;
    const CW   = WW * 0.65;
    const CH   = 20;
    const cPos = curtain?.pos ?? 0;
    const cO   = cPos / 100;

    c.fillStyle = 'rgba(0,0,0,0.28)';
    // c.fillRect(CX - 5, CY2 + 11, CW + 14, 4);
    const rodG = c.createLinearGradient(0, CY2 + 15, 0, CY2 + 13);
    // rodG.addColorStop(0,    '#7a7a8c'); rodG.addColorStop(0.25, '#c0c0d2');
    rodG.addColorStop(0.55, '#e8e8f4'); rodG.addColorStop(0.75, '#9090a4');
    rodG.addColorStop(1,    '#585868');
    c.fillStyle = rodG; c.fillRect(CX - 6, CY2 + 15, CW + 14, 6);
    // c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 0.6;
    c.beginPath(); c.moveTo(CX - 4, CY2 + 7.5); c.lineTo(CX + CW + 6, CY2 + 7.5); c.stroke();
    for (let rv = CX + 20; rv < CX + CW - 10; rv += 45) {
      const rvG = c.createRadialGradient(rv, CY2 + 10, 0, rv, CY2 + 10, 3);
      // rvG.addColorStop(0, 'rgba(255,255,255,0.22)'); rvG.addColorStop(1, 'rgba(0,0,0,0.12)');
      // c.fillStyle = rvG; c.beginPath(); c.arc(rv, CY2 + 10, 2.5, 0, Math.PI * 2); c.fill();
    }
    [[CX - 10, CY2 + 17], [CX + CW + 9, CY2 + 17]].forEach(([ex, ey]) => {
      const capG = c.createRadialGradient(ex, ey - 1.5, 0, ex, ey, 6);
      capG.addColorStop(0, '#e0e0f0'); capG.addColorStop(0.4, '#a0a0b8'); capG.addColorStop(1, '#404050');
      c.fillStyle = capG; c.beginPath(); c.arc(ex, ey, 6, 0, Math.PI * 2); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 0.8;
      c.beginPath(); c.arc(ex, ey, 6, 0, Math.PI * 2); c.stroke();
    });
    const ringCount = Math.ceil(CW / 30);
    for (let ri = 0; ri <= ringCount; ri++) {
      const rx = CX + (ri / ringCount) * CW;
      // c.strokeStyle = 'rgba(160,160,180,0.45)'; c.lineWidth = 1;
      // c.beginPath(); c.arc(rx, CY2 + 10, 3, Math.PI, 0); c.stroke();
    }
    const valH  = 10;
    const valGr = c.createLinearGradient(0, CY2, 0, CY2 + valH);
    // valGr.addColorStop(0, 'hsl(34,43%,56%)'); valGr.addColorStop(1, 'hsl(34,42%,50%)');
    c.fillStyle = valGr; c.fillRect(CX - 4, CY2, CW + 10, valH);
    c.strokeStyle = 'rgba(0,0,0,0.14)'; c.lineWidth = 0.5;
    c.strokeRect(CX - 4, CY2, CW + 10, valH);
    // c.strokeStyle = 'rgba(255,255,255,0.20)'; c.lineWidth = 0.7;
    c.beginPath(); c.moveTo(CX - 2, CY2 + 1); c.lineTo(CX + CW + 8, CY2 + 1); c.stroke();

    const fabricY = CY2 + valH;
    const cpW     = (CW / 2) * (1 - cO * 0.84);
    if (cpW > 3) {
      drawCurtainPanel(c, CX,            fabricY, cpW, CH - valH + 4, 'l', br, lr, lg, lb);
      drawCurtainPanel(c, CX + CW - cpW, fabricY, cpW, CH - valH + 4, 'r', br, lr, lg, lb);
      if (cO > 0.05) {
        const gapX = CX + cpW, gapW = CW - cpW * 2;
        if (gapW > 2) {
          const gapG = c.createLinearGradient(gapX, 0, gapX + gapW, 0);
          gapG.addColorStop(0, 'rgba(200,220,255,0.05)'); gapG.addColorStop(0.5, 'rgba(200,220,255,0.10)'); gapG.addColorStop(1, 'rgba(200,220,255,0.05)');
          c.fillStyle = gapG; c.fillRect(gapX, fabricY, gapW, CH - valH + 4);
          const esW = Math.min(gapW * 0.35, 7);
          const lE = c.createLinearGradient(gapX, 0, gapX + esW, 0);
          lE.addColorStop(0, 'rgba(0,0,0,0.20)'); lE.addColorStop(1, 'rgba(0,0,0,0)');
          c.fillStyle = lE; c.fillRect(gapX, fabricY, esW, CH - valH + 4);
          const rE = c.createLinearGradient(gapX + gapW, 0, gapX + gapW - esW, 0);
          rE.addColorStop(0, 'rgba(0,0,0,0.20)'); rE.addColorStop(1, 'rgba(0,0,0,0)');
          c.fillStyle = rE; c.fillRect(gapX + gapW - esW, fabricY, esW, CH - valH + 4);
        }
      }
    }

    // ── Fan ──
    const FCX      = WX + WW * 0.48, FCY = WY + WH * 0.42;
    const fanSpeed = fan?.speed ?? 0;
    const velNorm  = Math.min(fanVel / 19, 1);
    if (velNorm > 0.01) {
      for (let ring = 18; ring <= 18 + Math.max(fanSpeed, 1) * 8; ring += 8) {
        c.strokeStyle = `rgba(80,150,255,${Math.max(0, 0.06 - ring * 0.001) * velNorm})`;
        c.lineWidth = 0.4;
        c.beginPath(); c.arc(FCX, FCY, ring, 0, Math.PI * 2); c.stroke();
      }
    }
    const bladeAlpha = Math.min(0.9, 0.65 + velNorm * 0.95);
    c.save(); c.translate(FCX, FCY); c.rotate(fa * Math.PI / 180);
    [60, 180, 300].forEach(a => {
      c.save(); c.rotate(a * Math.PI / 180);
      c.fillStyle   = `rgba(255,255,255,${bladeAlpha})`;
      c.strokeStyle = `rgba(255,255,255,${bladeAlpha})`;
      c.lineWidth   = 0.4;
      c.beginPath(); c.ellipse(0, -36, 9, 36, 0, 1, Math.PI * 3); c.fill(); c.stroke();
      c.restore();
    });
    c.restore();
    const hubG = c.createRadialGradient(FCX, FCY, 5, FCX, FCY, 13);
    hubG.addColorStop(0, 'rgba(255,255,255,0.75)'); hubG.addColorStop(1, 'rgba(255,255,255,0.75)');
    c.fillStyle   = hubG;
    c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 1.1;
    c.beginPath(); c.arc(FCX, FCY, 10, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.90)';
    c.beginPath(); c.arc(FCX, FCY, 4, 0, Math.PI * 2); c.fill();

    c.restore();
  }, []);

  useEffect(() => {
    let raf;
    const loop = () => {
      const devs      = S.current;
      const fan       = devs ? byType(devs, "fan") : null;
      const ac        = devs ? byType(devs, "ac")  : null;
      const fanSpeed  = fan?.speed ?? 0;
      const targetVel = fanSpeed > 0 ? (SPEED_TO_DPF[fanSpeed] ?? fanSpeed * 4) : 0;
      const curVel    = fanVelocRef.current;
      if (fanSpeed > 0) {
        fanVelocRef.current = curVel + (targetVel - curVel) * 0.05;
      } else {
        const next = curVel - DECEL;
        fanVelocRef.current = next < 0 ? 0 : next;
      }
      if (fanVelocRef.current > 0.01)
        fanAngleRef.current = (fanAngleRef.current + fanVelocRef.current) % 360;
      // Advance arc phase — controls expansion speed
      if (ac?.on)
        acPhaseRef.current = (acPhaseRef.current + 0.005) % 1.0;
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const cv = canvasRef.current;
        if (!cv) return;
        cv.width  = Math.round(width);
        cv.height = Math.round(height);
        draw();
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div
      className="flex-1 w-full sm:min-h-0 rounded-2xl overflow-hidden transition-all duration-400"
      ref={containerRef}
      style={{ width: '100%', aspectRatio: '3 / 2', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }}
      />
    </div>
  );
}