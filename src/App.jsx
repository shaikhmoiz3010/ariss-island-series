import { useState } from "react";
import SwitchPanel from "./components/Switch/SwitchPanel";
import ThemePicker from "./components/ThemePicker/ThemePicker";
import BgToggle from "./components/ThemePicker/BgToggle";
import { useThemeStore } from "./state/useThemeStore";
import RoomLayout from "./components/RoomLayout/RoomLayout";

const BG = {
  light: {
    bg:           "bg-[#a8a9ab]",
    headerBg:     "bg-white/20",
    headerBorder: "border-black/8",
  },
  dark: {
    bg:           "bg-[#1a1b1e]",
    headerBg:     "bg-black/60",
    headerBorder: "border-white/6",
  },
};

export default function App() {
  const bgMode     = useThemeStore((s) => s.bgMode);
  const isDark     = bgMode === "dark";
  const theme      = BG[bgMode];
  const [open, setOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-400 ${theme.bg}`}>

      {/* ══ HEADER ══ */}
      <header className={`
        sticky top-0 h-14 z-50
        backdrop-blur-xl border-b
        transition-all duration-400
        ${theme.headerBg} ${theme.headerBorder}
      `}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">

          {/* brand */}
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base sm:text-lg tracking-widest text-amber-600 uppercase font-semibold">
              ARISS
            </span>
            <span className={`
              hidden sm:inline text-xs sm:text-sm tracking-wide
              transition-colors duration-400
              ${isDark ? "text-white/55" : "text-black/45"}
            `}>
              Island Series
            </span>
          </div>

          {/* right controls */}
          <div className="flex items-center gap-2 sm:gap-4 relative">

            <BgToggle />

            {/* divider — desktop only */}
            <div className={`
              hidden sm:block w-px h-6 flex-shrink-0
              ${isDark ? "bg-white/10" : "bg-black/12"}
            `} />

            {/* ThemePicker — desktop inline */}
            <div className="hidden sm:block">
              <ThemePicker />
            </div>

            {/* Theme button — mobile only */}
            <button
              onClick={() => setOpen(o => !o)}
              className={`
                sm:hidden flex items-center gap-1.5 px-2.5 py-1.5
                rounded-lg border cursor-pointer
                transition-all duration-200
                ${open
                  ? isDark ? "bg-amber-400/15 border-amber-400/30" : "bg-black/10 border-black/15"
                  : isDark ? "bg-white/6 border-white/10"          : "bg-black/5 border-black/10"
                }
              `}
            >
              {/* palette icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={isDark ? "stroke-amber-400/80" : "stroke-black/55"}
              >
                <circle cx="12" cy="12" r="10"/>
                <circle cx="8"  cy="10" r="1.5" className={isDark?"fill-amber-400/80":"fill-black/55"}/>
                <circle cx="14" cy="8"  r="1.5" className={isDark?"fill-amber-400/80":"fill-black/55"}/>
                <circle cx="16" cy="14" r="1.5" className={isDark?"fill-amber-400/80":"fill-black/55"}/>
                <circle cx="9"  cy="16" r="1.5" className={isDark?"fill-amber-400/80":"fill-black/55"}/>
              </svg>

              <span className={`
                font-mono text-[9px] tracking-[1.5px] uppercase
                ${isDark ? "text-amber-400/80" : "text-black/55"}
              `}>
                Theme
              </span>

              {/* chevron */}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`
                  transition-transform duration-200
                  ${open ? "rotate-180" : "rotate-0"}
                  ${isDark ? "stroke-amber-400/60" : "stroke-black/40"}
                `}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* dropdown panel — mobile only */}
            {open && (
              <>
                {/* backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />

                <div className={`
                  absolute top-[calc(100%+8px)] right-0 z-50
                  min-w-[230px] p-4 rounded-2xl border
                  shadow-2xl
                  animate-[dropIn_0.18s_ease_forwards]
                  ${isDark
                    ? "bg-[#0a0c12]/95 border-white/10 shadow-black/60"
                    : "bg-white/95 border-black/10 shadow-black/14"
                  }
                  backdrop-blur-xl
                `}>

                  {/* dropdown title */}
                  <p className={`
                    font-mono text-[8px] tracking-[3px] uppercase mb-3 pb-2.5
                    border-b
                    ${isDark
                      ? "text-amber-400/40 border-white/6"
                      : "text-black/30 border-black/6"
                    }
                  `}>
                    Appearance
                  </p>

                  {/* ThemePicker inside dropdown */}
                  <div className="scale-90 origin-top-left">
                    <ThemePicker />
                  </div>

                  {/* done button */}
                  <button
                    onClick={() => setOpen(false)}
                    className={`
                      mt-3.5 w-full py-2 rounded-lg border
                      font-mono text-[9px] tracking-[1.5px] uppercase
                      cursor-pointer transition-colors duration-200
                      ${isDark
                        ? "border-white/8 bg-white/4 text-white/35 hover:bg-white/8"
                        : "border-black/8 bg-black/3 text-black/35 hover:bg-black/6"
                      }
                    `}
                  >
                    Done
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main className="flex-1 flex flex-col items-center px-3 sm:px-4 lg:px-6 py-5 sm:py-8 gap-5 sm:gap-8">

        <div className="w-full max-w-[1200px] flex-1 flex flex-col">

          {/* column on mobile, row on sm+ */}
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6 lg:gap-8 w-full flex-1">

            {/* switch panel */}
            <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
              <SwitchPanel />
            </div>


              <RoomLayout />

          </div>
        </div>

      </main>

      {/* ══ FOOTER ══ */}
      <footer className={`
        px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2
        border-t transition-colors duration-400
        ${isDark ? "border-white/5" : "border-black/6"}
      `}>
        <span className={`
          font-mono text-[10px] tracking-[2px] uppercase
          ${isDark ? "text-amber-400/30" : "text-[rgba(26,42,90,0.30)]"}
        `}>
          ARISS · Island Series
        </span>
        <span className={`
          font-mono text-[10px]
          ${isDark ? "text-white/15" : "text-black/20"}
        `}>
          Tap devices to control
        </span>
      </footer>

    </div>
  );
}