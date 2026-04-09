import { useState } from "react";
import SwitchPanel from "./components/Switch/SwitchPanel";
import ThemePicker from "./components/ThemePicker/ThemePicker";
import BgToggle from "./components/ThemePicker/BgToggle";
import { useThemeStore } from "./state/useThemeStore";
import RoomLayout from "./components/RoomLayout/RoomLayout";
import { HOUSING_THEMES, BUTTON_THEMES } from "./constants/themes";

export default function App() {
  const bgMode = useThemeStore((s) => s.bgMode);
  const { housingId, buttonId, setHousing, setButton } = useThemeStore();
  const isDark = bgMode === "dark";

  const [bodyOpen,   setBodyOpen]   = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);

  const closeAll = () => { setBodyOpen(false); setSwitchOpen(false); };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? "bg-gray-950" : "bg-slate-300"}`}>

      {/* ══ HEADER ══ */}
      <header className={`
        sticky top-0 h-14 z-50 backdrop-blur-2xl border-b transition-all duration-500
        ${isDark ? "bg-black border-white" : "bg-gray-400 border-gray-400"}
      `}>

        {/* bottom shimmer */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isDark ? "via-amber-400/25" : "via-amber-500/20"} to-transparent`}/>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">
          {/* ── brand ── */}
          <div className="flex items-center gap-2.6">
            {/* name */}
            <span className="font-mono text-sm sm:text-base tracking-[0.18em] text-orange-600 uppercase font-medium">
              ARISS
            </span>
            <span className={`mx-3 hidden sm:inline font-sans text-[13px] tracking-[3px] transition-colors duration-400 ${isDark ? "text-white" : "text-black"}`}>
              Island Series
            </span>
          </div>

          {/* ── right controls ── */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* bg toggle */}
            <BgToggle />

            {/* divider */}
            {/* <div className={`hidden sm:block w-px h-5 rounded-full ${isDark ? "bg-white/10" : "bg-black/10"}`}/> */}

            {/* ── DESKTOP: ThemePicker inline ── */}
            <div className="hidden sm:block">
              <ThemePicker />
            </div>

            {/* ── MOBILE: Body color button ── */}
            <div className="relative sm:hidden">
              <button
                onClick={() => { setBodyOpen(o => !o); setSwitchOpen(false); }}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border
                  cursor-pointer transition-all duration-200 active:scale-95
                  ${bodyOpen
                    ? isDark ? "bg-cyan-900 border-white" : "bg-gray-700 border-gray-800"
                    : isDark ? "bg-gray-300 border-gray-300"          : "bg-gray-800 border-black"
                  }
                `}
              >
                {/* body swatch */}
                <div
                  className="w-3 h-3 rounded-sm border border-black/20 flex-shrink-0"
                  style={{ background: HOUSING_THEMES.find(t => t.id === housingId)?.swatch ?? "#fff" }}
                />
                <span className={`font-mono text-[9px] tracking-[1.2px] uppercase font-medium ${isDark ? "text-black" : "text-white"}`}>
                  Body
                </span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"
                  className={`transition-transform duration-200 ${bodyOpen ? "rotate-180" : "rotate-0"} ${isDark ? "stroke-black" : "stroke-white"}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Body dropdown */}
              {bodyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAll}/>
                  <div className={`
                    absolute top-[calc(100%+8px)] right-0 z-50
                    w-[200px] p-3.5 rounded-2xl border shadow-2xl
                    animate-[dropIn_0.16s_ease_forwards] backdrop-blur-2xl
                    ${isDark ? "bg-gray-700 border-white shadow-black" : "bg-gray-400 border-gray-500 shadow-black"}
                  `}>
                    {/* header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/6">
                      <span className={`font-mono text-[12px] tracking-[2.5px] uppercase font-semibold ${isDark ? "text-amber-400" : "text-black"}`}>
                        Body Colour
                      </span>
                      <button onClick={closeAll} className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer ${isDark ? "hover:bg-white/8" : "hover:bg-black/6"}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" className={isDark ? "stroke-white" : "stroke-black"}>
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    {/* swatches */}
                    <div className="flex flex-wrap gap-2">
                      {HOUSING_THEMES.map(t => (
                        <button
                          key={t.id}
                          title={t.label}
                          onClick={() => { setHousing(t.id); }}
                          className="relative w-8 h-8 rounded-lg border-2 cursor-pointer transition-all duration-150 active:scale-90 hover:scale-110"
                          style={{
                            background:  t.swatch,
                            borderColor: t.id === housingId ? "#f59e0b" : "rgba(255,255,255,0.15)",
                            boxShadow:   t.id === housingId ? "0 0 0 3px rgba(245,158,11,0.25)" : "none",
                          }}
                        >
                          {t.id === housingId && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                className={t.id === "black" ? "stroke-white/80" : "stroke-black/60"}>
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* selected label */}
                    <p className={`mt-2.5 font-mono text-[8px] tracking-[1.5px] uppercase text-center ${isDark ? "text-white/30" : "text-black/30"}`}>
                      {HOUSING_THEMES.find(t => t.id === housingId)?.label ?? "—"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* ── MOBILE: Switch button color ── */}
            <div className="relative sm:hidden">
              <button
                onClick={() => { setSwitchOpen(o => !o); setBodyOpen(false); }}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border
                  cursor-pointer transition-all duration-200 active:scale-95
                  ${switchOpen
                    ? isDark ? "bg-amber-400/15 border-amber-400/35" : "bg-amber-500/12 border-amber-500/30"
                    : isDark ? "bg-white/5 border-white/10"          : "bg-black/4 border-black/8"
                  }
                `}
              >
                {/* button swatch */}
                <div
                  className="w-3 h-3 rounded-sm border border-black/20 flex-shrink-0"
                  style={{ background: BUTTON_THEMES.find(t => t.id === buttonId)?.swatch ?? "#5c8a6e" }}
                />
                <span className={`font-mono text-[9px] tracking-[1.2px] uppercase font-medium ${isDark ? "text-white/70" : "text-black/60"}`}>
                  Switch
                </span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"
                  className={`transition-transform duration-200 ${switchOpen ? "rotate-180" : "rotate-0"} ${isDark ? "stroke-white/40" : "stroke-black/35"}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* Switch dropdown */}
              {switchOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAll}/>
                  <div className={`
                    absolute top-[calc(100%+8px)] right-0 z-50
                    w-[200px] p-3.5 rounded-2xl border shadow-2xl
                    animate-[dropIn_0.16s_ease_forwards] backdrop-blur-2xl
                    ${isDark ? "bg-[#0c0e14]/96 border-white/8 shadow-black/70" : "bg-white/96 border-black/8 shadow-black/12"}
                  `}>
                    {/* header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/6">
                      <span className={`font-mono text-[8px] tracking-[2.5px] uppercase font-semibold ${isDark ? "text-amber-400/60" : "text-black/40"}`}>
                        Button Colour
                      </span>
                      <button onClick={closeAll} className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer ${isDark ? "hover:bg-white/8" : "hover:bg-black/6"}`}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" className={isDark ? "stroke-white/40" : "stroke-black/40"}>
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    {/* swatches */}
                    <div className="flex flex-wrap gap-2">
                      {BUTTON_THEMES.map(t => (
                        <button
                          key={t.id}
                          title={t.label}
                          onClick={() => { setButton(t.id); }}
                          className="relative w-8 h-8 rounded-lg border-2 cursor-pointer transition-all duration-150 active:scale-90 hover:scale-110"
                          style={{
                            background:  t.swatch,
                            borderColor: t.id === buttonId ? "#f59e0b" : "rgba(255,255,255,0.15)",
                            boxShadow:   t.id === buttonId ? "0 0 0 3px rgba(245,158,11,0.25)" : "none",
                          }}
                        >
                          {t.id === buttonId && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                className={t.id === "white" || t.id === "silver" ? "stroke-black/60" : "stroke-white/80"}>
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* selected label */}
                    <p className={`mt-2.5 font-mono text-[8px] tracking-[1.5px] uppercase text-center ${isDark ? "text-white/30" : "text-black/30"}`}>
                      {BUTTON_THEMES.find(t => t.id === buttonId)?.label ?? "—"}
                    </p>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main className="flex-1 flex flex-col items-center px-3 sm:px-4 lg:px-6 py-5 sm:py-8 gap-5 sm:gap-8">
        <div className="w-full max-w-[1200px] flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6 lg:gap-8 w-full flex-1">

            {/* switch panel */}
            <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
              <SwitchPanel />
            </div>

            {/* room layout */}
            <div className={`
              flex-1 w-full min-h-[260px] sm:min-h-0
              rounded-2xl overflow-hidden transition-all duration-400
              ${isDark ? "bg-white/3 shadow-[0_2px_24px_rgba(0,0,0,0.35)]" : "bg-white/20 shadow-[0_2px_24px_rgba(0,0,0,0.08)]"}
            `}>
              <RoomLayout />
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}