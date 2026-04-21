export default function RelayDisplay({ device }) {
  const { on } = device;

  return (
    <div className="flex items-center justify-center h-full w-full">
      <span
        className="font-sans text-[15px] font-light tracking-wide transition-colors duration-300"
        style={{
          color: on ? "rgba(255,255,255)" : "rgba(255,255,255,0.28)",
        }}
      >
        Switch {on ? "On" : "Off"}
      </span>
    </div>
  );
}