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
    const pool = c.createRadialGradient(x, y, 0, x, y, 55 + br * 35);
    pool.addColorStop(0, `rgba(${lr},${lg},${lb},${0.22 * br})`);
    pool.addColorStop(0.4, `rgba(${lr},${lg},${lb},${0.10 * br})`);
    pool.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
    c.fillStyle = pool;
    c.beginPath(); c.arc(x, y, 55 + br * 35, 0, Math.PI * 2); c.fill();
  }
  c.strokeStyle = on ? `rgba(${lr},${lg},${lb},${0.75 + br * 0.25})` : 'rgba(255,255,255,0.99)';
  c.lineWidth = on ? 1.4 : 0.8;
  c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.stroke();
  if (on) {
    const hs = c.createRadialGradient(x, y, 0, x, y, 6);
    hs.addColorStop(0, `rgba(${lr},${lg},${lb},1)`);
    hs.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
    c.fillStyle = hs; c.beginPath(); c.arc(x, y, 6, 0, Math.PI * 2); c.fill();
  }
}
const AC_MODES = ['COOL', 'HOT', 'AUTO', 'DRY'];
const MODE_CFG = {
  COOL: { w: [64, 160, 255], border: 'rgba(64,144,224,0.65)', led: '#2090ff', spread: 'rgba(64,144,224,0.12)', b0: '#0e1e36', b1: '#060e1e', swing: 'rgba(80,170,255,0.80)', temp: 'rgba(110,195,255,0.92)', lbl: 'rgba(80,170,255,0.75)' },
  HOT:  { w: [255, 140, 60], border: 'rgba(255,110,35,0.65)', led: '#ff5510', spread: 'rgba(255,130,50,0.12)', b0: '#281408', b1: '#180c04', swing: 'rgba(255,155,75,0.80)', temp: 'rgba(255,165,85,0.92)', lbl: 'rgba(255,135,55,0.75)' },
  AUTO: { w: [100, 220, 130], border: 'rgba(70,195,110,0.60)', led: '#28b855', spread: 'rgba(80,200,115,0.10)', b0: '#0c1e10', b1: '#06100a', swing: 'rgba(95,215,130,0.75)', temp: 'rgba(115,225,140,0.92)', lbl: 'rgba(95,215,130,0.75)' },
  DRY:  { w: [90, 195, 255], border: 'rgba(70,190,255,0.55)', led: '#35ccff', spread: 'rgba(90,185,255,0.09)', b0: '#0c1e2c', b1: '#060e18', swing: 'rgba(110,205,255,0.75)', temp: 'rgba(115,210,255,0.92)', lbl: 'rgba(95,205,255,0.75)' },
};
const BG_IMAGE_URL = room;
const DW = 600, DH = 500;

// Speed step → degrees-per-frame when running
const SPEED_TO_DPF = { 1: 6, 2: 10, 3: 14, 4: 19 };

// Deceleration rate: degrees-per-frame² (how fast angular velocity bleeds off)
const DECEL = 0.12;

function byType(devices, type) {
  return devices.find(d => d.type === type) ?? null;
}

