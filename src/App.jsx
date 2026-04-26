import { useState, useEffect } from "react";
import SwitchPanel from "./components/Switch/SwitchPanel";
import ThemePicker from "./components/ThemePicker/ThemePicker";
import BgToggle from "./components/ThemePicker/BgToggle";
import { useThemeStore } from "./state/useThemeStore";
import RoomLayout from "./components/RoomLayout/RoomLayout";
import { HOUSING_THEMES, BUTTON_THEMES } from "./constants/themes";
import MobileApp from "./components/MobileApp/MobileApp";

export default function App() {
  const bgMode = useThemeStore((s) => s.bgMode);
  const { housingId, buttonId, setHousing, setButton } = useThemeStore();
  const isDark = bgMode === "dark";

  const [bodyOpen,   setBodyOpen]   = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [showApp,    setShowApp]    = useState(false);
  // "left" | "right" — which side the panel slides in from
  const [panelSide,  setPanelSide]  = useState("left");

  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email,       setEmail]       = useState("");
  const [whatsapp,    setWhatsapp]    = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState("");

  const closeAll = () => { setBodyOpen(false); setSwitchOpen(false); };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSubmitted) setShowEmailCapture(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, [isSubmitted]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() && whatsapp.trim()) {
      setIsLoading(true);
      setError("");
      try {
        const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwh5oSRFdrUBZCJw3pkYiEqdaxj0vB3j1FtgHKFP43xKWG3fgYTKXRaeTddYsJDS2Hb/exec";
        const formData = new FormData();
        formData.append("email",     email.trim());
        formData.append("whatsapp",  whatsapp.trim());
        formData.append("timestamp", new Date().toISOString());
        formData.append("source",    "Island Series UI");
        const [response] = await Promise.all([
          fetch(GOOGLE_SHEET_URL, { method: "POST", body: formData, mode: "no-cors" }),
          new Promise(resolve => setTimeout(resolve, 800)),
        ]);
        setIsLoading(false);
        setIsSubmitted(true);
        setTimeout(() => { setShowEmailCapture(false); setEmail(""); setWhatsapp(""); }, 3000);
      } catch (err) {
        console.error("Error submitting:", err);
        setIsLoading(false);
        setError("Something went wrong. Please try again.");
        setTimeout(() => {
          setIsSubmitted(true);
          setTimeout(() => { setShowEmailCapture(false); setEmail(""); setWhatsapp(""); }, 3000);
        }, 1000);
      }
    }
  };

  // ── Panel position styles ──
  const isLeft  = panelSide === "left";
  const hiddenTranslate  = isLeft ? "-translate-x-full" : "translate-x-full";
  const visibleTranslate = "translate-x-0";
  const panelPositionStyle = isLeft
    ? { left: 0, right: "auto" }
    : { right: 0, left: "auto" };

  return (
    <div
      className="min-h-screen flex flex-col transition-all duration-700 relative overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 30%, #0d1117 60%, #080c10 100%)"
          : "linear-gradient(135deg, #e8eaf6 0%, #dde8f0 30%, #e0ecf4 60%, #d8e8f8 100%)",
      }}
    >
      {/* ── mobile app backdrop ── */}
      {showApp && (
        <div
          className="fixed inset-0 z-[200] transition-opacity duration-300"
          onClick={() => setShowApp(false)}
        />
      )}

      {/* ── mobile app slide panel ── */}
      <div
        className={`fixed top-0 h-full z-[201] transition-transform duration-300 ease-out ${
          showApp ? visibleTranslate : hiddenTranslate
        }`}
        style={{
          width: "min(90vw, 420px)",
          ...panelPositionStyle,
        }}
      >
        <div className="h-full flex flex-col relative">
          <div
            className="h-full overflow-hidden shadow-2xl relative"
            style={{
              background: "#2a2a2a",
              borderRight: isLeft
                ? isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(99,102,241,0.2)"
                : "none",
              borderLeft: !isLeft
                ? isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(99,102,241,0.2)"
                : "none",
              boxShadow: isLeft
                ? "4px 0 40px rgba(0,0,0,0.5)"
                : "-4px 0 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* ── close button ── */}
            <button
              onClick={() => setShowApp(false)}
              className="absolute top-4 z-[300] w-10 h-10 rounded-full border cursor-pointer transition-all duration-200 active:scale-95 hover:scale-105 flex items-center justify-center"
              style={{
                right: isLeft ? 56 : "auto",
                left:  !isLeft ? 56 : "auto",
                background:   "rgba(0,0,0,0.6)",
                borderColor:  "rgba(255,255,255,0.2)",
                boxShadow:    "0 4px 16px rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: "rgba(255,255,255,0.9)" }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6"  y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* ── side-swap button ── */}
            <button
              onClick={() => setPanelSide(s => s === "left" ? "right" : "left")}
              title={isLeft ? "Move to right side" : "Move to left side"}
              className="absolute top-4 z-[300] w-10 h-10 rounded-full border cursor-pointer transition-all duration-200 active:scale-95 hover:scale-105 flex items-center justify-center"
              style={{
                right: isLeft ? 12 : "auto",
                left:  !isLeft ? 12 : "auto",
                background:   "rgba(0,0,0,0.6)",
                borderColor:  "rgba(255,255,255,0.2)",
                boxShadow:    "0 4px 16px rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Arrow pointing to the opposite side */}
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{
                  stroke: "rgba(255,255,255,0.9)",
                  transform: isLeft ? "scaleX(1)" : "scaleX(-1)",
                }}
              >
                {/* Double arrow / swap icon */}
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6  17 11 12 6  7" />
              </svg>
            </button>

            <MobileApp />
          </div>
        </div>
      </div>

      {/* ── Ambient gradient orbs ── */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute rounded-full blur-[120px] transition-all duration-700 w-[520px] h-[520px] -top-[180px] -left-[160px]"
          style={{ background: isDark ? "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full blur-[140px] transition-all duration-700 w-[600px] h-[600px] -bottom-[200px] -right-[180px]"
          style={{ background: isDark ? "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)" : "radial-gradient(circle, rgba(251,191,36,0.16) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full blur-[180px] transition-all duration-700 w-[400px] h-[400px] top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: isDark ? "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)" : "radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 70%)" }} />
      </div>

      {/* ══ HEADER ══ */}
      <header
        className="sticky top-0 h-14 z-50 border-b transition-all duration-500"
        style={{
          backdropFilter:       "blur(24px) saturate(180%)",
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
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: isDark ? "linear-gradient(90deg, transparent, rgba(245,158,11,0.35), rgba(139,92,246,0.25), transparent)" : "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(56,189,248,0.25), transparent)" }} />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between relative">

          {/* brand */}
          <div className="flex items-center">
            <span className="text-orange-500 font-mono text-sm sm:text-base tracking-[0.18em] uppercase font-semibold">ARISS</span>
            <span className="mx-3 hidden sm:inline font-sans text-[13px] tracking-[3px] transition-colors duration-300" style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(30,30,60,0.55)" }}>Island Series</span>
          </div>

          {/* right controls */}
          <div className="flex items-center gap-2 sm:gap-3 relative">

            {/* phone button */}
            <button
              onClick={() => setShowApp(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border cursor-pointer transition-all duration-200 active:scale-95"
              style={{
                background:  isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.55)",
                borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(99,102,241,0.18)",
                boxShadow:   isDark ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(99,102,241,0.08)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: isDark ? "rgba(255,255,255,0.65)" : "rgba(30,30,60,0.65)" }}>
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <line x1="12" y1="18" x2="12" y2="18.01"/>
              </svg>
              <span className="font-mono text-[9px] tracking-[1px] uppercase hidden sm:inline" style={{ color: isDark ? "rgba(255,255,255,0.65)" : "rgba(30,30,60,0.65)" }}>App</span>
            </button>

            <BgToggle />

            {/* desktop ThemePicker */}
            <div className="hidden sm:block"><ThemePicker /></div>

            {/* mobile body colour */}
            <div className="relative sm:hidden">
              <button
                onClick={() => { setBodyOpen(o => !o); setSwitchOpen(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border cursor-pointer transition-all duration-200 active:scale-95 backdrop-blur-md"
                style={{
                  background:  bodyOpen ? (isDark ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.14)") : (isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)"),
                  borderColor: bodyOpen ? (isDark ? "rgba(99,102,241,0.55)" : "rgba(99,102,241,0.4)") : (isDark ? "rgba(255,255,255,0.12)" : "rgba(99,102,241,0.2)"),
                  boxShadow:   isDark ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(99,102,241,0.1)",
                }}
              >
                <div className="w-3 h-3 rounded-sm flex-shrink-0 border border-black/15 shadow-sm" style={{ background: HOUSING_THEMES.find(t => t.id === housingId)?.swatch ?? "#fff" }} />
                <span className="font-mono text-[9px] tracking-[1.2px] uppercase font-medium" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(30,30,60,0.7)" }}>Body</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform duration-200 ${bodyOpen ? "rotate-180" : ""}`} style={{ stroke: isDark ? "rgba(255,255,255,0.45)" : "rgba(30,30,60,0.45)" }}><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {bodyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAll} />
                  <div className="absolute top-[calc(100%+8px)] right-0 z-50 w-[200px] p-3.5 rounded-2xl border shadow-2xl animate-[dropIn_0.16s_ease_forwards] backdrop-blur-2xl"
                    style={{ backdropFilter: "blur(32px) saturate(200%)", WebkitBackdropFilter: "blur(32px) saturate(200%)", background: isDark ? "linear-gradient(135deg, rgba(15,15,30,0.92) 0%, rgba(20,18,35,0.88) 100%)" : "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(240,244,255,0.88) 100%)", borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.2)", boxShadow: isDark ? "0 24px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" : "0 24px 48px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.95)" }}>
                    <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(99,102,241,0.12)" }}>
                      <span className="font-mono text-[12px] tracking-[2.5px] uppercase font-semibold bg-clip-text text-transparent" style={{ backgroundImage: isDark ? "linear-gradient(90deg, #fbbf24, #f97316)" : "linear-gradient(90deg, #7c3aed, #4f46e5)" }}>Body Colour</span>
                      <button onClick={closeAll} className="w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all duration-150" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.07)" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: isDark ? "rgba(255,255,255,0.5)" : "rgba(30,30,60,0.5)" }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {HOUSING_THEMES.map(t => (
                        <button key={t.id} title={t.label} onClick={() => setHousing(t.id)} className="relative w-8 h-8 rounded-lg border-2 cursor-pointer transition-all duration-150 active:scale-90 hover:scale-110" style={{ background: t.swatch, borderColor: t.id === housingId ? "#f59e0b" : "rgba(255,255,255,0.18)", boxShadow: t.id === housingId ? "0 0 0 3px rgba(245,158,11,0.3), 0 4px 12px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.2)" }}>
                          {t.id === housingId && <span className="absolute inset-0 flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: t.id === "black" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)" }}><polyline points="20 6 9 17 4 12" /></svg></span>}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2.5 font-mono text-[8px] tracking-[1.5px] uppercase text-center" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(30,30,60,0.3)" }}>{HOUSING_THEMES.find(t => t.id === housingId)?.label ?? "—"}</p>
                  </div>
                </>
              )}
            </div>

            {/* mobile switch colour */}
            <div className="relative sm:hidden">
              <button
                onClick={() => { setSwitchOpen(o => !o); setBodyOpen(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all duration-200 active:scale-95 backdrop-blur-md"
                style={{
                  background:  switchOpen ? (isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.12)") : (isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.5)"),
                  borderColor: switchOpen ? (isDark ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.35)") : (isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.18)"),
                  boxShadow:   isDark ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(99,102,241,0.08)",
                }}
              >
                <div className="w-3 h-3 rounded-sm flex-shrink-0 border border-black/15 shadow-sm" style={{ background: BUTTON_THEMES.find(t => t.id === buttonId)?.swatch ?? "#5c8a6e" }} />
                <span className="font-mono text-[9px] tracking-[1.2px] uppercase font-medium" style={{ color: isDark ? "rgba(255,255,255,0.65)" : "rgba(30,30,60,0.65)" }}>Switch</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" className={`transition-transform duration-200 ${switchOpen ? "rotate-180" : ""}`} style={{ stroke: isDark ? "rgba(255,255,255,0.38)" : "rgba(30,30,60,0.38)" }}><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {switchOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAll} />
                  <div className="absolute top-[calc(100%+8px)] right-0 z-50 w-[200px] p-3.5 rounded-2xl border shadow-2xl animate-[dropIn_0.16s_ease_forwards] backdrop-blur-2xl"
                    style={{ backdropFilter: "blur(32px) saturate(200%)", WebkitBackdropFilter: "blur(32px) saturate(200%)", background: isDark ? "linear-gradient(135deg, rgba(15,15,30,0.92) 0%, rgba(20,18,35,0.88) 100%)" : "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(240,244,255,0.88) 100%)", borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.2)", boxShadow: isDark ? "0 24px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" : "0 24px 48px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.95)" }}>
                    <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(99,102,241,0.12)" }}>
                      <span className="font-mono text-[8px] tracking-[2.5px] uppercase font-semibold bg-clip-text text-transparent" style={{ backgroundImage: isDark ? "linear-gradient(90deg, #fbbf24, #f97316)" : "linear-gradient(90deg, #7c3aed, #4f46e5)" }}>Button Colour</span>
                      <button onClick={closeAll} className="w-5 h-5 rounded-md flex items-center justify-center cursor-pointer" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.07)" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: isDark ? "rgba(255,255,255,0.5)" : "rgba(30,30,60,0.5)" }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {BUTTON_THEMES.map(t => (
                        <button key={t.id} title={t.label} onClick={() => setButton(t.id)} className="relative w-8 h-8 rounded-lg border-2 cursor-pointer transition-all duration-150 active:scale-90 hover:scale-110" style={{ background: t.swatch, borderColor: t.id === buttonId ? "#f59e0b" : "rgba(255,255,255,0.18)", boxShadow: t.id === buttonId ? "0 0 0 3px rgba(245,158,11,0.3), 0 4px 12px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.2)" }}>
                          {t.id === buttonId && <span className="absolute inset-0 flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: t.id === "white" || t.id === "silver" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)" }}><polyline points="20 6 9 17 4 12" /></svg></span>}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2.5 font-mono text-[8px] tracking-[1.5px] uppercase text-center" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(30,30,60,0.3)" }}>{BUTTON_THEMES.find(t => t.id === buttonId)?.label ?? "—"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main className="relative z-10 flex-2 flex flex-col items-center px-3 sm:px-12 lg:px-6 py-4 sm:py-8 gap-5 sm:gap-8">
        <div className="w-full flex-1 flex flex-col">
          <div className="flex flex-col-reverse sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6 lg:gap-8 w-full flex-1">

            {/* switch panel */}
            <div
              className="flex-shrink-0 w-full sm:w-auto h-full flex justify-center sm:justify-start rounded-2xl p-1 transition-all duration-500"
              style={{
                backdropFilter:       "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(99,102,241,0.15)",
                boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" : "0 8px 32px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              <SwitchPanel />
            </div>

            {/* room layout */}
            <div
              className="flex-1 w-full h-full sm:min-h-0 rounded-2xl overflow-hidden transition-all duration-500"
              style={{
                backdropFilter:       "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                background: isDark ? "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)" : "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(235,242,255,0.50) 100%)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(99,102,241,0.15)",
                boxShadow: isDark ? "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)" : "0 8px 40px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              <RoomLayout />
            </div>

          </div>
        </div>

        {/* ── Email Capture ── */}
        {showEmailCapture && (
          <div className="fixed bottom-0 left-0 right-0 z-[150] transition-all duration-500 ease-out" style={{ animation: "slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
            <style>{`
              @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
              @keyframes spin { to { transform: rotate(360deg); } }
              @keyframes checkmark { 0% { stroke-dashoffset: 100; opacity: 0; } 50% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 1; } }
              .loading-spinner { animation: spin 1s linear infinite; }
              .checkmark-path { stroke-dasharray: 100; animation: checkmark 0.6s ease-out forwards; }
            `}</style>
            <div className="max-w-md mx-auto m-4 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl" style={{ background: isDark ? "linear-gradient(135deg, rgba(30,30,40,0.98) 0%, rgba(20,20,30,0.98) 100%)" : "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,255,0.98) 100%)", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(99,102,241,0.2)", boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" : "0 20px 60px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.95)" }}>
              <button onClick={() => setShowEmailCapture(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95" style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? "none" : "auto" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              <div className="p-8 pt-10">
                {!isSubmitted ? (
                  <>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 mx-auto transition-all duration-300" style={{ background: isDark ? "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", boxShadow: isDark ? "0 8px 32px rgba(245,158,11,0.4), 0 0 0 8px rgba(245,158,11,0.1)" : "0 8px 32px rgba(99,102,241,0.3), 0 0 0 8px rgba(99,102,241,0.1)", transform: isLoading ? "scale(0.95)" : "scale(1)" }}>
                      {isLoading
                        ? <svg className="loading-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      }
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2" style={{ background: isDark ? "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(245,158,11,0.95) 50%, rgba(255,255,255,0.95) 100%)" : "linear-gradient(90deg, rgba(30,30,60,0.95) 0%, rgba(99,102,241,0.95) 50%, rgba(30,30,60,0.95) 100%)", backgroundSize: "200% auto", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Loving the Island Series?</h3>
                    <p className="text-sm text-center mb-6" style={{ color: isDark ? "rgba(255,255,255,0.65)" : "rgba(60,60,90,0.65)" }}>Be the first to know when it's available</p>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} required className="w-full px-5 py-3.5 rounded-xl border-2 outline-none transition-all duration-200" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)", borderColor: error ? "#ef4444" : isDark ? "rgba(255,255,255,0.15)" : "rgba(99,102,241,0.2)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(30,30,60,0.9)", opacity: isLoading ? 0.7 : 1 }} />
                      <div className="relative">
                        <input type="tel" placeholder="WhatsApp Number" value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/[^\d+\s]/g, ""))} disabled={isLoading} required className="w-full px-5 py-3.5 rounded-xl border-2 outline-none transition-all duration-200" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)", borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(99,102,241,0.2)", color: isDark ? "rgba(255,255,255,0.9)" : "rgba(30,30,60,0.9)", opacity: isLoading ? 0.7 : 1 }} />
                      </div>
                      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                      <button type="submit" disabled={isLoading} className="w-full px-5 py-3.5 rounded-xl font-bold text-base cursor-pointer transition-all duration-300 relative overflow-hidden" style={{ background: isLoading ? (isDark ? "rgba(245,158,11,0.5)" : "rgba(99,102,241,0.5)") : (isDark ? "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"), color: "#fff", boxShadow: isLoading ? "none" : (isDark ? "0 6px 24px rgba(245,158,11,0.35)" : "0 6px 24px rgba(99,102,241,0.3)") }}>
                        <span style={{ opacity: isLoading ? 0 : 1 }}>Notify Me</span>
                        {isLoading && <div className="absolute inset-0 flex items-center justify-center gap-2"><svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>Submitting...</span></div>}
                      </button>
                    </form>
                    <p className="text-xs text-center mt-4" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(60,60,90,0.4)" }}>🔒 We respect your privacy. Unsubscribe anytime.</p>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 mx-auto" style={{ background: isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)", boxShadow: "0 0 0 12px rgba(34,197,94,0.05)" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline className="checkmark-path" points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: isDark ? "rgba(255,255,255,0.95)" : "rgba(30,30,60,0.95)" }}>You're on the list!</h3>
                    <p className="text-base" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(60,60,90,0.7)" }}>We'll notify you as soon as the<br />Island Series becomes available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}