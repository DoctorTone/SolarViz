import { type CSSProperties } from "react";
import useSolar from "../state/store";

const DirectionButtons = () => {
  const vpId = useSolar((s) => s.activeViewpoint);
  const viewpoints = useSolar((s) => s.viewpoints);
  const dirIdx = useSolar((s) => s.activeDirection);
  const setDir = useSolar((s) => s.setDirection);

  const vp = vpId != null ? viewpoints.find((v) => v.no === vpId) : null;
  if (!vp) return null;

  return (
    <>
      <div style={label}>View direction</div>
      <div style={dirRow}>
        {vp.directions?.map((d, i) => (
          <button
            key={i}
            style={i === dirIdx ? dirBtnActive : dirBtn}
            onClick={() => setDir(i)}
          >
            {d.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default DirectionButtons;

const label: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#444",
  margin: "14px 0 6px",
};
const dirRow: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 6 };
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
