export default function ApproachDisplay({ items, align = "left" }) {
  return (
    <div className={`flex flex-col justify-around h-full py-1.5 ${align === "right" ? "items-end px-2.5" : "px-2.5"}`}>
      {items.map(({ icon, label, on }, i) => (
        <div key={i} className={`flex items-center gap-1.5 ${align === "right" ? "flex-row-reverse" : ""}`}>
          <span
            className="text-[13px] leading-none transition-all duration-300"
            style={{ filter: on ? "grayscale(0) brightness(1)" : "grayscale(1) brightness(0.45)" }}
          >
            {icon}
          </span>
          <span className={`text-[9.5px] transition-all duration-300 ${on ? "text-white/88 font-medium" : "text-white/30"}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}