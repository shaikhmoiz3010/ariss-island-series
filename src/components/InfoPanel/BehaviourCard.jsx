function Kbd({ children }) {
  return <span className="inline-block bg-white/7 rounded px-1 font-mono text-[9px] text-white/40">{children}</span>;
}

export default function BehaviourCard() {
  return (
    <div className="bg-black/50 backdrop-blur-xl border border-white/6 rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <h3 className="font-mono text-[8.5px] tracking-[3px] text-amber-400/28 uppercase mb-3">Display Behaviour</h3>
      <p className="text-[11px] text-white/28 leading-relaxed">
        <strong className="text-white">Idle</strong> — L: Clock &nbsp; R: Weather<br />
        <strong className="text-white">Approach</strong> — Labels appear on hover<br />
        <strong className="text-white">Left press</strong> — L goes to focus mode<br />
        <strong className="text-white">Right press</strong> — R goes to focus mode<br />
        <strong className="text-white">2.5s timeout</strong> — returns to approach<br /><br />
        <Kbd>tap</Kbd> ON/OFF &nbsp;
        <Kbd>2×</Kbd> mode switch &nbsp;
        <Kbd>hold</Kbd> adjust
      </p>
    </div>
  );
}