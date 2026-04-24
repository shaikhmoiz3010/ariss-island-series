import { useState, useRef, useCallback } from "react";
import {
  Lightbulb, LightbulbOff, Fan, Snowflake,
  Blinds, Sparkles, SunDim, Sun,
  Settings, Power, ChevronDown, ChevronLeft, X,
  MoreHorizontal, Pencil, Home, Zap,
} from "lucide-react";
import { useDeviceStore } from "../../state/useDeviceStore";

const CL = {
  pageBg: "#FFFFFF", pageBg2: "#F5F5F5", cardBg: "#FFFFFF",
  shadowOff: "0 1px 2px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.10), 0 24px 48px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
  shadowOn: "0 2px 4px rgba(245,150,80,0.18), 0 6px 16px rgba(245,150,80,0.28), 0 16px 32px rgba(245,150,80,0.22), 0 28px 56px rgba(245,150,80,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
  onGrad: "linear-gradient(135deg, #FFD4A8 0%, #FFBC85 45%, #F5A963 100%)",
  textPri: "#2C2520", textSec: "#6B5E54", textTer: "#A8998C",
  textOnActive: "#5C3310", textOnSub: "#8B5E2A",
  accent: "#E8874A", accentDark: "#D27A2C",
  toggleOn: "#E8874A", toggleOff: "#D0C8C0",
  iconOff: "#B5AAA0", iconOn: "#E8974A",
  iconGlow: "drop-shadow(0 0 4px rgba(245,168,108,0.7)) drop-drop-shadow(0 0 10px rgba(245,168,108,0.45))",
  dk: "#1A1A1A", dkCard: "#242424", dkBorder: "#333",
  dkText: "#FFFFFF", dkDim: "#888888", dkMuted: "#555",
  blue: "#4A9EF5",
};

function DeviceIcon({ type, on = false, size = 26 }) {
  const color = on ? CL.iconOn : CL.iconOff;
  const style = on ? { filter: CL.iconGlow, transition: "filter 0.3s" } : { filter: "none", transition: "filter 0.3s" };
  const props = { size, color, strokeWidth: 1.8, style };
  if (type === "fan") return <Fan {...props} />;
  if (type === "ac") return <Snowflake {...props} />;
  if (type === "curtain") return <Blinds {...props} />;
  if (type === "scene") return <Sparkles {...props} />;
  if (type === "dimmer") return on ? <Sun {...props} /> : <SunDim {...props} />;
  return on ? <Lightbulb {...props} /> : <LightbulbOff {...props} />;
}

// Map your device structure to display format
function getStatus(device) {
  if (device.type === "relay") return device.on ? "ON" : "OFF";
  if (device.type === "scene") return device.on ? "Running..." : "Ready";
  if (device.type === "dimmer") {
    if (!device.on) return "OFF";
    return `${device.bright || 70}% · ${device.cct || 4000}K`;
  }
  if (device.type === "curtain") {
    const pos = device.pos || 0;
    if (pos === 0) return "Closed";
    if (pos === 100) return "Fully Open";
    return `Open ${Math.round(pos)}%`;
  }
  if (device.type === "fan") {
    return device.speed > 0 ? `Speed ${device.speed} of 4` : "OFF";
  }
  if (device.type === "ac") {
    if (!device.on) return "OFF";
    return `${device.temp || 24}°C · ${device.mode || "COOL"}`;
  }
  return device.on ? "ON" : "OFF";
}

function isDeviceOn(device) {
  if (device.type === "fan") return device.speed > 0;
  if (device.type === "curtain") return device.pos > 0;
  return device.on;
}

