// FILE: src/state/useDeviceStore.js
// Zustand global store — all device state lives here
// Install: npm install zustand
// ─────────────────────────────────────────────
import { create } from "zustand";
import { INITIAL_DEVICES, AC_MODES, AC_SPEEDS, FAN_MAX } from "../constants/devices";

export const useDeviceStore = create((set, get) => ({
  devices: INITIAL_DEVICES,

  // Generic field updater — used by all actions below
  updateDevice: (id, patch) =>
    set((s) => ({
      devices: s.devices.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),

  // ── DIMMER ──
  toggleDimmer: (id) => {
    const d = get().devices.find((x) => x.id === id);
    get().updateDevice(id, { on: !d.on });
  },
  setBrightness: (id, bright) => get().updateDevice(id, { bright, on: true }),
  setCCT: (id, cct) => get().updateDevice(id, { cct }),
  toggleCCTMode: (id) => {
    const d = get().devices.find((x) => x.id === id);
    get().updateDevice(id, { cctMode: !d.cctMode, on: true });
  },

  // ── SCENE ──
  toggleScene: (id) => {
    const d = get().devices.find((x) => x.id === id);
    get().updateDevice(id, { on: !d.on });
  },

  // ── RELAY ──
  toggleRelay: (id) => {
    const d = get().devices.find((x) => x.id === id);
    get().updateDevice(id, { on: !d.on });
  },

  // ── FAN ──
  toggleFan: (id) => {
    const d = get().devices.find((x) => x.id === id);
    const speed = d.on ? 0 : d.speed || 2;
    get().updateDevice(id, { on: !d.on, speed });
  },
  setFanSpeed: (id, speed) => get().updateDevice(id, { speed, on: speed > 0 }),

  // ── AC ──
  toggleAC: (id) => {
    const d = get().devices.find((x) => x.id === id);
    get().updateDevice(id, { on: !d.on });
  },
  setACTemp: (id, temp) => get().updateDevice(id, { temp }),
  cycleACMode: (id) => {
    const d = get().devices.find((x) => x.id === id);
    const next = (AC_MODES.indexOf(d.mode) + 1) % AC_MODES.length;
    get().updateDevice(id, { mode: AC_MODES[next] });
  },
  cycleACFanSpd: (id) => {
    const d = get().devices.find((x) => x.id === id);
    const ni = (d.fanSpdIdx + 1) % AC_SPEEDS.length;
    get().updateDevice(id, { fanSpdIdx: ni, fanSpd: AC_SPEEDS[ni] });
  },

  // ── CURTAIN ──
  toggleCurtain: (id) => {
    const d = get().devices.find((x) => x.id === id);
    if (d.moving) {
      get().updateDevice(id, { moving: false });
    } else {
      const dir = d.pos >= 100 ? "close" : d.pos <= 0 ? "open" : d.dir;
      get().updateDevice(id, { moving: true, dir });
    }
  },
  stopCurtain: (id) => get().updateDevice(id, { moving: false }),
  setCurtainPos: (id, pos) => get().updateDevice(id, { pos }),
  tickCurtain: (id) => {
    const d = get().devices.find((x) => x.id === id);
    if (!d.moving) return;
    const next = Math.max(0, Math.min(100, d.pos + (d.dir === "open" ? 2 : -2)));
    const done = next >= 100 || next <= 0;
    get().updateDevice(id, { pos: next, moving: !done });
  },
}));
