import { backBtn, h3, sub, tagLine } from "../css/UIStyles";
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
