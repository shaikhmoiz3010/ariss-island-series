import WeatherDisplay from "./states/WeatherDisplay";
import ApproachDisplay from "./states/ApproachDisplay";
import RelayDisplay   from "./states/RelayDisplay";
import ACDisplay      from "./states/ACDisplay";
import ACTempDisplay  from "./states/ACTempDisplay";
import ACSpdDisplay   from "./states/ACSpdDisplay";
import CurtainDisplay from "./states/CurtainDisplay";

export default function RightDisplay({ displayState, devices }) {
  const pendant = devices.find((d) => d.id === 1);
  const ac      = devices.find((d) => d.id === 3);
  const curtain = devices.find((d) => d.id === 5);

  const approachItems = [
    { icon: "⏻",  label: "Pendant", on: pendant?.on     },
    { icon: "❄️", label: "AC",      on: ac?.on           },
    { icon: "🪟", label: "Curtain", on: curtain?.moving  },
  ];

  return (
    <div className="text-white flex-1 position-relative overflow-hidden height-100% ">
      {displayState === "idle"     && <WeatherDisplay />}
      {displayState === "approach" && <ApproachDisplay items={approachItems} align="right" />}
      {displayState === "relay"    && <RelayDisplay    device={pendant} />}
      {displayState === "ac"       && <ACDisplay       device={ac}      />}
      {displayState === "ac-temp"  && <ACTempDisplay   device={ac}      />}
      {displayState === "ac-spd"   && <ACSpdDisplay    device={ac}      />}
      {displayState === "curt"     && <CurtainDisplay  device={curtain} />}
    </div>
  );
}