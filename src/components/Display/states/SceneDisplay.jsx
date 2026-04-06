import StatusPill from "../../ui/StatusPill";

export default function SceneDisplay({ device }) {
  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">{device.label}</span>
        <StatusPill variant="scene">RUNNING</StatusPill>
      </div>
      <div className="flex items-center justify-center flex-1 text-[26px]">{device.icon || "✨"}</div>
      <div />
    </div>
  );
}