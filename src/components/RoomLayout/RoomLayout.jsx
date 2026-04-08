import { useEffect, useRef, useCallback } from "react";
import { useDeviceStore } from "../../state/useDeviceStore";
import room from "../../assets/bedroom.png";

function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x+r,y); c.lineTo(x+w-r,y); c.arcTo(x+w,y,x+w,y+r,r);
  c.lineTo(x+w,y+h-r); c.arcTo(x+w,y+h,x+w-r,y+h,r);
  c.lineTo(x+r,y+h); c.arcTo(x,y+h,x,y+h-r,r);
  c.lineTo(x,y+r); c.arcTo(x,y,x+r,y,r);
  c.closePath();
}

function cctRgb(k) {
  if (k <= 3200) return [255,168,50];
  if (k <= 4200) return [255,200,105];
  if (k <= 5200) return [255,230,175];
  return [185,210,255];
}

function drawDownlight(c, x, y, on, br, lr, lg, lb) {
  if (on && br > 0) {
    const pool = c.createRadialGradient(x,y,0,x,y,55+br*35);
    pool.addColorStop(0, `rgba(${lr},${lg},${lb},${0.22*br})`);
    pool.addColorStop(0.4, `rgba(${lr},${lg},${lb},${0.10*br})`);
    pool.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
    c.fillStyle = pool;
    c.beginPath(); c.arc(x,y,55+br*35,0,Math.PI*2); c.fill();
  }
  c.strokeStyle = on?`rgba(${lr},${lg},${lb},${0.75+br*0.25})`:'rgba(255,255,255,0.12)';
  c.lineWidth = on?2.4:0.8;
  c.beginPath(); c.arc(x,y,5,0,Math.PI*2); c.stroke();
  if (on) {
    const hs = c.createRadialGradient(x,y,0,x,y,6);
    hs.addColorStop(0,`rgba(${lr},${lg},${lb},1)`);
    hs.addColorStop(1,`rgba(${lr},${lg},${lb},0)`);
    c.fillStyle=hs; c.beginPath(); c.arc(x,y,6,0,Math.PI*2); c.fill();
  }
}

const AC_MODES = ['COOL','HOT','AUTO','DRY'];
const MODE_CFG = {
  COOL: { w:[64,160,255],  border:'rgba(64,144,224,0.65)', led:'#2090ff', spread:'rgba(64,144,224,0.12)', b0:'#0e1e36', b1:'#060e1e', swing:'rgba(80,170,255,0.80)', temp:'rgba(110,195,255,0.92)', lbl:'rgba(80,170,255,0.75)' },
  HOT:  { w:[255,140,60],  border:'rgba(255,110,35,0.65)', led:'#ff5510', spread:'rgba(255,130,50,0.12)',  b0:'#281408', b1:'#180c04', swing:'rgba(255,155,75,0.80)',  temp:'rgba(255,165,85,0.92)',  lbl:'rgba(255,135,55,0.75)' },
  AUTO: { w:[100,220,130], border:'rgba(70,195,110,0.60)', led:'#28b855', spread:'rgba(80,200,115,0.10)',  b0:'#0c1e10', b1:'#06100a', swing:'rgba(95,215,130,0.75)', temp:'rgba(115,225,140,0.92)', lbl:'rgba(95,215,130,0.75)' },
  DRY:  { w:[90,195,255],  border:'rgba(70,190,255,0.55)', led:'#35ccff', spread:'rgba(90,185,255,0.09)',  b0:'#0c1e2c', b1:'#060e18', swing:'rgba(110,205,255,0.75)', temp:'rgba(115,210,255,0.92)', lbl:'rgba(95,205,255,0.75)' },
};

const BG_IMAGE_URL = room;

/* design size — all coordinates are authored at this size */
const DW = 600, DH = 400;

