const ACTIVE_BARS = { LOW: 1, MED: 2, HIGH: 3 };

export default function ACSpdDisplay({ device }) {
  const fanSpd      = device.fanSpd ?? "MED";
  const activeCount = ACTIVE_BARS[fanSpd] ?? 2;

  /* relative heights — tallest on right like signal bars */
  const heights = [0.38, 0.58, 0.78, 1.00];

  return (
    <div className="flex items-center justify-center h-full pt-[6px] pb-[5px] pl-[40px] pr-[10px] gap-[3px] box-border">
      {heights.map((h, i) => {
        const lit = i < activeCount;
        return (
          <div
            key={i}
            className="w-[10px] rounded-[2px] self-end transition-all duration-[250ms] ease-in-out"
            style={{
              height:     `${h * 32}px`,
              background: lit ? "#3b82f6" : "rgba(59,130,246,0.20)",
              boxShadow:  lit ? "0 0 6px rgba(59,130,246,0.55)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}