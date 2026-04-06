import { create } from "zustand";
import { HOUSING_THEMES, BUTTON_THEMES, DEFAULT_HOUSING, DEFAULT_BUTTON } from "../constants/themes";

export const useThemeStore = create((set) => ({
  housingId:  DEFAULT_HOUSING,
  buttonId:   DEFAULT_BUTTON,
  setHousing: (id) => set({ housingId: id }),
  setButton:  (id) => set({ buttonId:  id }),
}));

export const useHousingTheme = () => {
  const id = useThemeStore((s) => s.housingId);
  return HOUSING_THEMES.find((t) => t.id === id);
};

export const useButtonTheme = () => {
  const id = useThemeStore((s) => s.buttonId);
  return BUTTON_THEMES.find((t) => t.id === id);
};
