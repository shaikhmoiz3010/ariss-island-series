import weatherIcon from "../../../assets/icons/sunnyicon.png";

export default function WeatherDisplay() {
  return (
    <div className="flex items-center justify-center h-full w-full px-2 gap-[6px] box-border">

      {/* custom weather icon */}
      <img
        src={weatherIcon}
        alt="weather"
        className="w-10 h-10 object-contain flex-shrink-0"
      />

      {/* text block */}
      <div className="flex flex-col gap-px">
        <span className="font-sans text-[11px] font-light text-white/90 leading-[1.1] tracking-[0.2px]">
          Sunny
        </span>
        <span className="font-sans text-[16px] font-light text-white/90 leading-[1.1]">
          27&#176;C
        </span>
      </div>

    </div>
  );
}