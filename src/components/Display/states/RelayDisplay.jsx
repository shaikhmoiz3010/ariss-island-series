export default function RelayDisplay({ device }) {
  const { on } = device;

  return (
    <div className="flex flex-col justify-center items-start h-full pl-[75px] pr-0 py-[1px] gap-[2px] box-border">

      {/* device name */}
      <span className="font-light font-sans text-[12px] text-white/[0.88] tracking-widest">
        Switch
      </span>

      {/* sliding toggle pill */}
      <div
        className="relative w-[46px] h-[20px] rounded-full flex-shrink-0 transition-[background] duration-[280ms] ease-in-out"
        style={{
          background: on ? "#22c55e" : "#ef4444",
          boxShadow:  on
            ? "0 0 8px rgba(34,197,94,0.45)"
            : "0 0 8px rgba(239,68,68,0.40)",
        }}
      >
        {/* ON / OFF label */}
        <span
          className="absolute top-1/2 -translate-y-1/2 font-mono text-[6.5px] tracking-[0.8px] text-white/[0.92] pointer-events-none select-none transition-all duration-[280ms] ease-in-out"
          style={{
            left:  on ? "6px"  : "auto",
            right: on ? "auto" : "6px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {on ? "ON" : "OFF"}
        </span>

        {/* sliding knob */}
        <div
          className="absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white/[0.96] shadow-[0_1px_4px_rgba(0,0,0,0.35)] transition-[left] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ left: on ? "calc(100% - 18px)" : "2px" }}
        />
      </div>
    </div>
  );
}