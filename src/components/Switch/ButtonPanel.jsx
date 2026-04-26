import { useRef } from "react";
import ButtonRow from "./ButtonRow";
import { useDeviceStore } from "../../state/useDeviceStore";

// ─── Slot layout: [leftDeviceId, rightDeviceId] per row ──────────────────────
// Slot positions never change. Only device.type within each slot changes.
const ROWS = [
  [0, 1],
  [2, 3],
  [4, 5],
];

// ─── isOn per device type ─────────────────────────────────────────────────────
function isOn(device) {
  if (!device) return false;
  if (device.type === "fan")     return device.speed > 0;
  if (device.type === "curtain") return device.moving;
  return device.on;
}

// ─── Build tap/dbl/hold handlers for a device based on its current type ───────
// setDisplay: the correct left or right state setter for this slot
// startHold / stopHold: shared interval helpers keyed by device.id
function buildHandlers({ device, setDisplay, startHold, stopHold, store }) {
  const {
    toggleDimmer, toggleRelay, toggleScene, toggleFan, toggleAC, toggleCurtain,
    cycleACFanSpd, toggleCCTMode,
    setBrightness, setCCT, setFanSpeed, setACTemp, setCurtainPos,
  } = store;

  const id   = device.id;
  const noop = () => {};

  // Helper: get fresh device state without stale closure
  const fresh = () => useDeviceStore.getState().devices.find(x => x.id === id);

  switch (device.type) {

    case "dimmer": {
      const tap = () => { toggleDimmer(id); setDisplay("dim"); };

      const dbl = () => {
        const cur = fresh();
        toggleCCTMode(id);
        setDisplay(cur.cctMode ? "dim" : "cct");
      };

      // holdStart receives an optional side ("l"|"r") for left-button CCT direction
      const holdStart = (side = "l") => {
        const cur = fresh();
        if (!cur.on) toggleDimmer(id);
        if (fresh().cctMode) {
          let dir = side === "l" ? -100 : 100;
          startHold(id, () => {
            const c = fresh();
            const next = Math.max(2700, Math.min(6500, c.cct + dir));
            if (next >= 6500 || next <= 2700) dir *= -1;
            setCCT(id, next);
          }, 120);
          setDisplay("cct");
        } else {
          const c = fresh();
          let dir = c.bright >= 80 ? -1 : 1;
          startHold(id, () => {
            const c2 = fresh();
            let next = Math.max(10, Math.min(100, c2.bright + dir * 2));
            if (next >= 100 || next <= 10) dir *= -1;
            setBrightness(id, next);
          }, 80);
          setDisplay("dim");
        }
      };

      const holdEnd = () => {
        stopHold(id);
        setDisplay(fresh().cctMode ? "cct" : "dim");
      };

      return {
        tap,
        dbl,
        holdStart,                          // called with side from ButtonRow
        holdStartRight: () => holdStart("r"),
        holdEnd,
      };
    }

    case "relay":
      return {
        tap:  () => { toggleRelay(id); setDisplay("relay"); },
        dbl:  noop,
        holdStart: noop, holdStartRight: undefined, holdEnd: noop,
      };

    case "scene":
      return {
        tap: () => {
          const on = fresh().on;
          toggleScene(id);
          setDisplay(on ? "approach" : "scene");
        },
        dbl:  noop,
        holdStart: noop, holdStartRight: undefined, holdEnd: noop,
      };

    case "ac":
      return {
        tap: () => { toggleAC(id); setDisplay("ac"); },
        dbl: () => { cycleACFanSpd(id); setDisplay("ac-spd"); },
        holdStart: () => {
          const cur = fresh();
          if (!cur.on) toggleAC(id);
          let dir = fresh().temp <= 18 ? 1 : -1;
          startHold(id, () => {
            const c = fresh();
            let next = Math.max(16, Math.min(30, c.temp + dir));
            if (next >= 30 || next <= 16) dir *= -1;
            setACTemp(id, next);
          }, 200);
          setDisplay("ac-temp");
        },
        holdStartRight: undefined,
        holdEnd: () => { stopHold(id); setDisplay("ac"); },
      };

    case "fan":
      return {
        tap: () => { toggleFan(id); setDisplay("fan"); },
        dbl: () => {
          const cur = fresh();
          if (!cur.on) { toggleFan(id); setFanSpeed(id, 1); }
          else { setFanSpeed(id, cur.speed >= 4 ? 1 : cur.speed + 1); }
          setDisplay("fan");
        },
        holdStart: () => {
          if (!fresh().on) toggleFan(id);
          startHold(id, () => {
            const c = fresh();
            setFanSpeed(id, (c.speed % 4) + 1);
          }, 650);
          setDisplay("fan");
        },
        holdStartRight: undefined,
        holdEnd: () => { stopHold(id); setDisplay("fan"); },
      };

    case "curtain":
      return {
        tap: () => {
          toggleCurtain(id);
          setDisplay(fresh().moving ? "curt" : "curt-move");
        },
        dbl: () => { toggleCurtain(id); setDisplay("curt-pause"); },
        holdStart: () => {
          let dir = fresh().pos >= 80 ? -1 : 1;
          startHold(id, () => {
            const c = fresh();
            let next = Math.max(0, Math.min(100, c.pos + dir * 1.5));
            if (next >= 100 || next <= 0) dir *= -1;
            setCurtainPos(id, next);
          }, 60);
          setDisplay("curt-move");
        },
        holdStartRight: undefined,
        holdEnd: () => { stopHold(id); setDisplay("curt-move"); },
      };

    default:
      // Fallback: treat as relay
      return {
        tap:  () => { toggleRelay(id); setDisplay("relay"); },
        dbl:  noop,
        holdStart: noop, holdStartRight: undefined, holdEnd: noop,
      };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
export default function ButtonPanel({
  setLeftState,
  setRightState,
  onActivity,
  onMotion,
  buttonTheme,
}) {
  const store    = useDeviceStore();
  const { devices } = store;
  const holdInts = useRef({});

  function startHold(id, cb, ms = 80) {
    clearInterval(holdInts.current[id]);
    holdInts.current[id] = setInterval(cb, ms);
  }
  function stopHold(id) {
    clearInterval(holdInts.current[id]);
  }

  function activity() { onActivity(); onMotion(); }

  // Wrap a setter so every display change also fires activity()
  const wrapSetter = (setter) => (s) => { setter(s); activity(); };

  const leftSetter  = wrapSetter(setLeftState);
  const rightSetter = wrapSetter(setRightState);

  function d(id) { return devices.find(x => x.id === id); }

  return (
    <div className="py-[5px] flex flex-col gap-0">
      {ROWS.map(([lId, rId], rowIdx) => {
        const dL = d(lId);
        const dR = d(rId);

        // Build handlers fresh on every render so type changes are picked up immediately
        const hL = dL ? buildHandlers({
          device: dL,
          setDisplay: leftSetter,
          startHold, stopHold,
          store,
        }) : {};

        const hR = dR ? buildHandlers({
          device: dR,
          setDisplay: rightSetter,
          startHold, stopHold,
          store,
        }) : {};

        return (
          <ButtonRow
            key={`row-${rowIdx}`}
            labelL={dL?.label ?? "—"}
            labelR={dR?.label ?? "—"}
            onL={isOn(dL)}
            onR={isOn(dR)}
            isFirst={rowIdx === 0}
            isLast={rowIdx === ROWS.length - 1}
            buttonTheme={buttonTheme}
            // Left half
            onTapL={hL.tap}
            onDoubleTapL={hL.dbl}
            onHoldStartL={hL.holdStart}
            onHoldStartLRight={hL.holdStartRight}
            onHoldEndL={hL.holdEnd}
            // Right half
            onTapR={hR.tap}
            onDoubleTapR={hR.dbl}
            onHoldStartR={hR.holdStart}
            onHoldEndR={hR.holdEnd}
          />
        );
      })}
    </div>
  );
}