/* ── DarkSlider ── */
function DarkSlider({ value, min, max, onChange, color = "#fff" }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const [localValue, setLocalValue] = useState(value);
  
  // Sync local value with prop value when not dragging
  useState(() => {
    if (!isDragging.current) {
      setLocalValue(value);
    }
  });
  
  const pct = ((localValue - min) / (max - min)) * 100;
  
  const updateValue = useCallback((clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const newValue = Math.round(min + ratio * (max - min));
    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    // Update local value immediately for smooth UI
    setLocalValue(clampedValue);
    
    // Call onChange (store update)
    onChange(clampedValue);
  }, [min, max, onChange]);
  
  const handleStart = useCallback((e) => {
    isDragging.current = true;
    updateValue(e.clientX);
    
    if (trackRef.current) {
      trackRef.current.setPointerCapture(e.pointerId);
    }
    e.preventDefault();
    e.stopPropagation();
  }, [updateValue]);
  
  const handleMove = useCallback((e) => {
    if (isDragging.current) {
      updateValue(e.clientX);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [updateValue]);
  
  const handleEnd = useCallback((e) => {
    if (isDragging.current) {
      isDragging.current = false;
      
      if (trackRef.current && trackRef.current.hasPointerCapture(e.pointerId)) {
        trackRef.current.releasePointerCapture(e.pointerId);
      }
    }
  }, []);
  
  return (
    <div 
      ref={trackRef}
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
      style={{ 
        position: "relative", 
        height: 40, 
        cursor: isDragging.current ? "grabbing" : "grab", 
        touchAction: "none", 
        display: "flex", 
        alignItems: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent"
      }}
    >
      {/* Track background */}
      <div style={{ 
        position: "absolute", 
        left: 0, 
        right: 0, 
        height: 5, 
        borderRadius: 3, 
        background: "#444",
        pointerEvents: "none"
      }}>
        {/* Progress fill */}
        <div style={{ 
          height: "100%", 
          width: `${pct}%`, 
          borderRadius: 3, 
          background: color, 
          transition: isDragging.current ? "none" : "width 0.12s ease-out",
          pointerEvents: "none"
        }} />
      </div>
      
      {/* Thumb */}
      <div style={{ 
        position: "absolute", 
        left: `${pct}%`, 
        transform: "translateX(-50%)", 
        width: 24, 
        height: 24, 
        borderRadius: "50%", 
        background: "#fff", 
        boxShadow: isDragging.current 
          ? "0 4px 12px rgba(0,0,0,0.35), 0 0 0 4px rgba(255,255,255,0.1)" 
          : "0 2px 8px rgba(0,0,0,0.3)", 
        transition: isDragging.current ? "none" : "all 0.12s ease-out",
        pointerEvents: "none",
        willChange: "left"
      }} />
    </div>
  );
}

function CCTSlider({ value, onChange }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const [localValue, setLocalValue] = useState(value);
  const MIN = 2700, MAX = 6500;
  
  // Sync local value with prop value when not dragging
  useState(() => {
    if (!isDragging.current) {
      setLocalValue(value);
    }
  });
  
  const pct = ((localValue - MIN) / (MAX - MIN)) * 100;
  
  const updateValue = useCallback((clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const newValue = Math.round(MIN + ratio * (MAX - MIN));
    const clampedValue = Math.max(MIN, Math.min(MAX, newValue));
    
    // Update local value immediately for smooth UI
    setLocalValue(clampedValue);
    
    // Call onChange (store update)
    onChange(clampedValue);
  }, [onChange]);
  
  const handleStart = useCallback((e) => {
    isDragging.current = true;
    updateValue(e.clientX);
    
    if (trackRef.current) {
      trackRef.current.setPointerCapture(e.pointerId);
    }
    e.preventDefault();
    e.stopPropagation();
  }, [updateValue]);
  
  const handleMove = useCallback((e) => {
    if (isDragging.current) {
      updateValue(e.clientX);
      e.preventDefault();
      e.stopPropagation();
    }
  }, [updateValue]);
  
  const handleEnd = useCallback((e) => {
    if (isDragging.current) {
      isDragging.current = false;
      
      if (trackRef.current && trackRef.current.hasPointerCapture(e.pointerId)) {
        trackRef.current.releasePointerCapture(e.pointerId);
      }
    }
  }, []);
  
  return (
    <div 
      ref={trackRef}
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
      style={{ 
        position: "relative", 
        height: 36, 
        cursor: isDragging.current ? "grabbing" : "grab", 
        touchAction: "none", 
        display: "flex", 
        alignItems: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent"
      }}
    >
      {/* CCT gradient track */}
      <div style={{ 
        position: "absolute", 
        left: 0, 
        right: 0, 
        height: 10, 
        borderRadius: 5, 
        background: "linear-gradient(to right, #FF8C00 0%, #FFB347 25%, #FFF5E0 50%, #C5E3F5 75%, #87CEEB 100%)",
        pointerEvents: "none"
      }} />
      
      {/* Thumb */}
      <div style={{ 
        position: "absolute", 
        left: `${pct}%`, 
        transform: "translateX(-50%)", 
        width: 22, 
        height: 22, 
        borderRadius: "50%", 
        background: "#fff", 
        boxShadow: isDragging.current
          ? "0 4px 10px rgba(0,0,0,0.4), 0 0 0 3px rgba(232,135,74,0.6)"
          : "0 2px 6px rgba(0,0,0,0.35), 0 0 0 2px rgba(232,135,74,0.5)", 
        transition: isDragging.current ? "none" : "all 0.12s ease-out",
        pointerEvents: "none",
        willChange: "left"
      }} />
    </div>
  );
}

function PowerBtn({ isOn, onToggle, color = CL.blue }) {
  return (
    <div onClick={onToggle} style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isOn ? color : "#333", cursor: "pointer", boxShadow: isOn ? `0 0 20px ${color}55` : "none", transition: "all 0.3s" }}>
      <Power size={20} color={isOn ? "#fff" : "#666"} strokeWidth={2.2} />
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={(e) => { e.stopPropagation(); onChange(!value); }} style={{ width: 50, height: 28, borderRadius: 14, cursor: "pointer", position: "relative", background: value ? CL.toggleOn : CL.toggleOff, transition: "background 0.25s" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 25 : 3, transition: "left 0.25s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

/* ── Tile with long-press ── */
function Tile({ device, onTap, onExpand, onLongPress }) {
  const [pressed, setPressed] = useState(false);
  const timer = useRef(null);
  const isLong = useRef(false);
  const active = isDeviceOn(device);
  const showArrow = ["fan", "dimmer", "curtain", "ac"].includes(device.type);
  
  return (
    <div style={{ background: active ? CL.onGrad : CL.cardBg, borderRadius: 50, padding: "0 10px 0 14px", height: 54, boxShadow: active ? CL.shadowOn : CL.shadowOff, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s cubic-bezier(0.25,0.8,0.25,1)", transform: pressed ? "scale(0.97)" : "scale(1)", userSelect: "none", border: active ? "1px solid rgba(255,150,80,0.65)" : "1px solid transparent", borderTop: active ? "1px solid rgba(255,200,150,0.8)" : "1px solid rgba(255,255,255,1)" }}>
      <div 
        onPointerDown={() => { 
          isLong.current = false; 
          timer.current = setTimeout(() => { isLong.current = true; onLongPress(); }, 600); 
          setPressed(true); 
        }} 
        onPointerUp={() => { 
          clearTimeout(timer.current); 
          setPressed(false); 
          if (!isLong.current) onTap(); 
        }} 
        onPointerLeave={() => { 
          clearTimeout(timer.current); 
          setPressed(false); 
        }} 
        style={{ flex: 1, cursor: "pointer", touchAction: "none", minWidth: 0, overflow: "hidden" }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2, marginBottom: 2, color: active ? CL.textOnActive : CL.textPri, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{device.label}</div>
        <div style={{ fontSize: 10, lineHeight: 1.2, color: active ? CL.textOnSub : CL.textTer, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: active ? 600 : 500, letterSpacing: 0.2 }}>{getStatus(device)}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 4, flexShrink: 0 }}>
        <DeviceIcon type={device.type} on={active} size={22} />
        {showArrow && <div onClick={(e) => { e.stopPropagation(); onExpand(); }} style={{ cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}><ChevronDown size={20} color={active ? CL.textOnSub : CL.iconOff} fill={active ? CL.textOnSub : "#C5BDB5"} strokeWidth={0} /></div>}
      </div>
    </div>
  );
}

/* ── Bottom Sheet ── */
function BottomSheet({ children, onClose, maxH = "55%" }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
      <div style={{ position: "relative", background: CL.dk, borderRadius: "24px 24px 0 0", maxHeight: maxH, overflow: "auto", animation: "sheetUp 0.3s ease-out" }}>
        <div style={{ width: 36, height: 4, background: "#444", borderRadius: 2, margin: "10px auto 0" }} />
        {children}
      </div>
    </div>
  );
}

/* ── Mini Controls ── */
function MiniRelay({ device, toggleDevice }) {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: CL.dkText, marginBottom: 24 }}>{device.label}</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <PowerBtn isOn={device.on} onToggle={() => toggleDevice(device.id)} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: device.on ? CL.blue : "#666" }}>{device.on ? "ON" : "OFF"}</div>
    </div>
  );
}

