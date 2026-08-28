import useSolar from "../state/store";

// viewpoint metadata for labels + directions (mirror your camera controller data)
const VP_INFO = {
  7: {
    name: "Permissive path, Scop/1134/1",
    impact: "Large impact (Year 1)",
    directions: ["SE — toward development", "SW", "NW", "NE"],
  },
  2: {
    name: "Junction of Bln/4/3, Bln/4/2 & Bln/738/1",
    impact: "Medium impact (Year 1)",
    directions: ["Toward development"], // fill your real directions
  },
  4: {
    name: "Scop/7/2 at junction with Scop/7/1",
    impact: "Medium impact (Year 1)",
    directions: ["Toward development"],
  },
};

const VP_ORDER = [7, 2, 4];

export default function ViewpointUI() {
  const mode = useSolar((s) => s.viewMode);
  const vpId = useSolar((s) => s.activeViewpoint);
  const dirIdx = useSolar((s) => s.activeDirection);
  const year = useSolar((s) => s.currentYear);
  const season = useSolar((s) => s.currentSeason);

  const enter = useSolar((s) => s.enterViewpoint);
  const exit = useSolar((s) => s.exitToOverview);
  const setDir = useSolar((s) => s.setDirection);
  const setYear = useSolar((s) => s.setCurrentYear);
  const setSeason = useSolar((s) => s.setCurrentSeason);

  return (
    <div style={panelWrap}>
      {mode === "overview" ? (
        <div style={panel}>
          <h3 style={h3}>Springwell Solar Farm</h3>
          <p style={sub}>Select a viewpoint to assess</p>
          {VP_ORDER.map((id) => (
            <button key={id} style={btn} onClick={() => enter(id)}>
              <strong>VP{id}</strong> — {VP_INFO[id].name}
              <span style={tag}>{VP_INFO[id].impact}</span>
            </button>
          ))}
        </div>
      ) : (
        <div style={panel}>
          <button style={backBtn} onClick={exit}>
            ← Overview
          </button>
          <h3 style={h3}>VP{vpId}</h3>
          <p style={sub}>{VP_INFO[vpId].name}</p>
          <p style={tagLine}>{VP_INFO[vpId].impact}</p>

          <div style={label}>View direction</div>
          <div style={dirRow}>
            {VP_INFO[vpId].directions.map((d, i) => (
              <button
                key={i}
                style={i === dirIdx ? dirBtnActive : dirBtn}
                onClick={() => setDir(i)}
              >
                {d}
              </button>
            ))}
          </div>

          <div style={label}>Year: {year}</div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            style={slider}
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
      )}
    </div>
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
const sub = { margin: "0 0 12px", fontSize: 13, color: "#555" };
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
