import useSolar from "../state/store";

const STAGES = [
  { key: "baseline", label: "Before" },
  { key: "built", label: "As built" },
  { key: "grown", label: "Year 10" },
];

const MobileLandscapeViewpoint = () => {
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

  const vp = viewpoints.find((v) => v.no === vpId);

  // derive active stage for highlight (no stored state — always correct)
  let activeStage = null;
  if (!developmentVisible) activeStage = "baseline";
  else if (year === 1) activeStage = "built";
  else if (year === 10) activeStage = "grown";

  return (
    <div style={sidePanel}>
      {/* back */}
      <button onClick={exit} aria-label="Back to overview" style={backBtn}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>&#8592;</span>
        <span>Overview</span>
      </button>

      {/* identity */}
      <div style={{ marginBottom: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
          VP{vp.no}
        </div>
        <div style={{ fontSize: 10, color: "#666", lineHeight: 1.2 }}>
          {vp.name}
        </div>
      </div>

      {/* stage — stacked vertically to fit the narrow panel */}
      <div style={group}>
        <div style={label}>Stage</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {STAGES.map((s) => (
            <button
              key={s.key}
              style={activeStage === s.key ? stageActive : stageBtn}
              onClick={() => setStage(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* direction — compact wrapping grid of 2-letter buttons */}
      {vp.directions?.length > 1 && (
        <div style={group}>
          <div style={label}>View</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
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
        </div>
      )}

      {/* year slider */}
      <div style={group}>
        <div style={label}>Year {developmentVisible ? year : "—"}</div>
        <input
          type="range"
          min={1}
          max={10}
          value={year}
          disabled={!developmentVisible}
          onChange={(e) => setYear(+e.target.value)}
          style={{ width: "100%", opacity: developmentVisible ? 1 : 0.4 }}
        />
      </div>

      {/* season */}
      <div style={group}>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            style={season === "summer" ? seasonActive : seasonBtn}
            onClick={() => setSeason("summer")}
          >
            Summer
          </button>
          <button
            style={season === "winter" ? seasonActive : seasonBtn}
            onClick={() => setSeason("winter")}
          >
            Winter
          </button>
        </div>
      </div>
    </div>
  );
};

const sidePanel = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  width: 160,
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.95)",
  padding:
    "calc(10px + env(safe-area-inset-top)) 10px 10px calc(10px + env(safe-area-inset-left))",
  boxShadow: "2px 0 14px rgba(0,0,0,0.14)",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  overflowY: "auto", // scrolls internally if controls exceed the short height
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  zIndex: 15,
};

const backBtn = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  minHeight: 36,
  padding: 0,
  border: "none",
  background: "none",
  color: "#2a7d2a",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  flexShrink: 0,
};

const group = { display: "flex", flexDirection: "column", gap: 4 };

const label = {
  fontSize: 10,
  fontWeight: 600,
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: 0.3,
};

const stageBtn = {
  minHeight: 34,
  border: "1px solid #2a7d2a",
  borderRadius: 6,
  background: "#fff",
  color: "#2a7d2a",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
const stageActive = { ...stageBtn, background: "#2a7d2a", color: "#fff" };

const dir = {
  minWidth: 40,
  minHeight: 36,
  border: "1px solid #ccc",
  borderRadius: 6,
  background: "#fff",
  color: "#333",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
const dirActive = {
  ...dir,
  background: "#2a7d2a",
  color: "#fff",
  borderColor: "#2a7d2a",
};

const seasonBtn = {
  flex: 1,
  minHeight: 32,
  border: "1px solid #ccc",
  borderRadius: 6,
  background: "#fff",
  color: "#333",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
};
const seasonActive = {
  ...seasonBtn,
  background: "#2a7d2a",
  color: "#fff",
  borderColor: "#2a7d2a",
};

export default MobileLandscapeViewpoint;
