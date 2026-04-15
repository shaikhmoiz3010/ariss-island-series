import ProgressBar from "../../ui/ProgressBar";

export default function DimmerDisplay({ device, mode = "bright" }) {
  const { on, bright } = device;

  /* auto-detect if no mode passed — below 50 = dim, above = bright */
  const label = mode === "toggle"
    ? null
    : mode === "dim" || (mode === "auto" && bright < 50)
      ? "Dim"
      : "Bright";

  return (
    <div className="gap-1 flex flex-col justify-start h-full mx-[30px] mt-2">
      <div className="flex items-center overflow-hidden whitespace-nowrap">
        {on
          ? <span className="font-sans text-[14px] text-white/90 whitespace-nowrap">
              {label}&nbsp;&nbsp;&nbsp;&nbsp;{bright}
              <span className="text-[14px] text-white ml-0.5">%</span>
            </span>
          : <span className="mx-2 my-2 font-sans text-[13px] text-white/35">
              OFF
            </span>
        }
      </div>
      <div className="justify-start w-[88px] flex flex-col gap-1">
        <ProgressBar percent={on ? bright : 0} />
      </div>
    </div>
  );
}