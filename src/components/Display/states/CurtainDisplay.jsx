export default function CurtainDisplay({ device, variant = "status" }) {
  const { pos, moving, dir } = device;

  const isOpen   = pos >= 100;
  const isClosed = pos <= 0;
  const pct      = Math.round(pos);

  /* ── status view — single press ── */
  if (variant === "status") {
    return (
      <div className="justify-center items-start h-full">
        <div className="inline-flex items-center justify-center rounded-full px-[84px] py-[13px] min-w-[56px] transition-all duration-[280ms] ease-in-out">
          <span className="font-sans text-[15px] font-light tracking-[1.5px] text-white/50">
            {isOpen ? "OPEN" : "OFF"}
          </span>
        </div>
      </div>
    );
  }

  /* ── move / pause view ── */
  return (
    <div className="flex flex-col justify-center h-full px-3 py-1 box-border">

      {/* label row */}
      <div className="mx-6 flex items-baseline gap-[15px]">
        <span className="font-sans font-light text-[14px] text-white whitespace-nowrap">
          {pct}%
        </span>
        <span className="font-sans font-light text-[14px] text-white">
          {moving
            ? (dir === "open" ? "Opening" : "Closing")
            : isOpen   ? "Open"
            : isClosed ? "Closed"
            : "Paused"
          }
        </span>
      </div>

      {/* track wrapper — fill is clipped inside this */}
      <div
        className="mx-6 mt-1 relative h-[8px] w-[95px] rounded-2xl overflow-hidden transition-[background] duration-300 ease-in-out"
        style={{
          background: isOpen
            ? "rgba(255,255,255,0.88)"
            : isClosed
              ? "rgba(180,180,180,0.50)"
              : "rgba(180,180,180,0.50)",
        }}
      >
        {/* filled portion — absolutely positioned inside the track */}
        {!isOpen && !isClosed && (
          <div
            className="absolute inset-y-0 left-0 bg-white rounded-2xl transition-[width] duration-150 ease-in-out"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>

    </div>
  );
}