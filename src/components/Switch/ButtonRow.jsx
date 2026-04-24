import { useState, useRef, useCallback, useEffect } from "react";
import { usePointer } from "../../hooks/usePointer";

const LIGHT_BUTTON_IDS = ["white", "silver", "mint"];

// ─── Luminance helper ─────────────────────────────────────────────────────────
function rgbStrToLuminance(rgbStr) {
  const parts = rgbStr.split(",").map(Number);
  if (parts.length < 3) return 0;
  const [r, g, b] = parts.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ─── Theme helpers ────────────────────────────────────────────────────────────
function hexToRgbStr(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`
    : "80,120,90";
}

const PRESETS = {
  green: {
    base: "68,118,82", mid: "55,98,68", dark: "38,72,48",
    rim:  "rgb(18,38,24)",
    label:      "rgba(255,255,255,0.85)",
    labelOn:    "rgba(255,255,255,1.0)",
    labelPress: "rgba(255,255,255,0.40)",
    divider: "rgba(0,0,0,0.35)",
    ripple:  "rgba(255,255,255,0.25)",
    isLight: false,
  },
  mint: {
    base: "162,194,172", mid: "142,176,154", dark: "118,152,132",
    rim:  "rgb(72,102,82)",
    label:      "rgba(12,30,18,0.90)",
    labelOn:    "rgba(8,22,12,1.0)",
    labelPress: "rgba(12,30,18,0.38)",
    divider: "rgba(0,0,0,0.16)",
    ripple:  "rgba(0,0,0,0.14)",
    isLight: true,
  },
};

function resolveTheme(buttonTheme) {
  if (!buttonTheme)            return PRESETS.green;
  if (PRESETS[buttonTheme.id]) return PRESETS[buttonTheme.id];

  const topRgb = hexToRgbStr(buttonTheme.top ?? "#5c8a6e");
  const midRgb = hexToRgbStr(buttonTheme.mid ?? "#4d7860");
  const botRgb = hexToRgbStr(buttonTheme.bot ?? "#3d6350");

  const lum     = rgbStrToLuminance(midRgb);
  const isLight = LIGHT_BUTTON_IDS.includes(buttonTheme.id) || lum > 0.25;

  return {
    base:    topRgb,
    mid:     midRgb,
    dark:    botRgb,
    rim:     buttonTheme.bot ?? "#3d6350",
    label:      isLight ? "rgba(10,20,30,0.18)"  : "rgba(255,255,255,0.88)",
    labelOn:    isLight ? "rgba(5,12,20,1.0)"    : "rgba(255,255,255,1.0)",
    labelPress: isLight ? "rgba(10,20,30,0.35)"  : "rgba(255,255,255,0.40)",
    divider:    isLight ? "rgba(0,0,0,0.16)"     : "rgba(255,255,255,0.12)",
    ripple:     isLight ? "rgba(0,0,0,0.14)"     : "rgba(255,255,255,0.28)",
    isLight,
  };
}

// ─── Canvas component ─────────────────────────────────────────────────────────
function AlumCanvas({ theme }) {
  const ref = useRef(null);
  useEffect(() => {
    const paint = () => { if (ref.current) paintAluminum(ref.current, theme); };
    paint();
    const ro = new ResizeObserver(paint);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [theme]);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none w-full h-full z-[1]"
    />
  );
}

// ─── HalfZone ─────────────────────────────────────────────────────────────────
function HalfZone({ side, label, isOn, theme, onTap, onDoubleTap, onHoldStart, onHoldStartRight, onHoldEnd }) {
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const zoneRef  = useRef(null);
  const rippleId = useRef(0);

  function spawnRipple(e) {
    const rect = zoneRef.current.getBoundingClientRect();
    const id   = rippleId.current++;
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600);
  }

  const handleDown = useCallback((e) => { setPressed(true);  spawnRipple(e); }, []);
  const handleUp   = useCallback(()  => { setPressed(false); }, []);

  const { onPointerDown, onPointerUp, onPointerCancel } = usePointer({
    onTap,
    onDoubleTap,
    onHoldStart: onHoldStartRight
      ? (e) => {
          const rect = zoneRef.current.getBoundingClientRect();
          (e?.clientX - rect.left) > rect.width / 2
            ? onHoldStartRight()
            : onHoldStart?.();
        }
      : onHoldStart,
    onHoldEnd,
  });

  return (
    <div
      ref={zoneRef}
      onPointerDown={(e) => { handleDown(e); onPointerDown(e); }}
      onPointerUp={()    => { handleUp();    onPointerUp();    }}
      onPointerCancel={() => { handleUp();   onPointerCancel(); }}
      className={`
        flex-1 relative overflow-hidden flex flex-col justify-center
        px-5 cursor-pointer select-none touch-none z-[2]
        ${side === "r" ? "items-end" : "items-start"}
      `}
      style={{
        transform:  pressed ? "translateY(1.5px) scaleY(0.985)" : "translateY(0) scaleY(1)",
        filter:     pressed ? "brightness(0.80)" : "brightness(1)",
        transition: pressed
          ? "transform 75ms ease-in,  filter 75ms ease-in"
          : "transform 150ms ease-out, filter 150ms ease-out",
      }}
    >
      {/* Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none animate-rippleOut z-[3]"
          style={{ left: r.x - 4, top: r.y - 4, background: theme.ripple }}
        />
      ))}

      {/* Label */}
      <span
        className="m-5 text-white relative text-[10px] font-sans font-light tracking-wider z-[10]"
        style={{ transition: "color 150ms" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── ButtonRow ────────────────────────────────────────────────────────────────
export default function ButtonRow({
  labelL, labelR, onL, onR, isFirst, isLast,
  buttonTheme,
  onTapL, onTapR, onDoubleTapL, onDoubleTapR,
  onHoldStartL, onHoldEndL, onHoldStartLRight,
  onHoldStartR, onHoldEndR,
}) {
  const theme = resolveTheme(buttonTheme);

  const borderRadius = isFirst ? "25px 25px 1px 1px"
    : isLast  ? "1px 1px 25px 25px"
    : "1px";

  return (
    <>
      <style>{`
        @keyframes rippleOut {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(9); opacity: 0;   }
        }
        .animate-rippleOut { animation: rippleOut 0.55s ease-out forwards; }
      `}</style>

      <div
        className="mx-1 flex h-[86px] relative overflow-hidden transition-all duration-[350ms] ease-in-out"
        style={{
          borderRadius,
          background: theme.rim,
          boxShadow: `
            inset 2px 0px 2px rgba(0,0,0,0.20),
            inset -1px 0px 2px rgba(0,0,0,0.58),
            0 3px 10px rgba(0,0,0,0.50),
            0 0px 3px rgba(0,0,0,0.35),
            0 8px 24px rgba(0,0,0,0.20)
          `,
        }}
      >
        <HalfZone
          side="l" label={labelL} isOn={onL} theme={theme}
          onTap={onTapL}     onDoubleTap={onDoubleTapL}
          onHoldStart={onHoldStartL} onHoldStartRight={onHoldStartLRight}
          onHoldEnd={onHoldEndL}
        />
        <HalfZone
          side="r" label={labelR} isOn={onR} theme={theme}
          onTap={onTapR}     onDoubleTap={onDoubleTapR}
          onHoldStart={onHoldStartR} onHoldEnd={onHoldEndR}
        />
      </div>
    </>
  );
}