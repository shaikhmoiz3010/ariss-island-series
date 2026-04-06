import StatusCard from "./StatusCard";
import BehaviourCard from "./BehaviourCard";
import { useThemeStore } from "../../state/useThemeStore";

export default function InfoPanel() {
  const bgMode = useThemeStore((s) => s.bgMode);
  return (
    <div className="w-[268px] flex flex-col gap-3.5">
      <StatusCard   bgMode={bgMode} />
      <BehaviourCard bgMode={bgMode} />
    </div>
  );
}