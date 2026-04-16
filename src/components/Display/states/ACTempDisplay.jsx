export default function ACTempDisplay({ device }) {
  const { on, temp } = device;
  const pct = ((temp - 16) / (30 - 16) * 100).toFixed(1);

  return (
    <div className="flex flex-col justify-center h-full pt-[5px] pb-[10px] pl-[40px] pr-0 gap-[6px] box-border">

      {/* ── Temp value + On/Off label in one row ── */}
      <div className="flex items-baseline gap-[10px]">
        <span
          className="-mx-1 font-light font-sans text-[14px] transition-colors duration-[250ms] ease-in-out"
          style={{ color: on ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.18)" }}
        >
          Temp. {temp}°C
        </span>

        <span
          className="font-sans font-light text-[14px] transition-colors duration-[250ms] ease-in-out"
          style={{ color: on ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.18)" }}
        >
          {on ? "On" : "Off"}
        </span>
      </div>

      {/* ── slider — only show when ON ── */}
      {on && (
        <div className="w-[85px] relative h-[13px] flex items-center">
          {/* full track */}
          <div className="absolute left-0 right-0 h-[6px] rounded-[3px] bg-white/[0.85]" />

          {/* blue dot thumb */}
          <div
            className="absolute w-[10px] h-[10px] rounded-full bg-blue-500 flex-shrink-0 transition-[left] duration-200 ease-in-out shadow-[0_0_8px_rgba(59,130,246,0.80)] -translate-x-1/2"
            style={{ left: `${pct}%` }}
          />
        </div>
      )}

    </div>
  );
}