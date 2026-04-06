import { useDeviceStore } from "../../state/useDeviceStore";
import { IC_ON_COLOUR } from "../../constants/colours";

function formatValue(d) {
  if (d.type === "dimmer") return d.on ? `ON · ${d.bright}%` : `OFF · ${d.bright}%`;
  if (d.type === "relay") return d.on ? "ON" : "OFF";
  if (d.type === "scene") return "SCENE";
  if (d.type === "ac") return d.on ? `ON · ${d.temp}°C · ${d.mode}` : `OFF · ${d.temp}°C`;
  if (d.type === "fan") return d.speed > 0 ? `ON · SPD ${d.speed}` : "OFF";
  if (d.type === "curtain") return `${Math.round(d.pos)}% · ${d.moving ? (d.dir === "open" ? "OPENING" : "CLOSING") : "STOPPED"}`;
  return "—";
}

function isActiveDevice(d) {
  if (d.type === "fan") return d.speed > 0;
  if (d.type === "curtain") return d.moving;
  return d.on;
}

export default function StatusCard() {
  const devices = useDeviceStore((s) => s.devices);
  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/6 rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <h3 className="font-mono text-[8.5px] tracking-[3px] text-amber-400/28 uppercase mb-3">Device Status</h3>
      {devices.map((d) => {
        const active = isActiveDevice(d);
        return (
          <div key={d.id} className="flex items-center justify-between py-1.5 border-b border-white/4 last:border-0">
            <span className={`flex items-center gap-2 text-[12.5px] transition-colors duration-300 ${active ? "text-white/85 font-medium" : "text-white/32"}`}>
              <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: IC_ON_COLOUR[d.type] }} />
              {d.label}
            </span>
            <span className={`font-mono text-[10px] transition-colors duration-300 ${active ? "text-amber-300 font-medium" : "text-white/20"}`}>
              {formatValue(d)}
            </span>
          </div>
        );
      })}
    </div>
  );
}