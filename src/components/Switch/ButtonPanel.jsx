import { useRef } from "react";
import ButtonRow from "./ButtonRow";
import { useDeviceStore } from "../../state/useDeviceStore";

export default function ButtonPanel({ setLeftState, setRightState, onActivity, onMotion, buttonTheme }) {
  const {
    devices,
    toggleDimmer, toggleRelay, toggleScene, toggleFan, toggleAC,
    toggleCurtain, cycleACFanSpd, toggleCCTMode,
    setBrightness, setCCT, setFanSpeed, setACTemp, setCurtainPos,
  } = useDeviceStore();

  const holdInts = useRef({});
  function d(id) { return devices.find((x) => x.id === id); }

  function activity() { onActivity(); onMotion(); }
  function startHold(id, cb, ms = 80) { holdInts.current[id] = setInterval(cb, ms); }
  function stopHold(id) { clearInterval(holdInts.current[id]); }

  // ── 0: Dimmer ──────────────────────────────────────────────
  function tapLights() { toggleDimmer(0); setLeftState("dim"); activity(); }
  function dblLights() {
    const c = d(0).cctMode;
    toggleCCTMode(0);
    setLeftState(c ? "dim" : "cct");
    activity();
  }
  function holdLightsStart(side = "l") {
    if (!d(0).on) toggleDimmer(0);
    if (d(0).cctMode) {
      let dir = side === "l" ? -100 : 100;
      startHold(0, () => {
        const cur = useDeviceStore.getState().devices.find((x) => x.id === 0);
        const next = Math.max(2700, Math.min(6500, cur.cct + dir));
        if (next >= 6500 || next <= 2700) dir *= -1;
        setCCT(0, next);
      }, 120);
      setLeftState("cct");
    } else {
      let dir = d(0).bright >= 80 ? -1 : 1;
      startHold(0, () => {
        const cur = useDeviceStore.getState().devices.find((x) => x.id === 0);
        let next = Math.max(10, Math.min(100, cur.bright + dir * 2));
        if (next >= 100 || next <= 10) dir *= -1;
        setBrightness(0, next);
      }, 80);
      setLeftState("dim");
    }
    activity();
  }
  function holdLightsEnd() { stopHold(0); setLeftState(d(0).cctMode ? "cct" : "dim"); }

  // ── 1: Relay ───────────────────────────────────────────────
  function tapPendant() { toggleRelay(1); setRightState("relay"); activity(); }

  // ── 2: Scene ───────────────────────────────────────────────
  function tapNight() {
    const on = d(2).on;
    toggleScene(2);
    setLeftState(on ? "approach" : "scene");
    activity();
  }

  // ── 3: AC ──────────────────────────────────────────────────
  function tapAC() { toggleAC(3); setRightState("ac"); activity(); }
  function dblAC() { cycleACFanSpd(3); setRightState("ac-spd"); activity(); }
  function holdACStart() {
    if (!d(3).on) toggleAC(3);
    let dir = d(3).temp <= 18 ? 1 : -1;
    startHold(3, () => {
      const cur = useDeviceStore.getState().devices.find((x) => x.id === 3);
      let next = Math.max(16, Math.min(30, cur.temp + dir));
      if (next >= 30 || next <= 16) dir *= -1;
      setACTemp(3, next);
    }, 200);
    setRightState("ac-temp");
    activity();
  }
  function holdACEnd() { stopHold(3); setRightState("ac"); }

  // ── 4: Fan ─────────────────────────────────────────────────
  function tapFan() { toggleFan(4); setLeftState("fan"); activity(); }

  function dblFan() {
  /* double tap — cycle speed up, wraps back to 1 after max */
  const cur = d(4);
  if (!cur.on) {
    toggleFan(4);
    setFanSpeed(4, 1);
  } else {
    const next = cur.speed >= 4 ? 1 : cur.speed + 1;
    setFanSpeed(4, next);
  }
  setLeftState("fan");
  activity();
}


  function holdFanStart() {
    if (!d(4).on) toggleFan(4);
    startHold(4, () => {
      const cur = useDeviceStore.getState().devices.find((x) => x.id === 4);
      setFanSpeed(4, (cur.speed % 4) + 1);
    }, 650);
    setLeftState("fan");
    activity();
  }
  function holdFanEnd() { stopHold(4); setLeftState("fan"); }

  // ── 5: Curtain ─────────────────────────────────────────────
  function tapCurtain() { toggleCurtain(5); setRightState("curt"); activity(); }
  function dblCurtain() { toggleCurtain(5); setRightState("curt"); activity(); }
  function holdCurtainStart() {
    let dir = d(5).pos >= 80 ? -1 : 1;
    startHold(5, () => {
      const cur = useDeviceStore.getState().devices.find((x) => x.id === 5);
      let next = Math.max(0, Math.min(100, cur.pos + dir * 1.5));
      if (next >= 100 || next <= 0) dir *= -1;
      setCurtainPos(5, next);
    }, 60);
    setRightState("curt");
    activity();
  }
  function holdCurtainEnd() { stopHold(5); setRightState("curt"); }

  return (
    <div className="py-[5px] flex flex-col gap-0">
      {/* Row 1 — Lights | Switch */}
      <ButtonRow
        labelL="Lights"  labelR="Switch"
        onL={d(0)?.on}   onR={d(1)?.on}
        isFirst
        buttonTheme={buttonTheme}
        onTapL={tapLights}    onDoubleTapL={dblLights}
        onHoldStartL={() => holdLightsStart("l")}
        onHoldStartLRight={() => holdLightsStart("r")}
        onHoldEndL={holdLightsEnd}
        onTapR={tapPendant}
      />

      {/* Row 2 — Scene | AC */}
      <ButtonRow
        labelL="Scene"  labelR="AC"
        onL={d(2)?.on}  onR={d(3)?.on}
        buttonTheme={buttonTheme}
        onTapL={tapNight}
        onTapR={tapAC}        onDoubleTapR={dblAC}
        onHoldStartR={holdACStart} onHoldEndR={holdACEnd}
      />

      {/* Row 3 — Fan | Curtain */}
      <ButtonRow
        labelL="Fan"    labelR="Curtain"
        onL={d(4)?.speed > 0} onR={d(5)?.moving}
        isLast
        buttonTheme={buttonTheme}
        onTapL={tapFan}        onHoldStartL={holdFanStart} onHoldEndL={holdFanEnd}
        onTapR={tapCurtain}    onDoubleTapR={dblCurtain}
        onHoldStartR={holdCurtainStart} onHoldEndR={holdCurtainEnd}
        onDoubleTapL={dblFan}
      />
    </div>
  );
}