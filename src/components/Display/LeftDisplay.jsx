import ClockDisplay    from "./states/ClockDisplay";
import ApproachDisplay from "./states/ApproachDisplay";
import DimmerDisplay   from "./states/DimmerDisplay";
import CCTDisplay      from "./states/CCTDisplay";
import SceneDisplay    from "./states/SceneDisplay";
import FanDisplay      from "./states/FanDisplay";

export default function LeftDisplay({ displayState, devices }) {
  const lights = devices.find((d) => d.id === 0);
  const night  = devices.find((d) => d.id === 2);
  const fan    = devices.find((d) => d.id === 4);

  const approachItems = [
    { icon: "💡", label: "Lights", on: lights?.on },
    { icon: "🌙", label: "Night",  on: night?.on  },
    { icon: "🌀", label: "Fan",    on: fan?.speed > 0 },
  ];

  return (
    // Change: flex value to give this panel more/less width share
    <div style={{ flex: 1, position: "relative", overflow: "hidden", height: "100%" }}>
      {displayState === "idle"     && <ClockDisplay />}
      {displayState === "approach" && <ApproachDisplay items={approachItems} align="left" />}
      {displayState === "dim"      && <DimmerDisplay   device={lights} />}
      {displayState === "cct"      && <CCTDisplay      device={lights} />}
      {displayState === "scene"    && <SceneDisplay    device={night}  />}
      {displayState === "fan"      && <FanDisplay      device={fan}    />}
    </div>
  );
}