export default function RoomLayout() {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);

  // Fan physics
  const fanAngleRef   = useRef(0);   // current blade angle (degrees)
  const fanVelocRef   = useRef(0);   // current angular velocity (deg/frame)

  const acWindRef    = useRef(0);
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

    const fa     = fanAngleRef.current;
    const fanVel = fanVelocRef.current;   // used to draw motion blur alpha
    const acWind = acWindRef.current;
    const acMode = (ac?.mode && MODE_CFG[ac.mode]) ? ac.mode : 'COOL';
    const mc     = MODE_CFG[acMode];

    c.clearRect(0, 0, W, H);
    c.save();
    c.scale(W / DW, H / DH);

    const WALL = 1;
    const WX = WALL, WY = WALL, WW = DW + WALL * 12, WH = DH - WALL;

    // ── Background ──
    c.save();
    rr(c, WX, WY, WW, WH, 12); c.clip();
    if (bgReadyRef.current && bgImageRef.current) {
      const img = bgImageRef.current;
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
      ag.addColorStop(0, `rgba(${lr},${lg},${lb},${0.12 * br})`);
      ag.addColorStop(0.5, `rgba(${lr},${lg},${lb},${0.04 * br})`);
      ag.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
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
      grad.addColorStop(0, `rgba(${lr},${lg},${lb},${0.42 * br})`);
      grad.addColorStop(0.35, `rgba(${lr},${lg},${lb},${0.14 * br})`);
      grad.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
      c.fillStyle = grad; c.fillRect(WX, WY + sT, WW, gS);
    }
    c.fillStyle = br > 0 ? `rgba(${lr},${lg},${lb},0.92)` : 'rgba(255,255,255,0.50)';
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
        lg3.addColorStop(0, 'rgba(255,185,55,0.65)');
        lg3.addColorStop(0.4, 'rgba(255,185,55,0.4)');
        lg3.addColorStop(1, 'rgba(255,185,55,0)');
        c.fillStyle = lg3; c.beginPath(); c.arc(lx, lY, 55, 0, Math.PI * 2); c.fill();
      }
      const lampRG = c.createRadialGradient(lx, lY, 0, lx, lY, 16);
      // lampRG.addColorStop(0, pendantOn ? 'rgba(255,185,55,0.1)' : 'rgba(255,255,255,0.01)');
      // lampRG.addColorStop(1, pendantOn ? 'rgba(255,185,55,0.3)' : 'rgba(255,255,255,0.01)');
      // c.fillStyle = lampRG;
      c.strokeStyle = pendantOn ? 'rgba(255,200,65,0.05)' : 'rgba(255,255,255,0.010)'; c.lineWidth = 1.2;
      // c.beginPath(); c.arc(lx, lY, 15, 0, Math.PI * 2); c.fill(); c.stroke();
      // c.fillStyle = pendantOn ? '#e8b838' : 'rgba(255,255,255,0.010)';
      // c.beginPath(); c.arc(lx, lY, 9, 0, Math.PI * 2); c.fill();
      if (pendantOn) {
        const inner = c.createRadialGradient(lx, lY, 0, lx, lY, 9);
        // inner.addColorStop(0, 'rgba(255,248,190,1)');
        // inner.addColorStop(1, 'rgba(200,150,50,0.3)');
        // c.fillStyle = inner; c.beginPath(); c.arc(lx, lY, 9, 0, Math.PI * 2); c.fill();
      }
      // c.fillStyle = pendantOn ? 'rgba(255,255,220,0.95)' : 'rgba(255,255,255,0.010)';
      // c.beginPath(); c.arc(lx, lY, 3.5, 0, Math.PI * 2); c.fill();
    });

    // ── Downlights ──
    [
      [WX + WW * 0.24, WY + WH * 0.28], [WX + WW * 0.75, WY + WH * 0.28],
      [WX + WW * 0.24, WY + WH * 0.50], [WX + WW * 0.75, WY + WH * 0.50],
      [WX + WW * 0.24, WY + WH * 0.72], [WX + WW * 0.75, WY + WH * 0.72],
      [WX + WW * 0.48, WY + WH * 0.72],
    ].forEach(([x, y]) => drawDownlight(c, x, y, lights?.on ?? false, br, lr, lg, lb));

    // ── AC unit ──
    const ACX = WX + WW - 45, ACY = WY + WH * 0.35, ACW = 10, ACH = 145;
    const acOn = ac?.on ?? false;
    if (acOn) {
      const [wr, wg, wb] = mc.w;
      for (let i = 0; i < 6; i++) {
        const offset = ((acWind * 1.0 + i * 15) % 95);
        const wx2 = ACX - 4 - offset, wy2 = ACY + 18 + i * 13;
        const wLen = 22 + Math.sin((acWind * 0.05 + i * 0.8)) * 8;
        const alpha = Math.max(0, 0.65 - offset / 95 * 0.65);
        c.strokeStyle = `rgba(${wr},${wg},${wb},${alpha})`; c.lineWidth = 1.4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(wx2, wy2);
        c.bezierCurveTo(wx2 - wLen * 0.28, wy2 - 4, wx2 - wLen * 0.72, wy2 + 4, wx2 - wLen, wy2); c.stroke();
      }
      c.lineCap = 'butt';
      const ledHalo = c.createRadialGradient(ACX + ACW - 7, ACY + 6, 0, ACX + ACW - 7, ACY + 6, 9);
      ledHalo.addColorStop(0, `rgba(${mc.w[0]},${mc.w[1]},${mc.w[2]},0.55)`);
      ledHalo.addColorStop(1, `rgba(${mc.w[0]},${mc.w[1]},${mc.w[2]},0)`);
      c.fillStyle = ledHalo; c.beginPath(); c.arc(ACX + ACW - 7, ACY + 6, 9, 0, Math.PI * 2); c.fill();
      c.fillStyle = mc.led; c.beginPath(); c.arc(ACX + ACW - 7, ACY + 6, 2.8, 0, Math.PI * 2); c.fill();
      c.font = "700 10px 'JetBrains Mono',monospace"; c.textAlign = 'center';
      c.fillStyle = mc.temp; c.fillText(`${ac.temp}°`, ACX + ACW / 3, ACY + ACH - 4);
    }

    // ── Curtain ──
    const CX  = WX + WW * 0.19;
    const CY2 = WY + WH - 15;
    const CW  = WW * 0.55;
    const CH  = 18;
    const cPos = curtain?.pos ?? 0;
    const cO   = cPos / 100;

    const valG = c.createLinearGradient(CX - 1, CY2 - 10, CX - 6, CY2);
    valG.addColorStop(0, '#2a2018'); valG.addColorStop(1, '#1a1410');
    c.fillStyle = valG; c.fillRect(CX - 5, CY2 + 7, CW + 12, 10);
    c.strokeStyle = 'rgba(255,255,255,0.06)'; c.lineWidth = 0.2;
    c.strokeRect(CX - 5, CY2 + 7, CW + 12, 10);
    c.fillStyle = '#0a0e18'; c.fillRect(CX - 6, CY2 + 8, CW + 14, 3);
    [[CX - 6, CY2 + 9], [CX + CW + 8, CY2 + 9]].forEach(([ex, ey]) => {
      c.fillStyle = 'rgba(120,160,220,0.35)';
      c.beginPath(); c.arc(ex, ey, 3, 0, Math.PI * 2); c.fill();
    });
    const cpW     = (CW / 2) * (1 - cO * 0.84);
    const fabricY = CY2 - CH + 9;
    if (cpW > 3) {
      ['l', 'r'].forEach(side => {
        const cx2 = side === 'l' ? CX : CX + CW - cpW;
        const fabricG = c.createLinearGradient(cx2, fabricY, cx2 + cpW, fabricY);
        if (side === 'l') {
          fabricG.addColorStop(0.00, '#5a4530'); fabricG.addColorStop(0.15, '#4a3a28');
          fabricG.addColorStop(0.40, '#3e3020'); fabricG.addColorStop(0.70, '#362a1c');
          fabricG.addColorStop(0.88, '#3e3020'); fabricG.addColorStop(1.00, '#2a2014');
        } else {
          fabricG.addColorStop(0.00, '#2a2014'); fabricG.addColorStop(0.12, '#3e3020');
          fabricG.addColorStop(0.30, '#362a1c'); fabricG.addColorStop(0.60, '#3e3020');
          fabricG.addColorStop(0.85, '#4a3a28'); fabricG.addColorStop(1.00, '#5a4530');
        }
        c.fillStyle = fabricG; rr(c, cx2, fabricY, cpW, CH, 5); c.fill();
        const foldCount = Math.max(12, Math.floor(cpW / 12));
        const foldStep  = cpW / foldCount;
        for (let fi = 0; fi < foldCount; fi++) {
          const fx = cx2 + fi * foldStep, fw = foldStep;
          const shadowG = c.createLinearGradient(fx, 0, fx + fw * 0.35, 0);
          shadowG.addColorStop(0, 'rgba(0,0,0,0.36)'); shadowG.addColorStop(1, 'rgba(0,0,0,0)');
          c.fillStyle = shadowG; c.fillRect(fx, fabricY, fw * 0.2, CH);
          const hlG = c.createLinearGradient(fx + fw * 0.5, 0, fx + fw, 0);
          hlG.addColorStop(0.6, 'rgba(255,255,255,0.055)'); hlG.addColorStop(1, 'rgba(255,255,255,0.02)');
          c.fillStyle = hlG; c.fillRect(fx + fw * 0.5, fabricY, fw * 0.5, CH);
          if (fi > 0) {
            c.strokeStyle = 'rgba(0,0,0,0.52)'; c.lineWidth = 0.6;
            c.beginPath(); c.moveTo(fx, fabricY + 2); c.lineTo(fx, fabricY + CH - 2); c.stroke();
          }
        }
        c.strokeStyle = 'rgba(0,0,0,0.08)'; c.lineWidth = 0.3;
        for (let ty = fabricY + 3; ty < fabricY + CH - 2; ty += 3) {
          c.beginPath(); c.moveTo(cx2 + 2, ty); c.lineTo(cx2 + cpW - 2, ty); c.stroke();
        }
        const edgeX = side === 'l' ? cx2 + cpW - 2 : cx2 + 2;
        c.strokeStyle = 'rgba(180,150,100,0.22)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(edgeX, fabricY + 2); c.lineTo(edgeX, fabricY + CH - 2); c.stroke();
        c.strokeStyle = 'rgba(0,0,0,0.28)'; c.lineWidth = 0.5;
        rr(c, cx2, fabricY, cpW, CH, 5); c.stroke();
      });
      if (cO > 0.05) {
        const gapX = CX + cpW, gapW = CW - cpW * 2;
        if (gapW > 0) {
          const gapG = c.createLinearGradient(gapX, 0, gapX + gapW, 0);
          gapG.addColorStop(0, 'rgba(180,210,255,0.04)');
          gapG.addColorStop(0.5, 'rgba(180,210,255,0.09)');
          gapG.addColorStop(1, 'rgba(180,210,255,0.04)');
          c.fillStyle = gapG; c.fillRect(gapX, fabricY, gapW, CH);
        }
      }
    }

    // ── Fan ─────────────────────────────────────────────────────────────────
    const FCX = WX + WW * 0.5, FCY = WY + WH * 0.47;
    const fanSpeed = fan?.speed ?? 0;

    // Air-ring glow — fades with velocity
    const velNorm = Math.min(fanVel / 15, 1); // 0..1
    if (velNorm > 0.01) {
      for (let ring = 18; ring <= 18 + fanSpeed * 8; ring += 8) {
        c.strokeStyle = `rgba(80,150,255,${Math.max(0, 0.06 - ring * 0.001) * velNorm})`;
        c.lineWidth = 0.4;
        c.beginPath(); c.arc(FCX, FCY, ring, 0, Math.PI * 2); c.stroke();
      }
    }

    // Blades — opacity fades as they slow down so they "disappear" naturally
    const bladeAlpha = Math.min(0.9, 0.45 + velNorm * 0.95);

    c.save(); c.translate(FCX, FCY); c.rotate(fa * Math.PI / 180);
    [60, 180, 300].forEach(a => {
      c.save(); c.rotate(a * Math.PI / 180);
      const bG = c.createLinearGradient(0, -56, 0, 4);
      bG.addColorStop(0, `rgba(255,255,255,${bladeAlpha})`);
      bG.addColorStop(1, `rgba(255,255,255,${bladeAlpha})`);
      c.fillStyle   = `rgba(255,255,255,${bladeAlpha})`;
      c.strokeStyle = `rgba(255,255,255,${bladeAlpha})`;
      c.lineWidth   = 0.4;
      c.beginPath(); c.ellipse(0, -36, 9, 36, 0, 1, Math.PI * 3); c.fill(); c.stroke();
      c.restore();
    });
    c.restore();

    // Hub — always visible
    const hubG = c.createRadialGradient(FCX, FCY, 5, FCX, FCY, 13);
    hubG.addColorStop(0, 'rgba(255,255,255,0.75)');
    hubG.addColorStop(1, 'rgba(255,255,255,0.70)');
    c.fillStyle   = hubG;
    c.strokeStyle = 'rgba(255,255,255,0.70)'; c.lineWidth = 1.1;
    c.beginPath(); c.arc(FCX, FCY, 10, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.90)';
    c.beginPath(); c.arc(FCX, FCY, 4, 0, Math.PI * 2); c.fill();

    c.restore(); // end scale
  }, []);

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    let raf;

    const loop = () => {
      const devs    = S.current;
      const fan     = devs ? byType(devs, "fan") : null;
      const ac      = devs ? byType(devs, "ac")  : null;
      const fanSpeed = fan?.speed ?? 0;

      // Target velocity: what the fan SHOULD be spinning at right now
      const targetVel = fanSpeed > 0 ? (SPEED_TO_DPF[fanSpeed] ?? fanSpeed * 4) : 0;

      // Smoothly accelerate toward target; decelerate with inertia when off
      const currentVel = fanVelocRef.current;
      if (fanSpeed > 0) {
        // Spin up: lerp toward target velocity (feels like motor engaging)
        fanVelocRef.current = currentVel + (targetVel - currentVel) * 0.05;
      } else {
        // Spin down: subtract deceleration each frame (inertia / friction)
        const next = currentVel - DECEL;
        fanVelocRef.current = next < 0 ? 0 : next;
      }

      // Advance angle by current velocity
      if (fanVelocRef.current > 0.01) {
        fanAngleRef.current = (fanAngleRef.current + fanVelocRef.current) % 360;
      }

      // AC wind animation
      if (ac?.on) {
        acWindRef.current = (acWindRef.current + 1.2) % 360;
      }

      draw();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // ── Resize observer ──
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
      style={{
        width: '100%',
        aspectRatio: '3 / 2',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }}
      />
    </div>
  );
}