// FILE: src/state/useDeviceStore.js
import { create } from "zustand";
import { INITIAL_DEVICES, AC_MODES, AC_SPEEDS, FAN_MAX } from "../constants/devices";

// ─── Default fields per type ──────────────────────────────────────────────────
// When a device's type changes, these fields are merged in so that every
// display component and slider always has valid, non-undefined values to read.
const TYPE_DEFAULTS = {
  dimmer:  { on: false, bright: 65, cct: 4000, cctMode: false },
  relay:   { on: false },
  scene:   { on: false },
  fan:     { on: false, speed: 0 },
  ac:      { on: false, temp: 24, mode: "COOL", fanSpd: "MED", fanSpdIdx: 1 },
  curtain: { on: false, pos: 50, moving: false, dir: "open" },
};

export const useDeviceStore = create((set, get) => ({
  devices: INITIAL_DEVICES,

  // Generic field updater.
  // If the patch includes a `type` change, automatically merge in the correct
  // default fields for the new type so no slider/display ever reads undefined.
  updateDevice: (id, patch) =>
    set((s) => ({
      devices: s.devices.map((d) => {
        if (d.id !== id) return d;
        const newType = patch.type;
        // Only inject defaults when the type is actually changing
        const typeDefaults = (newType && newType !== d.type)
          ? (TYPE_DEFAULTS[newType] ?? {})
          : {};
        // Merge order: existing device → type defaults → explicit patch
        // This means explicit patch values always win, but defaults fill gaps
        return { ...d, ...typeDefaults, ...patch };
      }),
    })),

  // ── DIMMER ──
  toggleDimmer: (id) => {
    const d = get().devices.find(x => x.id === id);
    get().updateDevice(id, { on: !d.on });
  },
  setBrightness: (id, bright) =>
    get().updateDevice(id, { bright: Math.max(0, Math.min(100, bright)), on: true }),
  setCCT: (id, cct) =>
    get().updateDevice(id, { cct: Math.max(2700, Math.min(6500, cct)) }),
  toggleCCTMode: (id) => {
    const d = get().devices.find(x => x.id === id);
    get().updateDevice(id, { cctMode: !d.cctMode, on: true });
  },

  // ── SCENE ──
  toggleScene: (id) => {
    const d = get().devices.find(x => x.id === id);
    get().updateDevice(id, { on: !d.on });
  },

  // ── RELAY ──
  toggleRelay: (id) => {
    const d = get().devices.find(x => x.id === id);
    get().updateDevice(id, { on: !d.on });
  },

  // ── FAN ──
  toggleFan: (id) => {
    const d = get().devices.find(x => x.id === id);
    const speed = d.speed > 0 ? 0 : (d.lastSpeed || 2);
    get().updateDevice(id, { on: speed > 0, speed });
  },
  setFanSpeed: (id, speed) =>
    get().updateDevice(id, { speed, on: speed > 0, lastSpeed: speed > 0 ? speed : undefined }),

  // ── AC ──
  toggleAC: (id) => {
    const d = get().devices.find(x => x.id === id);
    get().updateDevice(id, { on: !d.on });
  },
  setACTemp: (id, temp) =>
    get().updateDevice(id, { temp: Math.max(16, Math.min(30, temp)) }),
  cycleACMode: (id) => {
    const d    = get().devices.find(x => x.id === id);
    const next = (AC_MODES.indexOf(d.mode) + 1) % AC_MODES.length;
    get().updateDevice(id, { mode: AC_MODES[next] });
  },
  cycleACFanSpd: (id) => {
    const d  = get().devices.find(x => x.id === id);
    const ni = ((d.fanSpdIdx ?? 1) + 1) % AC_SPEEDS.length;
    get().updateDevice(id, { fanSpdIdx: ni, fanSpd: AC_SPEEDS[ni] });
  },

  // ── CURTAIN ──
  toggleCurtain: (id) => {
    const d = get().devices.find(x => x.id === id);
    if (d.moving) {
      get().updateDevice(id, { moving: false });
    } else {
      const dir = d.pos >= 100 ? "close" : d.pos <= 0 ? "open" : (d.dir ?? "open");
      get().updateDevice(id, { moving: true, dir });
    }
  },
  stopCurtain:   (id) => get().updateDevice(id, { moving: false }),
  setCurtainPos: (id, pos) =>
    get().updateDevice(id, { pos: Math.max(0, Math.min(100, pos)) }),
  tickCurtain: (id) => {
    const d = get().devices.find(x => x.id === id);
    if (!d?.moving) return;
    const next = Math.max(0, Math.min(100, d.pos + (d.dir === "open" ? 2 : -2)));
    const done = next >= 100 || next <= 0;
    get().updateDevice(id, { pos: next, moving: !done });
  },
}));