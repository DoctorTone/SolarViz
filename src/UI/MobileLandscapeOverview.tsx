import useSolar from "../state/store";

const MobileLandscapeOverview = () => {
  const enter = useSolar((s) => s.enterViewpoint);
  const viewpoints = useSolar((s) => s.viewpoints);
  const featured = viewpoints.filter((v) => [7, 2, 4].includes(v.no));

  return (
    <div style={sidePanel}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
        Springwell Solar Farm
      </div>
      {featured.map((vp) => (
        <button key={vp.no} onClick={() => enter(vp.no)} style={sideVpBtn}>
          <span style={{ fontWeight: 700 }}>VP{vp.no}</span>
          <span style={{ fontSize: 10 }}>{vp.shortDescription}</span>
        </button>
      ))}
    </div>
  );
};

const sidePanel = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  width: 150,
  background: "rgba(255,255,255,0.94)",
  padding:
    "calc(10px + env(safe-area-inset-top)) 10px 10px calc(10px + env(safe-area-inset-left))",
  boxShadow: "2px 0 12px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  overflowY: "auto",
  fontFamily: "system-ui, sans-serif",
};
const sideVpBtn = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  minHeight: 44,
  padding: "6px 8px",
  border: "1px solid #2a7d2a",
  borderRadius: 8,
  background: "#fff",
  color: "#2a7d2a",
  fontSize: 12,
  cursor: "pointer",
};

export default MobileLandscapeOverview;
