export default function ProgressBar({ percent }) {
  return (
    <div className="h-[3px] bg-white/7 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-400/50 to-amber-300 shadow-[0_0_5px_rgba(232,200,122,0.4)] transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}