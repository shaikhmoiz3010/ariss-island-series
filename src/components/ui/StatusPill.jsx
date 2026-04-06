const PILL_STYLES = {
  on: "bg-amber-400/15 text-amber-300 border border-amber-400/30",
  off: "bg-white/5 text-white/30 border border-white/8",
  scene: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
  cct: "bg-blue-200/8 text-blue-200 border border-blue-200/25",
  ac: "bg-amber-400/15 text-amber-300 border border-amber-400/30",
  curtain: "bg-amber-400/15 text-amber-300 border border-amber-400/30",
};

export default function StatusPill({ variant = "off", children }) {
  return (
    <span className={`text-[6px] font-mono tracking-wide px-1.5 py-0.5 rounded-full ${PILL_STYLES[variant]}`}>
      {children}
    </span>
  );
}