import useSolar from "../state/store";
import { bar, vpBtn } from "../css/UIStyles";
import MobileTopBar from "./MobileTopBar";
import { useReportBottomInset } from "../hooks/useReportBottomInset";

const MobileOverviewPanel = () => {
  const enter = useSolar((s) => s.enterViewpoint);
  const viewpoints = useSolar((s) => s.viewpoints);
  const barRef = useReportBottomInset<HTMLDivElement>();

  const featured = viewpoints.filter((v) => [7, 2, 4].includes(v.no));

  return (
    <>
      <MobileTopBar />
      <div ref={barRef} style={bar}>
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

export default MobileOverviewPanel;
