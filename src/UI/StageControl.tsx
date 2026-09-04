import useSolar from "../state/store";

const STAGES = [
  { key: "baseline", label: "Before", panels: false, year: 0 },
  { key: "built", label: "As built", panels: true, year: 1 },
  { key: "grown", label: "Year 10", panels: true, year: 10 },
];

const StageControl = () => {
  const developmentVisible = useSolar((s) => s.developmentVisible);
  const stage = useSolar((s) => s.stage); // 'baseline' | 'built' | 'grown'
  const setStage = useSolar((s) => s.setStage);
  const year = useSolar((s) => s.currentYear);

  // derive active stage — no stored state, always correct
  let active = null;
  if (!developmentVisible) active = "baseline";
  else if (year === 1) active = "built";
  else if (year === 10) active = "grown";
  // else: development visible at a custom year → active stays null

  return (
    <div style={seg}>
      {STAGES.map((s) => (
        <button
          key={s.key}
          style={active === s.key ? segActive : segBtn}
          onClick={() => setStage(s.key)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

export default StageControl;

const seg = {
  display: "flex",
  border: "1px solid #2a7d2a",
  borderRadius: 8,
  overflow: "hidden",
  margin: "4px 0 12px",
};
const segBtn = {
  flex: 1,
  padding: "10px 8px",
  border: "none",
  borderRight: "1px solid #2a7d2a",
  background: "#fff",
  color: "#2a7d2a",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};
const segActive = { ...segBtn, background: "#2a7d2a", color: "#fff" };
