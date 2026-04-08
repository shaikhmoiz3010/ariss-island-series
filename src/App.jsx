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
    headerBg:     "rgba(255,255,255,0.18)",
    headerBorder: "rgba(0,0,0,0.08)",
  },
  dark: {
    bg: "#1a1b1e",
    gradient: `radial-gradient(ellipse 80% 60% at 30% 20%, rgba(40,70,55,0.18) 0%, transparent 100%),
               radial-gradient(ellipse 60% 40% at 70% 80%, rgba(233,200,124,0.04) 0%, transparent 100%)`,
    headerBg:     "rgba(0,0,0,0.60)",
    headerBorder: "rgba(255,255,255,0.06)",
  },
};

export default function App() {
  const bgMode = useThemeStore((s) => s.bgMode);
  const { bg, gradient, headerBg, headerBorder } = BG[bgMode];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: bg,
      backgroundImage: gradient,
      transition: "background 0.4s ease, background-image 0.4s ease",
    }}>
      <header style={{
        position:       "sticky",
        top:            0,
        height:         "56px",
        background:     headerBg,
        borderBottom:   `1px solid ${headerBorder}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex:         100,
        transition:     "background 0.4s ease, border-color 0.4s ease",
      }}>
        <div className="max-w-[1100px] mx-auto px-6 h-full flex items-center" style={{ justifyContent: "space-between" }}>
          <div className="flex items-baseline gap-2.5">
            <span className="font-sans text-lg tracking-wider text-amber-600 uppercase">ARISS</span>
            <span style={{
              fontFamily: "sans-serif",
              fontSize: "14px",
              letterSpacing: "0.05em",
              color: bgMode === "light" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.70)",
              transition: "color 0.4s ease",
            }}>
              Island Series
            </span>
          </div>
          <div className="flex items-center gap-5">
            <BgToggle />
            <div style={{ width: "1px", height: "28px", background: bgMode === "light" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.10)", transition: "background 0.4s ease" }} />
            <ThemePicker />
          </div>
        </div>
      </header>

      <main style={{
        flex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 24px 80px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "90px",
          flexWrap: "wrap",
        }}>
          <SwitchPanel />
<div style={{ maxWidth: '600px', width: '100%', margin: '0 auto', padding: '0 24px 80px' }}>
  <RoomLayout />
</div>
          

        </div>
      </main>
    </div>
  );
}