export default function RoomLayout() {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const fanAngleRef  = useRef(0);
  const acWindRef    = useRef(0);
  const acModeRef    = useRef(0);
  const bgImageRef   = useRef(null);
  const bgReadyRef   = useRef(false);
  const S            = useRef({});

  const {
    devices,
    toggleDimmer, toggleRelay, toggleScene,
    toggleFan, toggleAC, toggleCurtain, cycleACFanSpd,
  } = useDeviceStore();

  const lights  = devices.find(d => d.id === 0);
  const pendant = devices.find(d => d.id === 1);
  const scene   = devices.find(d => d.id === 2);
  const ac      = devices.find(d => d.id === 3);
  const fan     = devices.find(d => d.id === 4);
  const curtain = devices.find(d => d.id === 5);

  useEffect(() => {
    S.current = { lights, pendant, scene, ac, fan, curtain };
  }, [lights, pendant, scene, ac, fan, curtain]);

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
    const D = S.current;
    if (!D.lights) return;

    const br     = D.lights.on ? (D.lights.bright ?? 65) / 100 : 0;
    const cct    = D.lights.cct ?? 4000;
    const [lr,lg,lb] = cctRgb(cct);
    const fa     = fanAngleRef.current;
    const acWind = acWindRef.current;
    const acMode = AC_MODES[acModeRef.current];
    const mc     = MODE_CFG[acMode] || MODE_CFG.COOL;

    c.clearRect(0, 0, W, H);

    /* ── scale all drawing to 600×400 design space ── */
    c.save();
    c.scale(W / DW, H / DH);

    const WALL = 1;
    const WX=WALL, WY=WALL, WW=DW-WALL*2, WH=DH-WALL;

    /* ── background image ── */
    c.save();
    rr(c,WX,WY,WW,WH,12); c.clip();

    if (bgReadyRef.current && bgImageRef.current) {
      const img = bgImageRef.current;
      const imgAR  = img.width / img.height;
      const roomAR = WW / WH;
      let sx=22, sy=1, sw=img.width, sh=img.height;
      if (imgAR > roomAR) { sw = img.height * roomAR; sx = (img.width - sw) / 2; }
      else                { sh = img.width  / roomAR; sy = (img.height - sh) / 2; }
      c.drawImage(img, sx,sy,sw,sh, WX,WY,WW,WH);
    } else {
      const flG = c.createRadialGradient(WX+WW/2,WY+WH*0.45,0,WX+WW/2,WY+WH*0.45,WW*0.8);
      flG.addColorStop(0,'rgba(22,32,52,1)'); flG.addColorStop(1,'rgba(10,16,28,1)');
      c.fillStyle=flG; c.fillRect(WX,WY,WW,WH);
      c.strokeStyle=`rgba(255,255,255,${0.018+br*0.008})`; c.lineWidth=0.35;
      for(let x=WX;x<=WX+WW;x+=38){c.beginPath();c.moveTo(x,WY);c.lineTo(x,WY+WH);c.stroke();}
      for(let y=WY;y<=WY+WH;y+=38){c.beginPath();c.moveTo(WX,y);c.lineTo(WX+WW,y);c.stroke();}
    }

    /* light wash */
    if (br > 0) {
      const ag = c.createRadialGradient(WX+WW/2,WY+WH*0.38,0,WX+WW/2,WY+WH*0.38,WW*0.75);
      ag.addColorStop(0,`rgba(${lr},${lg},${lb},${0.12*br})`);
      ag.addColorStop(0.5,`rgba(${lr},${lg},${lb},${0.04*br})`);
      ag.addColorStop(1,`rgba(${lr},${lg},${lb},0)`);
      c.fillStyle=ag; c.fillRect(WX,WY,WW,WH);
    }
    if (D.scene.on) {
      const sg = c.createRadialGradient(WX+WW/2,WY+WH/2,0,WX+WW/2,WY+WH/2,WW*0.65);
      sg.addColorStop(0,'rgba(90,45,200,0.12)'); sg.addColorStop(1,'rgba(90,45,200,0)');
      c.fillStyle=sg; c.fillRect(WX,WY,WW,WH);
    }
    c.restore(); /* end clip */

    /* ── LED strip top ── */
    const sT=5, gS=50+br*44;
    const ledStrip = (side) => {
      let x1,y1,len;
      const horiz = side==='top'||side==='bottom';
      if (side==='top')    { x1=WX; y1=WY;        len=WW; }
      if (side==='bottom') { x1=WX; y1=WY+WH-sT;  len=WW; }
      if (side==='left')   { x1=WX; y1=WY;         len=WH; }
      if (side==='right')  { x1=WX+WW-sT; y1=WY;  len=WH; }
      if (br > 0) {
        let grad;
        if (side==='top')    { grad=c.createLinearGradient(0,y1+sT,0,y1+sT+gS);   grad.addColorStop(0,`rgba(${lr},${lg},${lb},${0.42*br})`); grad.addColorStop(0.35,`rgba(${lr},${lg},${lb},${0.14*br})`); grad.addColorStop(1,`rgba(${lr},${lg},${lb},0)`); c.fillStyle=grad; c.fillRect(x1,y1+sT,len,gS); }
        if (side==='bottom') { grad=c.createLinearGradient(0,y1-gS,0,y1);          grad.addColorStop(0,`rgba(${lr},${lg},${lb},0)`); grad.addColorStop(0.65,`rgba(${lr},${lg},${lb},${0.14*br})`); grad.addColorStop(1,`rgba(${lr},${lg},${lb},${0.42*br})`); c.fillStyle=grad; c.fillRect(x1,y1-gS,len,gS); }
        if (side==='left')   { grad=c.createLinearGradient(x1+sT,0,x1+sT+gS,0);   grad.addColorStop(0,`rgba(${lr},${lg},${lb},${0.36*br})`); grad.addColorStop(1,`rgba(${lr},${lg},${lb},0)`); c.fillStyle=grad; c.fillRect(x1+sT,y1,gS,len); }
        if (side==='right')  { grad=c.createLinearGradient(x1-gS,0,x1,0);          grad.addColorStop(0,`rgba(${lr},${lg},${lb},0)`); grad.addColorStop(1,`rgba(${lr},${lg},${lb},${0.36*br})`); c.fillStyle=grad; c.fillRect(x1-gS,y1,gS,len); }
      }
      c.fillStyle = br>0 ? `rgba(${lr},${lg},${lb},0.92)` : 'rgba(30,45,70,0.90)';
      if (horiz) c.fillRect(x1,y1,len,sT); else c.fillRect(x1,y1,sT,len);
      if (br > 0) {
        c.fillStyle = `rgba(${lr},${lg},${lb},1)`;
        const step=9, cnt=Math.floor(len/step);
        for (let i=0;i<cnt;i++) {
          const t=i*step+4;
          const dx=horiz?x1+t:x1+sT/2;
          const dy=horiz?y1+sT/2:y1+t;
          c.beginPath(); c.arc(dx,dy,0.9,0,Math.PI*2); c.fill();
        }
      }
    };
    ledStrip('top');

    /* ── lamps ── */
    const BX=WX+WW/2-73, BY=WY-10, BW=145;
    const lLX=BX-44, lRX=BX+BW+26, lY=BY+52;
    [lLX,lRX].forEach(lx => {
      if (D.pendant.on) {
        const lg3 = c.createRadialGradient(lx,lY,0,lx,lY,55);
        lg3.addColorStop(0,'rgba(255,185,55,0.40)');
        lg3.addColorStop(0.4,'rgba(255,185,55,0.14)');
        lg3.addColorStop(1,'rgba(255,185,55,0)');
        c.fillStyle=lg3; c.beginPath(); c.arc(lx,lY,55,0,Math.PI*2); c.fill();
      }
      const lampRG = c.createRadialGradient(lx,lY,0,lx,lY,16);
      lampRG.addColorStop(0, D.pendant.on?'#c89828':'rgba(255,255,255,0.40)');
      lampRG.addColorStop(1, D.pendant.on?'#906018':'rgba(255,255,255,0.15)');
      c.fillStyle=lampRG;
      c.strokeStyle=D.pendant.on?'rgba(255,200,65,0.65)':'rgba(255,255,255,0.40)'; c.lineWidth=1.2;
      c.beginPath(); c.arc(lx,lY,15,0,Math.PI*2); c.fill(); c.stroke();
      c.fillStyle=D.pendant.on?'#e8b838':'rgba(255,255,255,0.30)';
      c.beginPath(); c.arc(lx,lY,9,0,Math.PI*2); c.fill();
      if (D.pendant.on) {
        const inner = c.createRadialGradient(lx,lY,0,lx,lY,9);
        inner.addColorStop(0,'rgba(255,248,190,1)');
        inner.addColorStop(1,'rgba(200,150,50,0.3)');
        c.fillStyle=inner; c.beginPath(); c.arc(lx,lY,9,0,Math.PI*2); c.fill();
      }
      c.fillStyle=D.pendant.on?'rgba(255,255,220,0.95)':'rgba(255,255,255,0.30)';
      c.beginPath(); c.arc(lx,lY,3.5,0,Math.PI*2); c.fill();
    });

    /* ── downlights ── */
    [
      [WX+WW*0.28, WY+WH*0.28], [WX+WW*0.69, WY+WH*0.28],
      [WX+WW*0.28, WY+WH*0.50], [WX+WW*0.69, WY+WH*0.50],
      [WX+WW*0.28, WY+WH*0.72], [WX+WW*0.69, WY+WH*0.72],
      [WX+WW*0.48, WY+WH*0.72],
    ].forEach(([x,y]) => drawDownlight(c,x,y,D.lights.on,br,lr,lg,lb));

    /* ── AC unit ── */
    const ACX=WX+WW-51, ACY=WY+WH*0.32, ACW=40, ACH=128;
    const acOn = D.ac.on;
    if (acOn) {
      const [wr,wg,wb] = mc.w;
      for (let i=0;i<6;i++) {
        const offset = ((acWind*1.0+i*15)%95);
        const wx=ACX-4-offset, wy=ACY+18+i*13;
        const wLen=22+Math.sin((acWind*0.05+i*0.8))*8;
        const alpha=Math.max(0,0.65-offset/95*0.65);
        c.strokeStyle=`rgba(${wr},${wg},${wb},${alpha})`; c.lineWidth=1.4; c.lineCap='round';
        c.beginPath(); c.moveTo(wx,wy);
        c.bezierCurveTo(wx-wLen*0.28,wy-4,wx-wLen*0.72,wy+4,wx-wLen,wy); c.stroke();
      }
      c.lineCap='butt';
      const ledHalo = c.createRadialGradient(ACX+ACW-7,ACY+6,0,ACX+ACW-7,ACY+6,9);
      ledHalo.addColorStop(0,`rgba(${mc.w[0]},${mc.w[1]},${mc.w[2]},0.55)`);
      ledHalo.addColorStop(1,`rgba(${mc.w[0]},${mc.w[1]},${mc.w[2]},0)`);
      c.fillStyle=ledHalo; c.beginPath(); c.arc(ACX+ACW-7,ACY+6,9,0,Math.PI*2); c.fill();
      c.fillStyle=mc.led; c.beginPath(); c.arc(ACX+ACW-7,ACY+6,2.8,0,Math.PI*2); c.fill();
      c.font="700 10px 'JetBrains Mono',monospace"; c.textAlign='center';
      c.fillStyle=mc.temp; c.fillText(`${D.ac.temp}°`, ACX+ACW/2, ACY+ACH-10);
    }

    /* ── curtain ── */
    const CX  = WX + WW*0.24;
    const CY2 = WY + WH - 22;
    const CW  = WW*0.52;
    const CH  = 15;
    const cO  = D.curtain.pos / 100;

    /* valance */
    const valG = c.createLinearGradient(CX-1,CY2-10,CX-6,CY2);
    valG.addColorStop(0,'#2a2018'); valG.addColorStop(1,'#1a1410');
    c.fillStyle=valG; c.fillRect(CX-5,CY2+7,CW+12,10);
    c.strokeStyle='rgba(255,255,255,0.06)'; c.lineWidth=0.2;
    c.strokeRect(CX-5,CY2+7,CW+12,10);
    /* rod */
    c.fillStyle='#0a0e18'; c.fillRect(CX-6,CY2+8,CW+14,3);
    /* end caps */
    [[CX-6,CY2+9],[CX+CW+8,CY2+9]].forEach(([ex,ey]) => {
      c.fillStyle='rgba(120,160,220,0.35)';
      c.beginPath(); c.arc(ex,ey,3,0,Math.PI*2); c.fill();
    });

    const cpW    = (CW/2)*(1-cO*0.84);
    const fabricY = CY2-CH+9;

    if (cpW > 3) {
      ['l','r'].forEach(side => {
        const cx2 = side==='l' ? CX : CX+CW-cpW;
        const fabricG = c.createLinearGradient(cx2,fabricY,cx2+cpW,fabricY);
        if (side==='l') {
          fabricG.addColorStop(0.00,'#5a4530'); fabricG.addColorStop(0.15,'#4a3a28');
          fabricG.addColorStop(0.40,'#3e3020'); fabricG.addColorStop(0.70,'#362a1c');
          fabricG.addColorStop(0.88,'#3e3020'); fabricG.addColorStop(1.00,'#2a2014');
        } else {
          fabricG.addColorStop(0.00,'#2a2014'); fabricG.addColorStop(0.12,'#3e3020');
          fabricG.addColorStop(0.30,'#362a1c'); fabricG.addColorStop(0.60,'#3e3020');
          fabricG.addColorStop(0.85,'#4a3a28'); fabricG.addColorStop(1.00,'#5a4530');
        }
        c.fillStyle=fabricG; rr(c,cx2,fabricY,cpW,CH,5); c.fill();
        const foldCount=Math.max(12,Math.floor(cpW/12));
        const foldStep=cpW/foldCount;
        for (let fi=0;fi<foldCount;fi++) {
          const fx=cx2+fi*foldStep, fw=foldStep;
          const shadowG=c.createLinearGradient(fx,0,fx+fw*0.35,0);
          shadowG.addColorStop(0,'rgba(0,0,0,0.36)'); shadowG.addColorStop(1,'rgba(0,0,0,0)');
          c.fillStyle=shadowG; c.fillRect(fx,fabricY,fw*0.2,CH);
          const hlG=c.createLinearGradient(fx+fw*0.5,0,fx+fw,0);
          hlG.addColorStop(0.6,'rgba(255,255,255,0.055)'); hlG.addColorStop(1,'rgba(255,255,255,0.02)');
          c.fillStyle=hlG; c.fillRect(fx+fw*0.5,fabricY,fw*0.5,CH);
          if (fi>0) {
            c.strokeStyle='rgba(0,0,0,0.52)'; c.lineWidth=0.6;
            c.beginPath(); c.moveTo(fx,fabricY+2); c.lineTo(fx,fabricY+CH-2); c.stroke();
          }
        }
        c.strokeStyle='rgba(0,0,0,0.08)'; c.lineWidth=0.3;
        for (let ty=fabricY+3;ty<fabricY+CH-2;ty+=3) {
          c.beginPath(); c.moveTo(cx2+2,ty); c.lineTo(cx2+cpW-2,ty); c.stroke();
        }
        const edgeX = side==='l' ? cx2+cpW-2 : cx2+2;
        c.strokeStyle='rgba(180,150,100,0.22)'; c.lineWidth=1;
        c.beginPath(); c.moveTo(edgeX,fabricY+2); c.lineTo(edgeX,fabricY+CH-2); c.stroke();
        c.strokeStyle='rgba(0,0,0,0.28)'; c.lineWidth=0.5;
        rr(c,cx2,fabricY,cpW,CH,5); c.stroke();
      });
      if (cO>0.05) {
        const gapX=CX+cpW, gapW=CW-cpW*2;
        if (gapW>0) {
          const gapG=c.createLinearGradient(gapX,0,gapX+gapW,0);
          gapG.addColorStop(0,'rgba(180,210,255,0.04)');
          gapG.addColorStop(0.5,'rgba(180,210,255,0.09)');
          gapG.addColorStop(1,'rgba(180,210,255,0.04)');
          c.fillStyle=gapG; c.fillRect(gapX,fabricY,gapW,CH);
        }
      }
    }

    /* ── fan ── */
    const FCX=WX+WW/2, FCY=WY+WH*0.50;
    if (D.fan.speed>0) {
      for (let r=18;r<=18+D.fan.speed*8;r+=8) {
        c.strokeStyle=`rgba(80,150,255,${Math.max(0,0.06-r*0.001)})`; c.lineWidth=0.4;
        c.beginPath(); c.arc(FCX,FCY,r,0,Math.PI*2); c.stroke();
      }
    }
    c.save(); c.translate(FCX,FCY); c.rotate(fa*Math.PI/180);
    [60,180,300].forEach(a => {
      c.save(); c.rotate(a*Math.PI/180);
      const bG=c.createLinearGradient(0,-56,0,4);
      bG.addColorStop(0,D.fan.speed>0?'rgba(255,255,255,0.42)':'rgba(255,255,255,0.40)');
      bG.addColorStop(1,'rgba(255,255,255,0.12)');
      c.fillStyle=bG; c.strokeStyle='rgba(255,255,255,0.02)'; c.lineWidth=0.4;
      c.beginPath(); c.ellipse(0,-36,9,36,0,1,Math.PI*3); c.fill(); c.stroke();
      c.restore();
    });
    c.restore();
    const hubG=c.createRadialGradient(FCX,FCY,5,FCX,FCY,13);
    hubG.addColorStop(0,'rgba(255,255,255,0.95)');
    hubG.addColorStop(1,'rgba(255,255,255,0.10)');
    c.fillStyle=hubG;
    c.strokeStyle='rgba(255,255,255,0.40)'; c.lineWidth=1.1;
    c.beginPath(); c.arc(FCX,FCY,10,0,Math.PI*2); c.fill(); c.stroke();
    c.fillStyle='rgba(255,255,255,0.55)';
    c.beginPath(); c.arc(FCX,FCY,4,0,Math.PI*2); c.fill();

    /* ── end scale ── */
    c.restore();

  }, []);

  /* ── click handler — maps back to 600×400 design space ── */
  const handleClick = useCallback((e) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (DW / rect.width);
    const my = (e.clientY - rect.top)  * (DH / rect.height);

    const WALL=1, WX=WALL, WY=WALL, WW=DW-WALL*2, WH=DH-WALL;
    const BX=WX+WW/2-73, BY=WY-10, BW=145, BH=200;
    const lLX=BX-44, lRX=BX+BW+26, lY=BY+52;
    const ACX=WX+WW-51, ACY=WY+WH*0.32, ACW=40, ACH=128;
    const FCX=WX+WW/2, FCY=WY+WH*0.50;
    const CCX=WX+WW*0.24, CCY=WY+WH-22, CCW=WW*0.52, CCH=15;
    const d=(x1,y1,x2,y2)=>Math.sqrt((x1-x2)**2+(y1-y2)**2);
    const DL=[
      [WX+WW*0.28,WY+WH*0.28],[WX+WW*0.69,WY+WH*0.28],
      [WX+WW*0.28,WY+WH*0.50],[WX+WW*0.69,WY+WH*0.50],
      [WX+WW*0.28,WY+WH*0.72],[WX+WW*0.69,WY+WH*0.72],
      [WX+WW*0.48,WY+WH*0.72],
    ];

    if (my>WY&&my<WY+20&&mx>WX&&mx<WX+WW)        { toggleDimmer(0); return; }
    if (DL.some(([x,y])=>d(mx,my,x,y)<20))         { toggleDimmer(0); return; }
    if (d(mx,my,lLX,lY)<24||d(mx,my,lRX,lY)<24)   { toggleRelay(1);  return; }
    if (mx>BX&&mx<BX+BW&&my>BY&&my<BY+BH)          { toggleScene(2);  return; }
    if (mx>ACX-14&&mx<ACX+ACW&&my>ACY&&my<ACY+ACH) {
      mx < ACX+ACW/2
        ? toggleAC(3)
        : (acModeRef.current=(acModeRef.current+1)%AC_MODES.length, cycleACFanSpd(3));
      return;
    }
    if (mx>CCX&&mx<CCX+CCW&&my>CCY-CCH&&my<CCY+20) { toggleCurtain(5); return; }
    if (d(mx,my,FCX,FCY)<24)                         { toggleFan(4);    return; }
  }, [toggleDimmer,toggleRelay,toggleScene,toggleFan,toggleAC,toggleCurtain,cycleACFanSpd]);

  /* ── animation loop ── */
  useEffect(() => {
    let raf;
    const loop = () => {
      if (S.current.fan?.speed > 0)
        fanAngleRef.current = (fanAngleRef.current + S.current.fan.speed * 3) % 360;
      if (S.current.ac?.on)
        acWindRef.current = (acWindRef.current + 1.2) % 360;
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  /* ── resize observer ── */
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
        onClick={handleClick}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}