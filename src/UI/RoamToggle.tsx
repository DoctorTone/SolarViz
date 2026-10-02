import useSolar from "../state/store";

const RoamToggle = () => {
  const roamMode = useSolar((s) => s.roamMode);
  const setRoamMode = useSolar((s) => s.setRoamMode);

  return (
    <div style={segRow}>
      <button
        style={roamMode === "fixed" ? segActive : seg}
        onClick={() => setRoamMode("fixed")}
      >
        Assessed views
      </button>
      <button
        style={roamMode === "freeroam" ? segActive : seg}
        onClick={() => setRoamMode("freeroam")}
      >
        Explore
      </button>
    </div>
  );
};

const segRow = {
  display: "flex",
  gap: 0,
  margin: "8px 0",
  border: "1px solid #2a7d2a",
  borderRadius: 8,
  overflow: "hidden",
};

const seg = {
  flex: 1,
  minHeight: 40,
  padding: "8px 12px",
  border: "none",
  borderRight: "1px solid #2a7d2a",
  background: "#fff",
  color: "#2a7d2a",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

const segActive = {
  ...seg,
  background: "#2a7d2a",
  color: "#fff",
};

export default RoamToggle;
