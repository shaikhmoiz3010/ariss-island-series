import ClockDisplay    from "./states/ClockDisplay";
import ApproachDisplay from "./states/ApproachDisplay";
import DimmerDisplay   from "./states/DimmerDisplay";
import CCTDisplay      from "./states/CCTDisplay";
import SceneDisplay    from "./states/SceneDisplay";
import FanDisplay      from "./states/FanDisplay";
import RelayDisplay    from "./states/RelayDisplay";
import ACDisplay       from "./states/ACDisplay";
import ACTempDisplay   from "./states/ACTempDisplay";
import ACSpdDisplay    from "./states/ACSpdDisplay";
import CurtainDisplay  from "./states/CurtainDisplay";

// Left-side slot IDs never change — only the type within each slot changes
const LEFT_IDS = [0, 2, 4];

function isDeviceOn(device) {
  if (!device) return false;
  if (device.type === "fan")     return device.speed > 0;
  if (device.type === "curtain") return (device.pos ?? 0) > 0;
  return device.on;
}

// Find a device by type, scoped strictly to left-side slots
function leftByType(devices, type) {
  return devices.filter(d => LEFT_IDS.includes(d.id)).find(d => d.type === type) ?? null;
}

export default function LeftDisplay({ displayState, devices }) {
  const leftDevices = devices.filter(d => LEFT_IDS.includes(d.id));

  const approachItems = leftDevices.map(d => ({
    label: d?.label ?? "—",
    on:    isDeviceOn(d),
  }));

  // Resolve which left-side device the current display state refers to
  const active = (() => {
    switch (displayState) {
      case "dim":
      case "bright":
      case "dim-toggle":
      case "cct":        return leftByType(devices, "dimmer");
      case "scene":      return leftByType(devices, "scene");
      case "fan":        return leftByType(devices, "fan");
      case "relay":      return leftByType(devices, "relay");
      case "ac":
      case "ac-temp":
      case "ac-spd":     return leftByType(devices, "ac");
      case "curt":
      case "curt-move":
      case "curt-pause": return leftByType(devices, "curtain");
      default:           return null;
    }
  })();

  return (
    <div style={{ flex: 1, height: "100%", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {displayState === "idle"     && <ClockDisplay />}
      {displayState === "approach" && <ApproachDisplay items={approachItems} align="left" />}

      {(displayState === "dim" || displayState === "bright" || displayState === "dim-toggle") &&
        active?.type === "dimmer" && (
          <DimmerDisplay device={active} mode={displayState === "dim-toggle" ? "toggle" : "auto"} />
        )}
      {displayState === "cct"        && active?.type === "dimmer"  && <CCTDisplay      device={active} />}
      {displayState === "scene"      && active?.type === "scene"   && <SceneDisplay    device={active} />}
      {displayState === "fan"        && active?.type === "fan"     && <FanDisplay      device={active} />}
      {displayState === "relay"      && active?.type === "relay"   && <RelayDisplay    device={active} />}
      {displayState === "ac"         && active?.type === "ac"      && <ACDisplay       device={active} />}
      {displayState === "ac-temp"    && active?.type === "ac"      && <ACTempDisplay   device={active} />}
      {displayState === "ac-spd"     && active?.type === "ac"      && <ACSpdDisplay    device={active} />}
      {displayState === "curt"       && active?.type === "curtain" && <CurtainDisplay  device={active} variant="status" />}
      {displayState === "curt-move"  && active?.type === "curtain" && <CurtainDisplay  device={active} variant="move"   />}
      {displayState === "curt-pause" && active?.type === "curtain" && <CurtainDisplay  device={active} variant="pause"  />}

    </div>
  );
}