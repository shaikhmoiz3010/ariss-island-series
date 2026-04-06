import StatusPill from "../../ui/StatusPill";

export default function RelayDisplay({ device }) {
  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">{device.label}</span>
        <StatusPill variant={device.on ? "on" : "off"}>{device.on ? "ON" : "OFF"}</StatusPill>
      </div>
      <div className="flex items-center justify-center flex-1">
        <span className="text-[24px] drop-shadow-[0_0_8px_rgba(224,96,64,0.5)]">⏻</span>
      </div>
      <div />
    </div>
  );
}