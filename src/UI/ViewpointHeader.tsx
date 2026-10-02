import { type CSSProperties } from "react";
import useSolar from "../state/store";

const ViewpointHeader = () => {
  const exit = useSolar((s) => s.exitToOverview);
  const vpId = useSolar((s) => s.activeViewpoint);
  const viewpoints = useSolar((s) => s.viewpoints);
  const year = useSolar((s) => s.currentYear);

  const vp = vpId != null ? viewpoints.find((v) => v.no === vpId) : null;
  if (!vp) return null;

  const impact = year <= 5 ? vp.impactY1 : vp.impactY10;
  const phase = year <= 5 ? "Year 1" : "Year 10";

  return (
    <div>
      <button style={backBtn} onClick={exit}>
        ← Overview
      </button>
      <h3 style={h3}>VP{vpId}</h3>
      <p style={sub}>{vp.name}</p>
      <p style={tagLine}>
        Assessed visual impact ({phase}): <strong>{impact}</strong>
      </p>
    </div>
  );
};

export default ViewpointHeader;

const backBtn: CSSProperties = {
  border: "none",
  background: "none",
  color: "#2a6",
  cursor: "pointer",
  fontSize: 13,
  padding: 0,
  marginBottom: 8,
};
const h3: CSSProperties = { margin: "0 0 2px", fontSize: 18 };
const sub: CSSProperties = {
  margin: "8px 0 12px 0",
  fontSize: 13,
  color: "#0e0d0d",
};
const tagLine: CSSProperties = {
  margin: "0 0 14px",
  fontSize: 12,
  color: "#8a6d1f",
  fontWeight: 600,
};