function MiniScene({ device, toggleScene }) {
  const [running, setRunning] = useState(false);
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: CL.dkText, marginBottom: 24 }}>{device.label}</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div onClick={() => { setRunning(true); toggleScene(device.id); setTimeout(() => setRunning(false), 1500); }} style={{ width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: running ? CL.blue : "#333", cursor: "pointer", boxShadow: running ? `0 0 30px ${CL.blue}55` : "none", transition: "all 0.3s" }}>
          <Sparkles size={28} color={running ? "#fff" : "#666"} />
        </div>
      </div>
      <div style={{ fontSize: 13, color: running ? CL.blue : "#666" }}>{running ? "Running..." : "Tap to Run"}</div>
    </div>
  );
}

function MiniDimmer({ device, toggleDimmer, setBrightness, setCCT }) {
  const cctNormalized = ((device.cct || 4000) - 2700) / (6500 - 2700);
  const brightness = device.bright || 100;
  const on = device.on;
  
  return (
    <div style={{ padding: "14px 18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: CL.dkText }}>{device.label}</div>
        <PowerBtn isOn={on} onToggle={() => toggleDimmer(device.id)} />
      </div>
      
      {/* Light preview */}
      <div style={{ borderRadius: 18, height: 140, marginBottom: 14, position: "relative", background: `linear-gradient(to right, #B0D4F5 0%, #FFFFFF ${cctNormalized * 100}%, #F5A963  100%)`, opacity: on ? Math.max(brightness / 100, 0.25) : 0.25, overflow: "hidden", boxShadow: "inset 0 0 20px rgba(0,0,0,0.15)", transition: "opacity 0.3s" }}>
        <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", alignItems: "center", gap: 8, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          <Sun size={18} color="#fff" strokeWidth={2} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>{brightness}%</span>
        </div>
      </div>
      
      {/* CCT Temperature Control */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: CL.dkText }}>Temperature</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#E8874A" }}>{device.cct || 4000}K</span>
        </div>
        <CCTSlider 
          value={device.cct || 4000} 
          onChange={v => {
            if (!on) toggleDimmer(device.id);
            setCCT(device.id, v);
          }} 
        />
      </div>
      
      {/* Brightness Control */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: CL.dkDim }}>Brightness</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: CL.dkText }}>{brightness}%</span>
        </div>
        <DarkSlider 
          value={brightness} 
          min={0} 
          max={100} 
          onChange={v => {
            if (!on) toggleDimmer(device.id);
            setBrightness(device.id, v);
          }} 
          color="#fff" 
        />
      </div>
    </div>
  );
}

