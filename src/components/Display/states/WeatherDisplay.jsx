export default function WeatherDisplay() {
  return (
    <div className="h-full flex  flex-col items-end px-12 justify-center">
      <div className="text-[23px] font-light leading-none">27°C</div>
      <div className="flex flex-col  items-baseline gap-2">
        <span className="text-[11px] mx-3  text-white font-sans tracking-wide">
          Sunny
        </span>
      </div>
    </div>
  );
}