export default function ProgressBar({ percent }) {
  return (
    <div className="h-[7px] bg-white/7 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-white/20 to-white transition-all duration-300"
        style={{ width: `${percent}%` }}
      />

    </div>
  );
}