import { useState } from "react";
import MobileTopBar from "./MobileTopBar";
import useSolar from "../state/store";

const MobileViewpointBar = () => {
  const vpId = useSolar((s) => s.activeViewpoint);
  const viewpoints = useSolar((s) => s.viewpoints);
  const dirIdx = useSolar((s) => s.activeDirection);
  const year = useSolar((s) => s.currentYear);
  const season = useSolar((s) => s.currentSeason);
  const developmentVisible = useSolar((s) => s.developmentVisible);
  const setStage = useSolar((s) => s.setStage);
  const setDir = useSolar((s) => s.setDirection);
  const setYear = useSolar((s) => s.setCurrentYear);
  const setSeason = useSolar((s) => s.setCurrentSeason);
  const exit = useSolar((s) => s.exitToOverview);
  const [expanded, setExpanded] = useState(false);

  const vp = viewpoints.find((v) => v.no === vpId);
  if (!vp) return null;

  // derive active stage for highlight
  let activeStage = null;
  if (!developmentVisible) activeStage = "baseline";
  else if (year === 1) activeStage = "built";
  else if (year === 10) activeStage = "grown";

  const STAGES = [
    { key: "baseline", label: "Before" },
    { key: "built", label: "As built" },
    { key: "grown", label: "Year 10" },
  ];

  return (
    <>
      <MobileTopBar />
      <div style={bar}>
        {/* stage — the mini timeline */}
        <div style={segRow}>
          {STAGES.map((s) => (
            <button
              key={s.key}
              style={activeStage === s.key ? segActive : seg}
              onClick={() => setStage(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* direction */}
        <div style={dirRow}>
          {vp.directions.map((d, i) => (
            <button
              key={i}
              style={i === dirIdx ? dirActive : dir}
              onClick={() => setDir(i)}
            >
              {d.shortLabel}
            </button>
          ))}
        </div>

        {/* expandable: slider + season */}
        {expanded && (
          <div style={{ marginTop: 8 }}>
            <input
              type="range"
              min={1}
              max={10}
              value={year}
              disabled={!developmentVisible}
              onChange={(e) => setYear(+e.target.value)}
              style={{ width: "100%", opacity: developmentVisible ? 1 : 0.4 }}
            />
            <div style={segRow}>
              <button
                style={season === "summer" ? segActive : seg}
                onClick={() => setSeason("summer")}
              >
                Summer
              </button>
              <button
                style={season === "winter" ? segActive : seg}
                onClick={() => setSeason("winter")}
              >
                Winter
              </button>
            </div>
          </div>
        )}

        <button onClick={() => setExpanded((e) => !e)} style={moreBtn}>
          {expanded ? "Less ▲" : "More ▼"}
        </button>
      </div>
    </>
  );
};

export default MobileViewpointBar;

const bar = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "rgba(255,255,255,0.95)",
  padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  boxShadow: "0 -2px 14px rgba(0,0,0,0.14)",
  fontFamily: "system-ui, sans-serif",
};
const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
};
const linkBtn = {
  border: "none",
  background: "none",
  color: "#2a7d2a",
  fontSize: 13,
  fontWeight: 600,
};
const segRow = {
  display: "flex",
  gap: 0,
  marginBottom: 8,
  border: "1px solid #2a7d2a",
  borderRadius: 8,
  overflow: "hidden",
};
const seg = {
  flex: 1,
  minHeight: 44,
  border: "none",
  borderRight: "1px solid #2a7d2a",
  background: "#fff",
  color: "#2a7d2a",
  fontSize: 13,
  fontWeight: 600,
};
const segActive = { ...seg, background: "#2a7d2a", color: "#fff" };
const dirRow = {
  display: "flex",
  justifyContent: "center", // centre the group horizontally
  gap: 8,
  marginBottom: 8,
};
const dir = {
  minHeight: 40,
  padding: "0 12px",
  border: "1px solid #ccc",
  borderRadius: 6,
  background: "#fff",
  fontSize: 12,
};
const dirActive = {
  ...dir,
  background: "#2a7d2a",
  color: "#fff",
  borderColor: "#2a7d2a",
};
const moreBtn = {
  width: "100%",
  minHeight: 36,
  border: "none",
  background: "none",
  color: "#666",
  fontSize: 12,
  marginTop: 4,
};
