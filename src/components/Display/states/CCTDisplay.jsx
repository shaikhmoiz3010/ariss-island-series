export default function CCTDisplay({ device }) {
  const { cct } = device;
  const pct = ((cct - 2700) / 3800 * 82 + 9).toFixed(1);

  return (
    <div className="flex flex-col justify-between h-full p-2.5 px-6">


      <div className="flex items-center justify-start flex-1">
        <span
          className="text-white font-sans text-[14px] tracking-tight leading-none transition-all duration-150"
        >
          CCT
        </span>

        <span
          className="mx-5 text-white font-sans text-[15px] tracking-tight leading-none transition-all duration-150"
        >
          {cct}
          <span className="font-sans text-[14px] ml-1 text-white">K</span>
        </span>

      </div>

      <div className="flex flex-col gap-1">
        <div className="w-[80px] h-[7px] rounded-[3px] bg-gradient-to-r from-[#ffb347] via-[#fff8e0] to-[#b8d0ff] relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.7)] transition-all duration-300"
            style={{ left: `${pct}%` }}
          />
        </div>

      </div>
    </div>
  );
}