import ClockDisplay    from "./states/ClockDisplay";
import ApproachDisplay from "./states/ApproachDisplay";
import DimmerDisplay   from "./states/DimmerDisplay";
import CCTDisplay      from "./states/CCTDisplay";
import SceneDisplay    from "./states/SceneDisplay";
import FanDisplay      from "./states/FanDisplay";

import lightsOff  from "../../assets/icons/lightsOff.png";
import lightsOn   from "../../assets/icons/lightsOn.png";
import nightOff   from "../../assets/icons/sceneOff.png";
import nightOn    from "../../assets/icons/sceneOn.png";
import fanOff     from "../../assets/icons/fanOff.png";
import fanOn      from "../../assets/icons/fanOn.png";

export default function LeftDisplay({ displayState, devices }) {
  const lights = devices.find((d) => d.id === 0);
  const night  = devices.find((d) => d.id === 2);
  const fan    = devices.find((d) => d.id === 4);

  const approachItems = [
    { iconOff: lightsOff, iconOn: lightsOn, label: "Lights", on: lights?.on        },
    { iconOff: nightOff,  iconOn: nightOn,  label: "Night",  on: night?.on         },
    { iconOff: fanOff,    iconOn: fanOn,    label: "Fan",    on: fan?.speed > 0    },
  ];

  return (
    <div className="mx-5" style={{flex:1, height:"100%", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column" }}>
      {displayState === "idle"     && <ClockDisplay />}
      {displayState === "approach" && <ApproachDisplay items={approachItems} align="left" />}
      {displayState === "dim"      && <DimmerDisplay   device={lights} />}
      {displayState === "cct"      && <CCTDisplay      device={lights} />}
      {displayState === "scene"    && <SceneDisplay    device={night}  />}
      {displayState === "fan"      && <FanDisplay      device={fan}    />}
    </div>
  );
}