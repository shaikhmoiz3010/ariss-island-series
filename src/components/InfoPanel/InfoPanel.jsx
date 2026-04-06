import StatusCard from "./StatusCard";
import BehaviourCard from "./BehaviourCard";

export default function InfoPanel() {
  return (
    <div className="w-[268px] flex flex-col gap-3.5">
      <StatusCard />
      <BehaviourCard />
    </div>
  );
}