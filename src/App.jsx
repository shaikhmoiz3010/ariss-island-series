import SwitchPanel from "./components/Switch/SwitchPanel";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import ThemePicker from "./components/ThemePicker/ThemePicker";

export default function App() {
  return (
    <div className="bg-gray-600 " style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <header className="position-sticky top-0 h-[56px] bg-black/60" style={{
        position: "sticky",
        zIndex: 100,
      }}>

        {/* content wrapper */}
        <div className="max-w-[1100px] mx-auto px-6 h-full flex align-items items-center" style={{
          justifyContent: "space-between",
        }}>

          <div className="flex items-baseline gap-2.5">
            <span className="font-sans text-lg tracking-wider text-amber-600 uppercase">
              ARISS
            </span>
            <span className="font-sans text-sm tracking-wider text-white">
              Island Series
            </span>
          </div>
          <ThemePicker />
        </div>
      </header>

      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px 80px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "90px",
          flexWrap: "wrap",
        }}>
          <SwitchPanel />
          <InfoPanel />
        </div>
      </main>
    </div>
  );
}
