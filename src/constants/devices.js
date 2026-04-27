// FILE: src/constants/devices.js
// Initial configuration for every device/button
// ─────────────────────────────────────────────
export const INITIAL_DEVICES = [
  { id: 0, type: "dimmer",  label: "Lights",  side: "L", on: false, bright: 65, cct: 4000, cctMode: false },
  { id: 1, type: "relay",   label: "Switch", side: "R", on: false },
  { id: 2, type: "scene",   label: "Relax",   side: "L", on: false, icon: "🌙" },
  { id: 3, type: "ac",      label: "AC",      side: "R", on: false, temp: 22, mode: "COOL", fanSpd: "MED", fanSpdIdx: 1 },
  { id: 4, type: "fan",     label: "Fan",     side: "L", on: false, speed: 0 },
  { id: 5, type: "curtain", label: "Curtain", side: "R", on: false, pos: 50, moving: false, dir: "open" },
];

export const AC_MODES = ["COOL", "HOT", "AUTO", "DRY"];
export const AC_SPEEDS = ["LOW", "MED", "HIGH"];
export const FAN_MAX = 4;