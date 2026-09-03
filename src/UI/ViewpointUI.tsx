import { useEffect } from "react";
import useSolar from "../state/store";
import StageControl from "./StageControl";

export default function ViewpointUI() {
  const mode = useSolar((s) => s.viewMode);
  const vpId = useSolar((s) => s.activeViewpoint);

  const dirIdx = useSolar((s) => s.activeDirection);
  const year = useSolar((s) => s.currentYear);
  const season = useSolar((s) => s.currentSeason);
  const viewpoints = useSolar((s) => s.viewpoints);

  const enter = useSolar((s) => s.enterViewpoint);
  const exit = useSolar((s) => s.exitToOverview);
  const setDir = useSolar((s) => s.setDirection);
  const setYear = useSolar((s) => s.setCurrentYear);
  const setSeason = useSolar((s) => s.setCurrentSeason);
  const developmentVisible = useSolar((s) => s.developmentVisible);
  const uiHidden = useSolar((s) => s.uiHidden);

  const vp = vpId != null ? viewpoints.find((v) => v.no === vpId) : null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "h") useSolar.getState().toggleUI();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (mode === "overview") {
    return (
      <div style={panelWrap}>
        <div style={panel}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.2,
              color: "#1a1a1a",
            }}
          >
            Springwell Solar Farm
          </h1>
          <p
            style={{
              fontSize: 13,
              fontWeight: 400,
              margin: "6px 0 0",
              lineHeight: 1.45,
              color: "#666",
            }}
          >
            An interactive visualisation of the consented scheme in
            Lincolnshire.
          </p>
          <p style={sub}>Select a viewpoint to assess:</p>
          {viewpoints
            .filter((v) => [7, 2, 4].includes(v.no))
            .reverse()
            .map((vp, index) => (
              <button key={index} style={btn} onClick={() => enter(vp.no)}>
                <strong>VP{vp.no}</strong> — {vp.description}
              </button>
            ))}
        </div>
      </div>
    );
  }

  // inside the viewpoint-mode branch of your UI component
  const impact = year <= 5 ? vp.impactY1 : vp.impactY10;
  const phase = year <= 5 ? "Year 1" : "Year 10";

  return (
    <>
      {!uiHidden && (
        <div style={panelWrap}>
          <div style={panel}>
            <button style={backBtn} onClick={exit}>
              ← Overview
            </button>
            <h3 style={h3}>VP{vpId}</h3>
            <p style={sub}>{vp.name}</p>
            <p style={tagLine}>
              Assessed visual impact ({phase}): <strong>{impact}</strong>
            </p>

            <StageControl />
            <div style={label}>View direction</div>
            <div style={dirRow}>
              {vp.directions.map((d, i) => (
                <button
                  key={i}
                  style={i === dirIdx ? dirBtnActive : dirBtn}
                  onClick={() => setDir(i)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div style={label}>Year: {year}</div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              disabled={!developmentVisible}
              value={year}
              onChange={(e) => setYear(+e.target.value)}
              style={{ ...slider, opacity: developmentVisible ? 1 : 0.4 }}
            />
            <div style={scaleRow}>
              <span>Planting</span>
              <span>Established</span>
            </div>

            <div style={label}>Season</div>
            <div style={dirRow}>
              <button
                style={season === "summer" ? dirBtnActive : dirBtn}
                onClick={() => setSeason("summer")}
              >
                Summer
              </button>
              <button
                style={season === "winter" ? dirBtnActive : dirBtn}
                onClick={() => setSeason("winter")}
              >
                Winter (leaf-off)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- minimal styling; swap for your CSS/MUI ---
const panelWrap = {
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 10,
  fontFamily: "system-ui, sans-serif",
};
const panel = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 10,
  padding: 16,
  width: 300,
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
};
const h3 = { margin: "0 0 2px", fontSize: 18 };
const sub = { margin: "8px 0 12px 0", fontSize: 13, color: "#0e0d0d" };
const tagLine = {
  margin: "0 0 14px",
  fontSize: 12,
  color: "#8a6d1f",
  fontWeight: 600,
};
const btn = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  margin: "6px 0",
  border: "1px solid #ddd",
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
};
const tag = { display: "block", fontSize: 11, color: "#8a6d1f", marginTop: 3 };
const backBtn = {
  border: "none",
  background: "none",
  color: "#2a6",
  cursor: "pointer",
  fontSize: 13,
  padding: 0,
  marginBottom: 8,
};
const label = {
  fontSize: 12,
  fontWeight: 600,
  color: "#444",
  margin: "14px 0 6px",
};
const dirRow = { display: "flex", flexWrap: "wrap", gap: 6 };
const dirBtn = {
  padding: "6px 10px",
  border: "1px solid #ccc",
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
};
const dirBtnActive = {
  ...dirBtn,
  background: "#2a6",
  color: "#fff",
  borderColor: "#2a6",
};
const slider = { width: "100%" };
const scaleRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 11,
  color: "#777",
  marginTop: 2,
};
