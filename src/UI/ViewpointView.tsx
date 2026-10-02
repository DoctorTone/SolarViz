import { type CSSProperties } from "react";
import useSolar from "../state/store";
import StageControl from "./StageControl";
import RoamToggle from "./RoamToggle";
import ViewpointHeader from "./ViewpointHeader";
import DirectionButtons from "./DirectionButtons";
import YearSlider from "./YearSlider";
import SeasonToggle from "./SeasonToggle";

const ViewpointView = () => {
  const vpId = useSolar((s) => s.activeViewpoint);
  const viewpoints = useSolar((s) => s.viewpoints);

  const uiHidden = useSolar((s) => s.uiHidden);
  const roamMode = useSolar((s) => s.roamMode);

  const vp = vpId != null ? viewpoints.find((v) => v.no === vpId) : null;
  if (!vp) return null;

  if (uiHidden) return null;

  return (
    <>
      <RoamToggle />
      {roamMode === "fixed" ? (
        <div style={panelWrap}>
          <div style={panel}>
            <ViewpointHeader />
            <StageControl />
            <DirectionButtons />
            <YearSlider />
            <SeasonToggle />
          </div>
        </div>
      ) : (
        <div style={hint}>Click a marker to move · drag to look around</div>
      )}
    </>
  );
};

export default ViewpointView;

// CSS styling
const panelWrap: CSSProperties = {
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 10,
  fontFamily: "system-ui, sans-serif",
};
const panel: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 10,
  padding: 16,
  width: 300,
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
};
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
const label: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#444",
  margin: "14px 0 6px",
};

const dirBtn: CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #ccc",
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
};
const dirBtnActive: CSSProperties = {
  ...dirBtn,
  background: "#2a6",
  color: "#fff",
  borderColor: "#2a6",
};

const hint = {
  fontSize: 12,
  color: "#666",
  fontStyle: "italic",
  textAlign: "center",
  padding: "8px 4px",
  lineHeight: 1.4,
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};
