import { useState } from "react";
import SwitchPanel from "./components/Switch/SwitchPanel";
import ThemePicker from "./components/ThemePicker/ThemePicker";
import BgToggle from "./components/ThemePicker/BgToggle";
import { useThemeStore } from "./state/useThemeStore";
import RoomLayout from "./components/RoomLayout/RoomLayout";
import { HOUSING_THEMES, BUTTON_THEMES } from "./constants/themes";
import switchBg from "../src/assets/bg3.png";

export default function App() {
  const bgMode = useThemeStore((s) => s.bgMode);
  const { housingId, buttonId, setHousing, setButton } = useThemeStore();
  const isDark = bgMode === "dark";

  const [bodyOpen,   setBodyOpen]   = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);

  const closeAll = () => { setBodyOpen(false); setSwitchOpen(false); };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-700 relative overflow-hidden`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 30%, #0d1117 60%, #080c10 100%)"
          : "linear-gradient(135deg, #e8eaf6 0%, #dde8f0 30%, #e0ecf4 60%, #d8e8f8 100%)",
      }}
    >
      {/* ── Ambient gradient orbs ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      >
        {/* top-left orb */}
        <div
          className="absolute rounded-full blur-[120px] transition-all duration-700"
          style={{
            width: 520,
            height: 520,
            top: -180,
            left: -160,
            background: isDark
              ? "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)",
          }}
        />
        {/* bottom-right orb */}
        <div
          className="absolute rounded-full blur-[140px] transition-all duration-700"
          style={{
            width: 600,
            height: 600,
            bottom: -200,
            right: -180,
            background: isDark
              ? "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(251,191,36,0.16) 0%, transparent 70%)",
          }}
        />
        {/* centre accent */}
        <div
          className="absolute rounded-full blur-[180px] transition-all duration-700"
          style={{
            width: 400,
            height: 400,
            top: "40%",
            left: "45%",
            transform: "translate(-50%,-50%)",
            background: isDark
              ? "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ══ HEADER ══ */}
      <header
        className="sticky top-0 h-14 z-50 border-b transition-all duration-500"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          background: isDark
            ? "linear-gradient(180deg, rgba(10,10,20,0.85) 0%, rgba(10,10,20,0.70) 100%)"
            : "linear-gradient(180deg, rgba(240,244,255,0.82) 0%, rgba(224,236,252,0.68) 100%)",
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.15)",
          boxShadow: isDark
            ? "0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)"
            : "0 1px 0 rgba(255,255,255,0.8), 0 4px 20px rgba(99,102,241,0.08)",
        }}
      >
        {/* shimmer line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(245,158,11,0.35), rgba(139,92,246,0.25), transparent)"
              : "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(56,189,248,0.25), transparent)",
          }}
        />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">
          {/* ── brand ── */}
          <div className="flex items-center gap-2.6">
            <span
              className="text-orange-500 font-mono text-sm sm:text-base tracking-[0.18em] uppercase font-semibold"
            >
              ARISS
            </span>
            <span
              className="mx-3 hidden sm:inline font-sans text-[13px] tracking-[3px] transition-colors duration-400"
              style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(30,30,60,0.55)" }}
            >
              Island Series
            </span>
          </div>

          {/* ── right controls ── */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            <BgToggle />

            {/* ── DESKTOP: ThemePicker inline ── */}
            <div className="hidden sm:block">
              <ThemePicker />
            </div>

            {/* ── MOBILE: Body color button ── */}
            <div className="relative sm:hidden">
              <button
                onClick={() => { setBodyOpen(o => !o); setSwitchOpen(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border cursor-pointer transition-all duration-200 active:scale-95"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  background: bodyOpen
                    ? isDark ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.14)"
                    : isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)",
                  borderColor: bodyOpen
                    ? isDark ? "rgba(99,102,241,0.55)" : "rgba(99,102,241,0.4)"
                    : isDark ? "rgba(255,255,255,0.12)" : "rgba(99,102,241,0.2)",
                  boxShadow: isDark
                    ? "inset 0 1px 0 rgba(255,255,255,0.06)"
                    : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(99,102,241,0.1)",
                }}
              >
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{
                    background: HOUSING_THEMES.find(t => t.id === housingId)?.swatch ?? "#fff",
                    border: "1px solid rgba(0,0,0,0.15)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
                <span
                  className="font-mono text-[9px] tracking-[1.2px] uppercase font-medium"
                  style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(30,30,60,0.7)" }}
                >
                  Body
                </span>
                <svg
                  width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"
                  className={`transition-transform duration-200 ${bodyOpen ? "rotate-180" : ""}`}
                  style={{ stroke: isDark ? "rgba(255,255,255,0.45)" : "rgba(30,30,60,0.45)" }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {bodyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAll}/>
                  <div
                    className="absolute top-[calc(100%+8px)] right-0 z-50 w-[200px] p-3.5 rounded-2xl border shadow-2xl animate-[dropIn_0.16s_ease_forwards]"
                    style={{
                      backdropFilter: "blur(32px) saturate(200%)",
                      WebkitBackdropFilter: "blur(32px) saturate(200%)",
                      background: isDark
                        ? "linear-gradient(135deg, rgba(15,15,30,0.92) 0%, rgba(20,18,35,0.88) 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(240,244,255,0.88) 100%)",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.2)",
                      boxShadow: isDark
                        ? "0 24px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)"
                        : "0 24px 48px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
                    }}
                  >
                    <div
                      className="flex items-center justify-between mb-3 pb-2"
                      style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(99,102,241,0.12)" }}
                    >
                      <span
                        className="font-mono text-[12px] tracking-[2.5px] uppercase font-semibold"
                        style={{
                          background: isDark
                            ? "linear-gradient(90deg, #fbbf24, #f97316)"
                            : "linear-gradient(90deg, #7c3aed, #4f46e5)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Body Colour
                      </span>
                      <button
                        onClick={closeAll}
                        className="w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all duration-150"
                        style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.07)" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"
                          style={{ stroke: isDark ? "rgba(255,255,255,0.5)" : "rgba(30,30,60,0.5)" }}>
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {HOUSING_THEMES.map(t => (
                        <button
                          key={t.id}
                          title={t.label}
                          onClick={() => setHousing(t.id)}
                          className="relative w-8 h-8 rounded-lg border-2 cursor-pointer transition-all duration-150 active:scale-90 hover:scale-110"
                          style={{
                            background: t.swatch,
                            borderColor: t.id === housingId ? "#f59e0b" : "rgba(255,255,255,0.18)",
                            boxShadow: t.id === housingId
                              ? "0 0 0 3px rgba(245,158,11,0.3), 0 4px 12px rgba(0,0,0,0.3)"
                              : "0 2px 6px rgba(0,0,0,0.2)",
                          }}
                        >
                          {t.id === housingId && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                style={{ stroke: t.id === "black" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)" }}>
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <p className="mt-2.5 font-mono text-[8px] tracking-[1.5px] uppercase text-center"
                      style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(30,30,60,0.3)" }}>
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all duration-200 active:scale-95"
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  background: switchOpen
                    ? isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.12)"
                    : isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)",
                  borderColor: switchOpen
                    ? isDark ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.35)"
                    : isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.18)",
                  boxShadow: isDark
                    ? "inset 0 1px 0 rgba(255,255,255,0.06)"
                    : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(99,102,241,0.08)",
                }}
              >
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{
                    background: BUTTON_THEMES.find(t => t.id === buttonId)?.swatch ?? "#5c8a6e",
                    border: "1px solid rgba(0,0,0,0.15)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
                <span
                  className="font-mono text-[9px] tracking-[1.2px] uppercase font-medium"
                  style={{ color: isDark ? "rgba(255,255,255,0.65)" : "rgba(30,30,60,0.65)" }}
                >
                  Switch
                </span>
                <svg
                  width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"
                  className={`transition-transform duration-200 ${switchOpen ? "rotate-180" : ""}`}
                  style={{ stroke: isDark ? "rgba(255,255,255,0.38)" : "rgba(30,30,60,0.38)" }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {switchOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAll}/>
                  <div
                    className="absolute top-[calc(100%+8px)] right-0 z-50 w-[200px] p-3.5 rounded-2xl border shadow-2xl animate-[dropIn_0.16s_ease_forwards]"
                    style={{
                      backdropFilter: "blur(32px) saturate(200%)",
                      WebkitBackdropFilter: "blur(32px) saturate(200%)",
                      background: isDark
                        ? "linear-gradient(135deg, rgba(15,15,30,0.92) 0%, rgba(20,18,35,0.88) 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(240,244,255,0.88) 100%)",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.2)",
                      boxShadow: isDark
                        ? "0 24px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)"
                        : "0 24px 48px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
                    }}
                  >
                    <div
                      className="flex items-center justify-between mb-3 pb-2"
                      style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(99,102,241,0.12)" }}
                    >
                      <span
                        className="font-mono text-[8px] tracking-[2.5px] uppercase font-semibold"
                        style={{
                          background: isDark
                            ? "linear-gradient(90deg, #fbbf24, #f97316)"
                            : "linear-gradient(90deg, #7c3aed, #4f46e5)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Button Colour
                      </span>
                      <button
                        onClick={closeAll}
                        className="w-5 h-5 rounded-md flex items-center justify-center cursor-pointer"
                        style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.07)" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round"
                          style={{ stroke: isDark ? "rgba(255,255,255,0.5)" : "rgba(30,30,60,0.5)" }}>
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {BUTTON_THEMES.map(t => (
                        <button
                          key={t.id}
                          title={t.label}
                          onClick={() => setButton(t.id)}
                          className="relative w-8 h-8 rounded-lg border-2 cursor-pointer transition-all duration-150 active:scale-90 hover:scale-110"
                          style={{
                            background: t.swatch,
                            borderColor: t.id === buttonId ? "#f59e0b" : "rgba(255,255,255,0.18)",
                            boxShadow: t.id === buttonId
                              ? "0 0 0 3px rgba(245,158,11,0.3), 0 4px 12px rgba(0,0,0,0.3)"
                              : "0 2px 6px rgba(0,0,0,0.2)",
                          }}
                        >
                          {t.id === buttonId && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                style={{ stroke: t.id === "white" || t.id === "silver" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)" }}>
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <p className="mt-2.5 font-mono text-[8px] tracking-[1.5px] uppercase text-center"
                      style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(30,30,60,0.3)" }}>
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
      <main className="relative z-10 flex-1 flex flex-col items-center px-3 sm:px-4 lg:px-6 py-5 sm:py-8 gap-5 sm:gap-8">
        <div className="w-full max-w-[1200px] flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6 lg:gap-8 w-full flex-1">

            {/* switch panel — glass card */}
{/* switch panel — glass card */}
<div
  className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start rounded-2xl p-1 transition-all duration-500"
  style={{
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
    backgroundImage: `url(${switchBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(99,102,241,0.15)",
    boxShadow: isDark
      ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)"
      : "0 8px 32px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
  }}
>
  <SwitchPanel />
</div>

            {/* room layout — glass card */}
            <div
              className="flex-1 w-full min-h-[260px] sm:h-full md:h-full rounded-2xl overflow-hidden transition-all duration-500"
              style={{
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                background: isDark
                  ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(235,242,255,0.50) 100%)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(99,102,241,0.15)",
                boxShadow: isDark
                  ? "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 8px 40px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              <RoomLayout />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}