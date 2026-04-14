import WeatherDisplay from "./states/WeatherDisplay";
import ApproachDisplay from "./states/ApproachDisplay";
import RelayDisplay   from "./states/RelayDisplay";
import ACDisplay      from "./states/ACDisplay";
import ACTempDisplay  from "./states/ACTempDisplay";
import ACSpdDisplay   from "./states/ACSpdDisplay";
import CurtainDisplay from "./states/CurtainDisplay";

import pendantOff  from "../../assets/icons/switchOff.png";
import pendantOn   from "../../assets/icons/switchOn.png";
import acOff       from "../../assets/icons/acOff.png";
import acOn        from "../../assets/icons/acOn.png";
import curtainOff  from "../../assets/icons/curtainOff.png";
import curtainOn   from "../../assets/icons/curtainOn.png";

export default function RightDisplay({ displayState, devices }) {
  const pendant = devices.find((d) => d.id === 1);
  const ac      = devices.find((d) => d.id === 3);
  const curtain = devices.find((d) => d.id === 5);


const approachItems = [
  { label: "Switch", on: pendant?.on                  },
  { label: "AC",      on: ac?.on                       },
  { label: "Curtain", on: (curtain?.pos ?? 0) > 0      },
];

  return (
    <div className=" text-white flex-1 position-relative overflow-hidden height-100% ">
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