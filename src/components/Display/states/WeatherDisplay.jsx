export default function WeatherDisplay() {
  return (
    <div className="h-full flex flex-col items-end justify-center px-3.5 gap-1">
      <div className="text-[20px] leading-none">🌤</div>
      <div className="flex items-baseline gap-1">
        <span className="text-[17px] font-semibold text-white/92 tracking-tighter font-ui">
          27°C
        </span>
        <span className="font-mono text-[7.5px] text-white/28 tracking-[1.5px]">
          SUNNY
        </span>
      </div>
    </div>
  );
}