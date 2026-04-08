import SwitchPanel from "./components/Switch/SwitchPanel";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import ThemePicker from "./components/ThemePicker/ThemePicker";
import BgToggle from "./components/ThemePicker/BgToggle";
import { useThemeStore } from "./state/useThemeStore";
import RoomLayout from "./components/RoomLayout/RoomLayout";

const BG = {
  light: {
    bg: "#a8a9ab",
    gradient: `radial-gradient(ellipse 80% 60% at 30% 20%, rgba(80,120,95,0.07) 0%, transparent 100%),
               radial-gradient(ellipse 60% 40% at 70% 80%, rgba(233,200,124,0.025) 0%, transparent 100%)`,
    headerBg: "rgba(255,255,255,0.18)",
    headerBorder: "rgba(0,0,0,0.08)",
  },
  dark: {
    bg: "#1a1b1e",
    gradient: `radial-gradient(ellipse 80% 60% at 30% 20%, rgba(40,70,55,0.18) 0%, transparent 100%),
               radial-gradient(ellipse 60% 40% at 70% 80%, rgba(233,200,124,0.04) 0%, transparent 100%)`,
    headerBg: "rgba(0,0,0,0.60)",
    headerBorder: "rgba(255,255,255,0.06)",
  },
};

export default function App() {
  const bgMode = useThemeStore((s) => s.bgMode);
  const { bg, gradient, headerBg, headerBorder } = BG[bgMode];
  const isDark = bgMode === "dark";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: bg,
      backgroundImage: gradient,
      transition: "background 0.4s ease",
    }}>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky",
        top: 0,
        height: "56px",
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex: 100,
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}>
        <div className="max-w-[1100px] mx-auto px-4 h-full flex items-center"
          style={{ justifyContent: "space-between" }}>
          <div className="flex items-baseline gap-2.5">
            <span className="font-sans text-lg tracking-wider text-amber-600 uppercase">
              ARISS
            </span>
            <span style={{
              fontFamily: "sans-serif",
              fontSize: "14px",
              letterSpacing: "0.05em",
              color: isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.55)",
              transition: "color 0.4s ease",
            }}>
              Island Series
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <BgToggle />
            <div style={{
              width: "1px",
              height: "28px",
              background: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)",
            }} />
            <ThemePicker />
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px 80px",
        gap: "24px",
      }}>

        {/*
          mobile  < 640px  → column  (switch on top, room below)
          tablet  ≥ 640px  → row     (switch left, room right)
          desktop ≥ 1024px → row with more space
        */}
        <div style={{
          width: "100%",
          maxWidth: "1200px",
        }}>

          {/* row on tablet+, column on mobile */}
          <div className="flex flex-col sm:flex-row"
            style={{
              width: "100%",
              gap: "clamp(12px, 3vw, 40px)",
              alignItems: "stretch",      // ← both children same height
            }}
          >
            {/* ── Switch panel — fixed width on larger screens, full width on mobile ── */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-center flex-shrink-0">
              <SwitchPanel />
            </div>

            {/* ── Room layout ── */}
            <div style={{ flex: 1, width: "100%", minWidth: 0, minHeight: 0 }}>
              <RoomLayout />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}