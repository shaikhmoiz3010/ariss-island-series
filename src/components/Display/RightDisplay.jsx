import WeatherDisplay  from "./states/WeatherDisplay";
import ApproachDisplay from "./states/ApproachDisplay";
import RelayDisplay    from "./states/RelayDisplay";
import ACDisplay       from "./states/ACDisplay";
import ACTempDisplay   from "./states/ACTempDisplay";
import ACSpdDisplay    from "./states/ACSpdDisplay";
import CurtainDisplay  from "./states/CurtainDisplay";
import DimmerDisplay   from "./states/DimmerDisplay";
import CCTDisplay      from "./states/CCTDisplay";
import SceneDisplay    from "./states/SceneDisplay";
import FanDisplay      from "./states/FanDisplay";

// Right-side slot IDs never change — only the type within each slot changes
const RIGHT_IDS = [1, 3, 5];

function isDeviceOn(device) {
  if (!device) return false;
  if (device.type === "fan")     return device.speed > 0;
  if (device.type === "curtain") return (device.pos ?? 0) > 0;
  return device.on;
}

// Find a device by type, scoped strictly to right-side slots
function rightByType(devices, type) {
  return devices.filter(d => RIGHT_IDS.includes(d.id)).find(d => d.type === type) ?? null;
}

export default function RightDisplay({ displayState, devices }) {
  const rightDevices = devices.filter(d => RIGHT_IDS.includes(d.id));

  const approachItems = rightDevices.map(d => ({
    label: d?.label ?? "—",
    on:    isDeviceOn(d),
  }));

  // Resolve which right-side device the current display state refers to
  const active = (() => {
    switch (displayState) {
      case "relay":      return rightByType(devices, "relay");
      case "ac":
      case "ac-temp":
      case "ac-spd":     return rightByType(devices, "ac");
      case "curt":
      case "curt-move":
      case "curt-pause": return rightByType(devices, "curtain");
      case "dim":
      case "bright":
      case "dim-toggle":
      case "cct":        return rightByType(devices, "dimmer");
      case "scene":      return rightByType(devices, "scene");
      case "fan":        return rightByType(devices, "fan");
      default:           return null;
    }
  })();

  return (
    <div className="text-white flex-1 position-relative overflow-hidden height-100%">

      {displayState === "idle"     && <WeatherDisplay />}
      {displayState === "approach" && <ApproachDisplay items={approachItems} align="right" />}

      {displayState === "relay"      && active?.type === "relay"   && <RelayDisplay    device={active} />}
      {displayState === "ac"         && active?.type === "ac"      && <ACDisplay       device={active} />}
      {displayState === "ac-temp"    && active?.type === "ac"      && <ACTempDisplay   device={active} />}
      {displayState === "ac-spd"     && active?.type === "ac"      && <ACSpdDisplay    device={active} />}
      {displayState === "curt"       && active?.type === "curtain" && <CurtainDisplay  device={active} variant="status" />}
      {displayState === "curt-move"  && active?.type === "curtain" && <CurtainDisplay  device={active} variant="move"   />}
      {displayState === "curt-pause" && active?.type === "curtain" && <CurtainDisplay  device={active} variant="pause"  />}

      {(displayState === "dim" || displayState === "bright" || displayState === "dim-toggle") &&
        active?.type === "dimmer" && (
          <DimmerDisplay device={active} mode={displayState === "dim-toggle" ? "toggle" : "auto"} />
        )}
      {displayState === "cct"        && active?.type === "dimmer"  && <CCTDisplay      device={active} />}
      {displayState === "scene"      && active?.type === "scene"   && <SceneDisplay    device={active} />}
      {displayState === "fan"        && active?.type === "fan"     && <FanDisplay      device={active} />}

    </div>
  );
}