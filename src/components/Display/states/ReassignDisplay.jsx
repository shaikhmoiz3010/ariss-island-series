// FILE: src/components/Display/states/ReassignDisplay.jsx
// Shows available device types during button reassignment
// ─────────────────────────────────────────────

import { useDeviceStore } from "../../../state/useDeviceStore";

export default function ReassignDisplay({ buttonPos, side }) {
  const { devices, getDeviceForButton } = useDeviceStore();
  
  const currentDeviceId = getDeviceForButton(buttonPos);
  const currentDevice = devices.find(d => d.id === currentDeviceId);
  
  // Get all unique device types
  const deviceTypes = [...new Set(devices.map(d => d.type))];
  
  // Get device type icons
  const typeIcons = {
    dimmer: "💡",
    relay: "🔌",
    scene: "🌙",
    ac: "❄️",
    fan: "🌀",
    curtain: "🪟",
  };

  return (
    <div className="flex flex-col justify-center h-full px-6 py-4">
      {/* Current assignment */}
      <div className="flex flex-col gap-1 mb-4">
        <span className="font-sans text-[9px] text-white/40 tracking-wider uppercase">
          Currently:
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[18px]">{typeIcons[currentDevice?.type] || "•"}</span>
          <span className="font-sans text-[13px] text-white font-medium">
            {currentDevice?.label || "—"}
          </span>
        </div>
      </div>

      {/* Available types indicator */}
      <div className="flex gap-1 mt-3 flex-wrap">
        {deviceTypes.map(type => (
          <div
            key={type}
            className={`
              text-[10px] px-1.5 py-0.5 rounded-full border
              ${type === currentDevice?.type 
                ? "bg-amber-400/20 border-amber-400/40 text-amber-300" 
                : "bg-white/5 border-white/10 text-white/30"
              }
            `}
          >
            {typeIcons[type]} {type}
          </div>
        ))}
      </div>
    </div>
  );
}