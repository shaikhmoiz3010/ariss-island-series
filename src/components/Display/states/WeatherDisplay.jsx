export default function WeatherDisplay() {
  return (
    <div className="h-full flex  flex-col items-end px-11 justify-center">
      <div className="text-[22px] font-sans font-light leading-none">27°C</div>
      <div className="flex flex-col font-sans font-light items-baseline gap-2">
        <span className="text-[10px] mx-1  text-white font-sans tracking-wide">
          Sunny
        </span>
      </div>
    </div>
  );
}