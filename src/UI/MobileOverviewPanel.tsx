import useSolar from "../state/store";
import MobileTopBar from "./MobileTopBar";

const MobileOverviewPanel = () => {
  const enter = useSolar((s) => s.enterViewpoint);
  const viewpoints = useSolar((s) => s.viewpoints);

  const featured = viewpoints.filter((v) => [7, 2, 4].includes(v.no));

  return (
    <>
      <MobileTopBar />
      <div style={bar}>
        {/* title + orienting line */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
            Select a viewpoint to explore
          </div>
        </div>

        {/* three compact viewpoint buttons in a row */}
        <div style={{ display: "flex", gap: 8 }}>
          {featured.map((vp) => (
            <button key={vp.no} onClick={() => enter(vp.no)} style={vpBtn}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>VP{vp.no}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 400,
                  color: "#4a6a3a",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {vp.shortDescription}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

// CSS styling
const bar = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "rgba(255,255,255,0.95)",
  padding: "12px 12px calc(12px + env(safe-area-inset-bottom))",
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  boxShadow: "0 -2px 14px rgba(0,0,0,0.14)",
  fontFamily: "system-ui, sans-serif",
  zIndex: 10,
};

const vpBtn = {
  flex: 1,
  minHeight: 60,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  padding: "8px 6px",
  border: "1px solid #2a7d2a",
  borderRadius: 10,
  background: "#fff",
  color: "#2a7d2a",
  cursor: "pointer",
};

export default MobileOverviewPanel;
