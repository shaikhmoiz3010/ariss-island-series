import StatusPill from "../../ui/StatusPill";
import FanSteps from "../../ui/FanSteps";

export default function FanDisplay({ device }) {
  const { speed } = device;
  const on = speed > 0;
  return (
    <div className="flex flex-col justify-center h-full p-5 px-6">

      <div className="mx-auto flex items-start justify-center flex-1">
        {on
          ? <span className="font-sans text-[20px] font-bold text-white/90 tracking-tight drop-shadow-[0_0_24px_rgba(232,200,122,0.45)]">{speed}</span>
          : <span className="text-[18px] mt-1 text-white opacity-20">OFF</span>
        }
      </div>
      <div className="flex flex-col gap-1">
        <FanSteps speed={speed} />
        <span className="text-[14px] font-mono text-white/25 text-center tracking-wide uppercase"></span>
      </div>
    </div>
  );
}