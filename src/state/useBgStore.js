import { create } from "zustand";

export const useBgStore = create((set) => ({
  mode: "light",
  toggle: () => set((s) => ({ mode: s.mode === "light" ? "dark" : "light" })),
}));