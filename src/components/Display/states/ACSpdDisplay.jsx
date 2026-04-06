import StatusPill from "../../ui/StatusPill";
import ACSpeedChips from "../../ui/ACSpeedChips";

export default function ACSpdDisplay({ device }) {
  return (
    <div className="flex flex-col justify-between h-full p-1.5 px-3">
      <div className="flex justify-between items-start">
        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">AC · Fan</span>
        <StatusPill variant="ac">{device.fanSpd}</StatusPill>
      </div>
      <div className="flex items-center justify-center flex-1">
        <ACSpeedChips fanSpd={device.fanSpd} />
      </div>
      <span className="text-[5.5px] font-mono text-white/25 text-center tracking-wide uppercase">2× CYCLES: LOW → MED → HIGH</span>
    </div>
  );
}