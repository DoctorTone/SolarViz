import useSolar from "../state/store";

const ViewpointOverview = () => {
  const viewpoints = useSolar((s) => s.viewpoints);
  const enter = useSolar((s) => s.enterViewpoint);

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
          An interactive visualisation of the consented scheme in Lincolnshire.
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
};

export default ViewpointOverview;

// CSS styling
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
const sub = { margin: "8px 0 12px 0", fontSize: 13, color: "#0e0d0d" };
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