function MiniCurtain({ device, setCurtainPos }) {
  const position = device.pos || 0;
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: CL.dkText, marginBottom: 8 }}>{device.label}</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: CL.dkText }}>{Math.round(position)}<span style={{ fontSize: 18 }}>%</span></div>
      </div>
      <DarkSlider value={position} min={0} max={100} onChange={v => setCurtainPos(device.id, v)} />
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {[{ label: "CLOSE", pos: 0 }, { label: "PAUSE", pos: null }, { label: "OPEN", pos: 100 }].map(({ label, pos }) => (
          <div 
            key={label} 
            onClick={() => { if (pos !== null) setCurtainPos(device.id, pos); }} 
            style={{ 
              flex: 1, 
              padding: "12px 0", 
              textAlign: "center", 
              borderRadius: 10, 
              cursor: "pointer", 
              background: "#333", 
              fontSize: 12, 
              fontWeight: 600, 
              color: pos === null ? "#666" : CL.dkText, 
              border: "1px solid #444",
              transition: "all 0.2s",
              opacity: pos === null ? 0.5 : 1
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniFan({ device, toggleFan, setFanSpeed }) {
  const on = device.speed > 0;
  const speed = device.speed || 1;
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: CL.dkText }}>{device.label}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <PowerBtn isOn={on} onToggle={() => toggleFan(device.id)} color={CL.blue} />
      </div>
      
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: CL.dkDim }}>Speed </span>
        <span style={{ fontSize: 26, fontWeight: 700, color: on ? CL.blue : "#666" }}>{speed}</span>
      </div>
      
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3, 4].map(l => (
          <div 
            key={l} 
            onClick={() => {
              if (!on) toggleFan(device.id);
              setFanSpeed(device.id, l);
            }} 
            style={{ 
              flex: 1, 
              padding: "14px 0", 
              textAlign: "center", 
              borderRadius: 10, 
              cursor: "pointer", 
              background: speed === l ? CL.blue : "#333", 
              color: speed === l ? "#fff" : "#666", 
              fontSize: 15, 
              fontWeight: 700, 
              border: `1px solid ${speed === l ? CL.blue : "#444"}`, 
              transition: "all 0.2s" 
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniAC({ device, toggleAC, setACTemp, cycleACMode, cycleACFanSpd }) {
  const AC_MODES = ["COOL", "HOT", "AUTO", "DRY"];
  const AC_SPEEDS = ["LOW", "MED", "HIGH"];
  const on = device.on;
  const temp = device.temp || 24;
  const mode = device.mode || "COOL";
  const fanSpd = device.fanSpd || "MED";
  
  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: CL.dkText }}>{device.label}</div>
        <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 6px" }}>
          <PowerBtn isOn={on} onToggle={() => toggleAC(device.id)} />
        </div>
      </div>
      
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 42, fontWeight: 700, color: on ? CL.blue : "#666" }}>{temp}</span>
        <span style={{ fontSize: 16, color: CL.dkDim }}>°C</span>
      </div>
      
      {/* Temperature Slider */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: CL.dkDim, marginBottom: 4 }}>
          <span>Set Temperature</span>
          <span style={{ color: CL.dkText }}>{temp}°C</span>
        </div>
        <DarkSlider 
          value={temp} 
          min={16} 
          max={30} 
          onChange={v => {
            if (!on) toggleAC(device.id);
            setACTemp(device.id, v);
          }} 
          color={CL.blue} 
        />
      </div>
      
      {/* Mode Selector */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "#666", marginBottom: 6, letterSpacing: 1 }}>MODE</div>
        <div style={{ display: "flex", gap: 6 }}>
          {AC_MODES.map(m => (
            <div 
              key={m} 
              onClick={() => {
                if (!on) toggleAC(device.id);
                cycleACMode(device.id);
              }} 
              style={{ 
                flex: 1, 
                padding: "8px 0", 
                textAlign: "center", 
                borderRadius: 8, 
                cursor: "pointer", 
                fontSize: 10, 
                fontWeight: 700, 
                background: mode === m ? CL.blue : "#333", 
                color: mode === m ? "#fff" : "#666", 
                border: `1px solid ${mode === m ? CL.blue : "#444"}`,
                transition: "all 0.2s"
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>
      
      {/* Fan Speed Selector */}
      <div>
        <div style={{ fontSize: 10, color: "#666", marginBottom: 6, letterSpacing: 1 }}>FAN SPEED</div>
        <div style={{ display: "flex", gap: 6 }}>
          {AC_SPEEDS.map(s => (
            <div 
              key={s} 
              onClick={() => {
                if (!on) toggleAC(device.id);
                cycleACFanSpd(device.id);
              }} 
              style={{ 
                flex: 1, 
                padding: "8px 0", 
                textAlign: "center", 
                borderRadius: 8, 
                cursor: "pointer", 
                fontSize: 10, 
                fontWeight: 700, 
                background: fanSpd === s ? CL.blue : "#333", 
                color: fanSpd === s ? "#fff" : "#666", 
                border: `1px solid ${fanSpd === s ? CL.blue : "#444"}`,
                transition: "all 0.2s"
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniAppSheet({ device, onClose }) {
  const { toggleDimmer, toggleRelay, toggleScene, toggleFan, toggleAC, toggleCurtain,
    setBrightness, setCCT, setFanSpeed, setACTemp, cycleACMode, cycleACFanSpd, setCurtainPos } = useDeviceStore();
  
  if (!device) return null;
  
  const controls = {
    relay: () => <MiniRelay device={device} toggleDevice={toggleRelay} />,
    scene: () => <MiniScene device={device} toggleScene={toggleScene} />,
    dimmer: () => <MiniDimmer device={device} toggleDimmer={toggleDimmer} setBrightness={setBrightness} setCCT={setCCT} />,
    curtain: () => <MiniCurtain device={device} setCurtainPos={setCurtainPos} />,
    fan: () => <MiniFan device={device} toggleFan={toggleFan} setFanSpeed={setFanSpeed} />,
    ac: () => <MiniAC device={device} toggleAC={toggleAC} setACTemp={setACTemp} cycleACMode={cycleACMode} cycleACFanSpd={cycleACFanSpd} />,
  };
  
  const Ctrl = controls[device.type] || controls.relay;
  const maxH = device.type === "dimmer" ? "68%" : device.type === "ac" ? "70%" : "55%";
  
  return <BottomSheet onClose={onClose} maxH={maxH}><Ctrl /></BottomSheet>;
}

/* ── Config Page (Long-press editor) ── */
function ConfigPage({ device, onClose }) {
  const updateDevice = useDeviceStore((s) => s.updateDevice);
  const [editing, setEditing] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  
  if (!device) return null;
  
  const funcTypes = [
    { key: "relay", label: "Set Regular Switch" },
    { key: "scene", label: "Set Scene Switch" },
    { key: "dimmer", label: "Set Dimming Switch" },
    { key: "curtain", label: "Set Curtain Switch" },
    { key: "fan", label: "Set Fan Control" },
    { key: "ac", label: "Set AC Control" },
  ];
  const iconTypes = ["relay", "dimmer", "fan", "ac", "curtain", "scene"];
  
  const upd = (updates) => {
    updateDevice(device.id, updates);
  };
  
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
      <div style={{ width: "100%", background: CL.pageBg2, borderRadius: 24, maxHeight: "88%", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 8px" }}>
          <div onClick={onClose} style={{ cursor: "pointer" }}><ChevronLeft size={20} color={CL.textPri} /></div>
          <div style={{ fontSize: 16, fontWeight: 700, color: CL.accentDark }}>{device.label}</div>
          <div style={{ display: "flex", gap: 8 }}><MoreHorizontal size={16} color={CL.textTer} /><div onClick={onClose} style={{ cursor: "pointer" }}><X size={16} color={CL.textTer} /></div></div>
        </div>
        <div style={{ padding: "4px 14px 20px" }}>
          {editing ? (
            <div style={{ background: CL.cardBg, borderRadius: 12, padding: "10px 14px", marginBottom: 6, boxShadow: CL.shadowOff }}>
              <input autoFocus value={device.label} onChange={e => upd({ label: e.target.value })} onBlur={() => setEditing(false)} onKeyDown={e => { if (e.key === "Enter") setEditing(false); }} style={{ width: "100%", padding: "4px 0", background: "transparent", border: "none", borderBottom: `1.5px solid ${CL.accent}`, color: CL.textPri, fontSize: 14, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
            </div>
          ) : (
            <div onClick={() => setEditing(true)} style={{ background: CL.cardBg, borderRadius: 12, padding: "12px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", boxShadow: CL.shadowOff }}>
              <span style={{ fontSize: 13, color: CL.textSec }}>Change name</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 13, fontWeight: 600, color: CL.textPri }}>{device.label}</span><Pencil size={12} color={CL.textTer} /></div>
            </div>
          )}
          <div onClick={() => setIconOpen(!iconOpen)} style={{ background: CL.cardBg, borderRadius: 12, padding: "12px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", boxShadow: CL.shadowOff }}>
            <span style={{ fontSize: 13, color: CL.textSec }}>Select Icon</span>
            <DeviceIcon type={device.type} on={true} size={24} />
          </div>
          {iconOpen && (
            <div style={{ background: CL.cardBg, borderRadius: 12, padding: 10, marginBottom: 6, boxShadow: CL.shadowOff, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {iconTypes.map(t => <div key={t} onClick={() => { upd({ type: t }); setIconOpen(false); }} style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: device.type === t ? `${CL.accent}20` : CL.pageBg2, border: `2px solid ${device.type === t ? CL.accent : "transparent"}`, transition: "all 0.2s" }}><DeviceIcon type={t} on={device.type === t} size={20} /></div>)}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            {funcTypes.map(ft => {
              const sel = device.type === ft.key;
              return (
                <div key={ft.key} onClick={() => upd({ type: ft.key })} style={{ background: sel ? CL.onGrad : CL.cardBg, borderRadius: 12, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: sel ? CL.shadowOn : CL.shadowOff, borderTop: sel ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,1)", transition: "all 0.2s" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, border: sel ? "none" : "2px solid #C8C0B8", background: sel ? CL.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: sel ? 600 : 400, color: sel ? CL.textOnActive : CL.textPri }}>{ft.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Settings Page ── */
function SettingsPage({ onClose }) {
  const [settings, setSettings] = useState({
    backlight: true,
    backlightBrightness: 40,
    motionSensor: true,
    screenSaver: "Clock only",
    displayBrightness: 100,
    motionSensitivity: "Low",
    momentary: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
    restartStatus: { 1: "Last Status", 2: "Last Status", 3: "Last Status", 4: "Last Status", 5: "Last Status", 6: "Last Status", 7: "Last Status" }
  });
  const [sub, setSub] = useState(null);
  
  const upd = (updates) => setSettings(p => ({ ...p, ...updates }));
  
  const Pill = ({ label, right, onClick, toggle, onToggle }) => (
    <div onClick={onClick} style={{ background: CL.cardBg, borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: CL.shadowOff, cursor: onClick ? "pointer" : "default", borderTop: "1px solid rgba(255,255,255,1)" }}>
      <span style={{ fontSize: 13, color: CL.textPri, fontWeight: 500 }}>{label}</span>
      {toggle !== undefined ? <Toggle value={toggle} onChange={onToggle} /> : <span style={{ fontSize: 12, color: CL.textSec }}>{right}</span>}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, background: CL.pageBg, overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
        <div onClick={onClose} style={{ cursor: "pointer" }}><ChevronLeft size={20} color={CL.accent} /></div>
        <span style={{ fontSize: 16, fontWeight: 700, color: CL.accentDark }}>Settings</span>
        <MoreHorizontal size={16} color={CL.accent} />
      </div>
      <div style={{ padding: "4px 14px 32px" }}>
        <Pill label="Switch Backlight" toggle={settings.backlight} onToggle={v => upd({ backlight: v })} />
        <Pill label="Backlight Brightness" right={`${settings.backlightBrightness}% >`} onClick={() => setSub("brightness")} />
        <Pill label="Motion Sensor" toggle={settings.motionSensor} onToggle={v => upd({ motionSensor: v })} />
        <Pill label="Screen Saver" right={`${settings.screenSaver} >`} onClick={() => setSub("screensaver")} />
        <Pill label="Display Brightness" right={`${settings.displayBrightness}% >`} onClick={() => setSub("displayBrightness")} />
        <Pill label="Motion Sensitivity" right={`${settings.motionSensitivity} >`} onClick={() => setSub("sensitivity")} />
        <Pill label="Momentary Switch" right="Configure >" onClick={() => setSub("momentary")} />
        <Pill label="Restart Status" right="Configure >" onClick={() => setSub("restart")} />
        <Pill label="ARISS island Switch Ver." right="1.0.2" />
      </div>
      
      {/* Backlight Brightness Sub-sheet */}
      {sub === "brightness" && (
        <BottomSheet onClose={() => setSub(null)} maxH="50%">
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${CL.dkBorder}` }}>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>Close</span>
            <span style={{ color: CL.accent, fontWeight: 700, fontSize: 14 }}>Backlight Brightness</span>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>OK</span>
          </div>
          <div style={{ padding: "28px 20px", textAlign: "center", color: CL.dkText }}>
            <div style={{ fontSize: 38, fontWeight: 700, marginBottom: 24 }}>{settings.backlightBrightness}%</div>
            <DarkSlider value={settings.backlightBrightness} min={0} max={100} onChange={v => upd({ backlightBrightness: v })} />
          </div>
        </BottomSheet>
      )}
      
      {/* Display Brightness Sub-sheet */}
      {sub === "displayBrightness" && (
        <BottomSheet onClose={() => setSub(null)} maxH="50%">
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${CL.dkBorder}` }}>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>Close</span>
            <span style={{ color: CL.accent, fontWeight: 700, fontSize: 14 }}>Display Brightness</span>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>OK</span>
          </div>
          <div style={{ padding: "28px 20px", textAlign: "center", color: CL.dkText }}>
            <div style={{ fontSize: 38, fontWeight: 700, marginBottom: 24 }}>{settings.displayBrightness}%</div>
            <DarkSlider value={settings.displayBrightness} min={0} max={100} onChange={v => upd({ displayBrightness: v })} />
          </div>
        </BottomSheet>
      )}
      
      {/* Screen Saver Sub-sheet */}
      {sub === "screensaver" && (
        <BottomSheet onClose={() => setSub(null)} maxH="50%">
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${CL.dkBorder}` }}>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>Close</span>
            <span style={{ color: CL.accent, fontWeight: 700, fontSize: 14 }}>Screen Saver</span>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>OK</span>
          </div>
          <div style={{ padding: "14px 20px", color: CL.dkText }}>
            {["Clock only", "Clock + weather", "Disable"].map(o => (
              <div 
                key={o} 
                onClick={() => { upd({ screenSaver: o }); setSub(null); }} 
                style={{ 
                  padding: "12px 14px", 
                  borderRadius: 10, 
                  marginBottom: 6, 
                  cursor: "pointer", 
                  background: settings.screenSaver === o ? "#333" : "transparent", 
                  color: settings.screenSaver === o ? CL.accent : CL.dkDim, 
                  fontSize: 14, 
                  border: `1px solid ${settings.screenSaver === o ? "#444" : "#333"}` 
                }}
              >
                {o}
              </div>
            ))}
          </div>
        </BottomSheet>
      )}
      
      {/* Sensitivity Sub-sheet */}
      {sub === "sensitivity" && (
        <BottomSheet onClose={() => setSub(null)} maxH="50%">
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${CL.dkBorder}` }}>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>Close</span>
            <span style={{ color: CL.accent, fontWeight: 700, fontSize: 14 }}>Sensor Sensitivity</span>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>OK</span>
          </div>
          <div style={{ padding: "14px 20px", color: CL.dkText }}>
            {["Low", "Medium", "High"].map(l => (
              <div 
                key={l} 
                onClick={() => { upd({ motionSensitivity: l }); setSub(null); }} 
                style={{ 
                  padding: "12px 14px", 
                  borderRadius: 10, 
                  marginBottom: 6, 
                  cursor: "pointer", 
                  background: settings.motionSensitivity === l ? "#333" : "transparent", 
                  color: settings.motionSensitivity === l ? CL.accent : CL.dkDim, 
                  fontSize: 14, 
                  border: `1px solid ${settings.motionSensitivity === l ? "#444" : "#333"}` 
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </BottomSheet>
      )}
      
      {/* Momentary Switch Sub-sheet */}
      {sub === "momentary" && (
        <BottomSheet onClose={() => setSub(null)} maxH="58%">
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${CL.dkBorder}` }}>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>Close</span>
            <span style={{ color: CL.accent, fontWeight: 700, fontSize: 14 }}>Momentary Switch</span>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>OK</span>
          </div>
          <div style={{ padding: "6px 20px 20px", color: CL.dkText }}>
            {[1, 2, 3, 4, 5, 6, 7].map(r => {
              const enabled = settings.momentary[r] || false;
              return (
                <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: r < 7 ? "1px solid #2a2a2a" : "none" }}>
                  <span style={{ fontSize: 14, color: CL.dkText }}>Relay {r}</span>
                  <div 
                    onClick={() => { 
                      const m = { ...settings.momentary }; 
                      m[r] = !enabled; 
                      upd({ momentary: m }); 
                    }} 
                    style={{ 
                      width: 44, 
                      height: 24, 
                      borderRadius: 12, 
                      cursor: "pointer", 
                      position: "relative", 
                      background: enabled ? CL.accent : "#3a3a3a", 
                      transition: "background 0.25s", 
                      boxShadow: enabled ? `0 0 8px ${CL.accent}66` : "none" 
                    }}
                  >
                    <div style={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: 9, 
                      background: "#fff", 
                      position: "absolute", 
                      top: 3, 
                      left: enabled ? 23 : 3, 
                      transition: "left 0.25s", 
                      boxShadow: "0 1px 3px rgba(0,0,0,0.4)" 
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </BottomSheet>
      )}
      
      {/* Restart Status Sub-sheet */}
      {sub === "restart" && (
        <BottomSheet onClose={() => setSub(null)} maxH="58%">
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${CL.dkBorder}` }}>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>Close</span>
            <span style={{ color: CL.accent, fontWeight: 700, fontSize: 14 }}>Restart Status</span>
            <span onClick={() => setSub(null)} style={{ color: CL.dkDim, cursor: "pointer", fontSize: 13 }}>OK</span>
          </div>
          <div style={{ padding: "6px 20px 20px", color: CL.dkText }}>
            {[1, 2, 3, 4, 5, 6, 7].map(r => {
              const val = settings.restartStatus[r] || "Last Status";
              const setVal = (v) => { 
                const rs = { ...settings.restartStatus }; 
                rs[r] = v; 
                upd({ restartStatus: rs }); 
              };
              return (
                <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: r < 7 ? "1px solid #2a2a2a" : "none" }}>
                  <span style={{ fontSize: 14, color: CL.dkText }}>Relay {r}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {["Last Status", "OFF", "ON"].map(opt => (
                      <div 
                        key={opt} 
                        onClick={() => setVal(opt)} 
                        style={{ 
                          padding: "5px 8px", 
                          borderRadius: 6, 
                          cursor: "pointer", 
                          fontSize: 10, 
                          fontWeight: 600, 
                          background: val === opt ? (opt === "Last Status" ? CL.accent : `${CL.accent}20`) : "transparent", 
                          color: val === opt ? (opt === "Last Status" ? "#fff" : CL.accent) : CL.dkDim, 
                          border: `1px solid ${val === opt ? CL.accent : "transparent"}`, 
                          transition: "all 0.2s",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/* ── Switch Tab (Relay List) ── */
function RelayTile({ device, toggleRelay, updateDevice }) {
  const [pressed, setPressed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(device.label);
  const handleSaveName = () => { updateDevice(device.id, { label: tempName.trim() || device.label }); setEditing(false); };
  
  return (
    <div 
      onPointerDown={(e) => { if (!editing) setPressed(true); }} 
      onPointerUp={(e) => { if (!editing) { setPressed(false); toggleRelay(device.id); } }} 
      onPointerLeave={() => setPressed(false)} 
      style={{ background: CL.cardBg, borderRadius: 12, padding: "8px 10px", boxShadow: CL.shadowOff, borderTop: "1px solid rgba(255,255,255,1)", border: device.on ? "1px solid rgba(255,150,80,0.5)" : "1px solid transparent", display: "flex", alignItems: "center", gap: 8, cursor: editing ? "default" : "pointer", transition: "all 0.3s cubic-bezier(0.25,0.8,0.25,1)", transform: pressed ? "scale(0.97)" : "scale(1)", userSelect: "none", height: 48, minWidth: 0 }}
    >
      <div style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: device.on ? "rgba(245,197,66,0.12)" : "#F5F0E8", flexShrink: 0, filter: device.on ? CL.iconGlow : "none", transition: "filter 0.3s, background 0.3s" }}>
        {device.on ? <Lightbulb size={15} color="#F5C542" fill="#F5C542" strokeWidth={1.6} /> : <LightbulbOff size={15} color="#B5AAA0" strokeWidth={1.6} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 3 }}>
        {editing ? (
          <input autoFocus value={tempName} onChange={e => setTempName(e.target.value)} onBlur={handleSaveName} onKeyDown={e => { if (e.key === "Enter") handleSaveName(); }} onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 600, color: CL.textPri, border: "none", borderBottom: `1px solid ${CL.accent}`, background: "transparent", outline: "none", padding: "2px 0", width: "100%", minWidth: 0 }} />
        ) : (
          <>
            <span style={{ fontSize: 12, fontWeight: 600, color: CL.textPri, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{device.label}</span>
            <div onClick={(e) => { e.stopPropagation(); setTempName(device.label); setEditing(true); }} onPointerDown={e => e.stopPropagation()} style={{ cursor: "pointer", display: "flex", flexShrink: 0 }}><Pencil size={10} color={CL.textTer} /></div>
          </>
        )}
      </div>
      <div style={{ width: 30, height: 18, borderRadius: 9, flexShrink: 0, background: device.on ? CL.accent : "#D0C8C0", position: "relative", transition: "background 0.25s", boxShadow: device.on ? `0 0 6px ${CL.accent}66` : "none" }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", position: "absolute", top: 2, left: device.on ? 14 : 2, transition: "left 0.25s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
}

function SwitchSection() {
  const devices = useDeviceStore((s) => s.devices);
  const toggleRelay = useDeviceStore((s) => s.toggleRelay);
  const updateDevice = useDeviceStore((s) => s.updateDevice);
  
  // Local state for additional relays (Relay 2-7)
  const [localRelays, setLocalRelays] = useState([
    { id: 101, name: "Relay 2", isOn: false },
    { id: 102, name: "Relay 3", isOn: false },
    { id: 103, name: "Relay 4", isOn: false },
    { id: 104, name: "Relay 5", isOn: false },
    { id: 105, name: "Relay 6", isOn: false },
    { id: 106, name: "Relay 7", isOn: false },
  ]);
  
  // Get first relay from Zustand store
  const storeRelay = devices.find(d => d.type === "relay");
  
  // Combine store relay with local relays
  const allRelays = storeRelay 
    ? [{ id: storeRelay.id, name: storeRelay.label || "Relay 1", isOn: storeRelay.on }, ...localRelays]
    : localRelays;
  
  const onCount = allRelays.filter(r => r.isOn).length;
  
  const handleAllToggle = () => {
    const newState = onCount < allRelays.length;
    
    // Toggle store relay
    if (storeRelay) {
      updateDevice(storeRelay.id, { on: newState });
    }
    
    // Toggle local relays
    setLocalRelays(prev => prev.map(r => ({ ...r, isOn: newState })));
  };
  
  const handleRelayToggle = (relay) => {
    if (storeRelay && relay.id === storeRelay.id) {
      // Toggle Zustand relay
      toggleRelay(storeRelay.id);
    } else {
      // Toggle local relay
      setLocalRelays(prev => prev.map(r => 
        r.id === relay.id ? { ...r, isOn: !r.isOn } : r
      ));
    }
  };
  
  const handleRelayRename = (relay, newName) => {
    if (storeRelay && relay.id === storeRelay.id) {
      // Rename Zustand relay
      updateDevice(storeRelay.id, { label: newName });
    } else {
      // Rename local relay
      setLocalRelays(prev => prev.map(r => 
        r.id === relay.id ? { ...r, name: newName } : r
      ));
    }
  };
  
  return (
    <div>
      {/* All Relays Master Toggle */}
      <div style={{ margin: "4px 12px 10px", background: CL.cardBg, borderRadius: 14, padding: "10px 14px", boxShadow: CL.shadowOff, borderTop: "1px solid rgba(255,255,255,1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: CL.textPri }}>All Relays</div>
          <div style={{ fontSize: 10, color: CL.textSec, marginTop: 1 }}>{onCount} of {allRelays.length} active</div>
        </div>
        <div onClick={handleAllToggle} style={{ width: 44, height: 24, borderRadius: 12, background: onCount === allRelays.length ? CL.accent : "#D0C8C0", position: "relative", cursor: "pointer", transition: "background 0.25s", boxShadow: onCount === allRelays.length ? `0 0 10px ${CL.accent}66` : "none" }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2, left: onCount === allRelays.length ? 22 : 2, transition: "left 0.25s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
        </div>
      </div>
      
      {/* Relay Grid - 2 columns */}
      <div style={{ padding: "0 12px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {allRelays.map(r => (
          <LocalRelayTile 
            key={r.id} 
            relay={r} 
            onToggle={() => handleRelayToggle(r)} 
            onRename={(name) => handleRelayRename(r, name)} 
          />
        ))}
      </div>
    </div>
  );
}

/* ── LocalRelayTile - For Switch Section ── */
function LocalRelayTile({ relay, onToggle, onRename }) {
  const [pressed, setPressed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(relay.name);
  const handleSaveName = () => { onRename(tempName.trim() || relay.name); setEditing(false); };
  
  return (
    <div 
      onPointerDown={(e) => { if (!editing) setPressed(true); }} 
      onPointerUp={(e) => { if (!editing) { setPressed(false); onToggle(); } }} 
      onPointerLeave={() => setPressed(false)} 
      style={{ background: CL.cardBg, borderRadius: 12, padding: "8px 10px", boxShadow: CL.shadowOff, borderTop: "1px solid rgba(255,255,255,1)", border: relay.isOn ? "1px solid rgba(255,150,80,0.5)" : "1px solid transparent", display: "flex", alignItems: "center", gap: 8, cursor: editing ? "default" : "pointer", transition: "all 0.3s cubic-bezier(0.25,0.8,0.25,1)", transform: pressed ? "scale(0.97)" : "scale(1)", userSelect: "none", height: 48, minWidth: 0 }}
    >
      <div style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: relay.isOn ? "rgba(245,197,66,0.12)" : "#F5F0E8", flexShrink: 0, filter: relay.isOn ? CL.iconGlow : "none", transition: "filter 0.3s, background 0.3s" }}>
        {relay.isOn ? <Lightbulb size={15} color="#F5C542" fill="#F5C542" strokeWidth={1.6} /> : <LightbulbOff size={15} color="#B5AAA0" strokeWidth={1.6} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 3 }}>
        {editing ? (
          <input autoFocus value={tempName} onChange={e => setTempName(e.target.value)} onBlur={handleSaveName} onKeyDown={e => { if (e.key === "Enter") handleSaveName(); }} onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()} style={{ fontSize: 12, fontWeight: 600, color: CL.textPri, border: "none", borderBottom: `1px solid ${CL.accent}`, background: "transparent", outline: "none", padding: "2px 0", width: "100%", minWidth: 0 }} />
        ) : (
          <>
            <span style={{ fontSize: 12, fontWeight: 600, color: CL.textPri, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{relay.name}</span>
            <div onClick={(e) => { e.stopPropagation(); setTempName(relay.name); setEditing(true); }} onPointerDown={e => e.stopPropagation()} style={{ cursor: "pointer", display: "flex", flexShrink: 0 }}><Pencil size={10} color={CL.textTer} /></div>
          </>
        )}
      </div>
      <div style={{ width: 30, height: 18, borderRadius: 9, flexShrink: 0, background: relay.isOn ? CL.accent : "#D0C8C0", position: "relative", transition: "background 0.25s", boxShadow: relay.isOn ? `0 0 6px ${CL.accent}66` : "none" }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", position: "absolute", top: 2, left: relay.isOn ? 14 : 2, transition: "left 0.25s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
}

/* ══ Main App ══ */
export default function MobileApp() {
  const devices = useDeviceStore((s) => s.devices);
  const { toggleDimmer, toggleRelay, toggleScene, toggleFan, toggleAC, toggleCurtain } = useDeviceStore();
  
  const [activeTab, setActiveTab] = useState("home");
  const [sheet, setSheet] = useState(null);
  const [config, setConfig] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const quickToggle = (device) => {
    if (device.type === "dimmer") toggleDimmer(device.id);
    else if (device.type === "relay") toggleRelay(device.id);
    else if (device.type === "scene") toggleScene(device.id);
    else if (device.type === "fan") toggleFan(device.id);
    else if (device.type === "ac") toggleAC(device.id);
    else if (device.type === "curtain") toggleCurtain(device.id);
  };

  const handleTabClick = (tab) => {
    if (tab === "settings") {
      setShowSettings(true);
    } else {
      setActiveTab(tab);
      setShowSettings(false);
    }
  };

  const liveSheet = sheet !== null ? devices.find((d) => d.id === sheet) : null;
  const liveConfig = config !== null ? devices.find((d) => d.id === config) : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 12px", fontFamily: "'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <style>{`@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}*{box-sizing:border-box}::-webkit-scrollbar{width:0}`}</style>
      
      {/* Phone shell */}
      <div style={{ width: 380, maxWidth: "100%", height: 900, maxHeight: "95vh", borderRadius: 55, background: "#1a1a1a", padding: 12, boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 2px #2a2a2a, inset 0 0 0 1px rgba(255,255,255,0.05)", position: "relative" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 44, background: CL.pageBg, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" }}>
          
          {/* Notch */}
          <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 125, height: 24, background: "#000", borderRadius: 20, zIndex: 50 }} />
          
          {/* Status bar */}
          <div style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0px 24px 12px", fontSize: 15, fontWeight: 600, color: CL.textPri }}>
            <span>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
              <svg width="18" height="11" viewBox="0 0 17 11" fill="none"><path d="M1 7.5h2v2H1zM5 5.5h2v4H5zM9 3.5h2v6H9zM13 1.5h2v8h-2z" fill={CL.textPri} /></svg>
              <div style={{ width: 24, height: 11, border: `1px solid ${CL.textPri}`, borderRadius: 3, padding: 1, position: "relative" }}>
                <div style={{ width: "85%", height: "100%", background: CL.textPri, borderRadius: 1 }} />
              </div>
            </div>
          </div>
          
          {/* Header */}
          <div style={{ flexShrink: 0, padding: "12px 21px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ width: 28 }} />
              <div style={{ fontSize: 17, fontWeight: 600, color: CL.textPri, letterSpacing: -0.2 }}>ARISS Island Series</div>
              <div style={{ display: "flex", alignItems: "center", gap: 2, background: CL.cardBg, borderRadius: 14, padding: "4px 8px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)", borderTop: "1px solid rgba(255,255,255,1)" }}>
                <MoreHorizontal size={14} color={CL.textTer} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 22, padding: "4px 2px 10px" }}>
              <div onClick={() => setActiveTab("home")} style={{ fontSize: activeTab === "home" ? 22 : 16, fontWeight: 500, color: activeTab === "home" ? CL.textPri : CL.textTer, cursor: "pointer", transition: "all 0.25s ease", lineHeight: 1 }}>Home</div>
              <div onClick={() => setActiveTab("switch")} style={{ fontSize: activeTab === "switch" ? 22 : 16, fontWeight: 500, color: activeTab === "switch" ? CL.textPri : CL.textTer, cursor: "pointer", transition: "all 0.25s ease", lineHeight: 1, alignSelf: "flex-end" }}>Switch</div>
            </div>
          </div>
          
          {/* Content */}
          <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
            {activeTab === "home" && (
              <div style={{ padding: "8px 12px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10, rowGap: 16 }}>
                {devices.map(d => <Tile key={d.id} device={d} onTap={() => quickToggle(d)} onExpand={() => setSheet(d.id)} onLongPress={() => setConfig(d.id)} />)}
              </div>
            )}
            {activeTab === "switch" && <SwitchSection />}
          </div>
          
          {/* Bottom nav */}
          <div style={{ flexShrink: 0, padding: "0px 24px 16px", background: CL.pageBg, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", background: CL.cardBg, borderRadius: 24, padding: "10px 16px", boxShadow: CL.shadowOff, borderTop: "1px solid rgba(255,255,255,1)" }}>
              {[["home", "Home", <Home key="home" size={22} />], ["switch", "Switch", <Zap key="switch" size={22} />], ["settings", "Settings", <Settings key="settings" size={22} />]].map(([tab, label, icon], i) => {
                const active = tab === "settings" ? showSettings : (activeTab === tab && !showSettings);
                return (
                  <div key={tab} style={{ display: "flex", alignItems: "center", gap: i === 0 ? 0 : 8 }}>
                    {i > 0 && <div style={{ width: 1, height: 24, background: "#E5DED3" }} />}
                    <div onClick={() => handleTabClick(tab)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", padding: "4px 14px", borderRadius: 12, background: active ? `${CL.accent}15` : "transparent", transition: "all 0.25s ease" }}>
                      {icon}
                      <span style={{ fontSize: 10, fontWeight: 600, color: active ? CL.accentDark : CL.textTer }}>{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Home indicator */}
          <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, background: CL.textPri, borderRadius: 3, opacity: 0.85, zIndex: 10 }} />
          
          {/* Overlays */}
          {liveSheet && <MiniAppSheet device={liveSheet} onClose={() => setSheet(null)} />}
          {liveConfig && <ConfigPage device={liveConfig} onClose={() => setConfig(null)} />}
          {showSettings && <SettingsPage onClose={() => setShowSettings(false)} />}
        </div>
      </div>
    </div>
  );
}