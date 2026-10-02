import { label, slider, scaleRow } from "../css/UIStyles";
import useSolar from "../state/store";

const YearSlider = () => {
  const year = useSolar((s) => s.currentYear);
  const developmentVisible = useSolar((s) => s.developmentVisible);
  const setYear = useSolar((s) => s.setCurrentYear);

  return (
    <>
      <div style={label}>Year: {year}</div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        disabled={!developmentVisible}
        value={year}
        onChange={(e) => setYear(+e.target.value)}
        style={{ ...slider, opacity: developmentVisible ? 1 : 0.4 }}
      />
      <div style={scaleRow}>
        <span>Planting</span>
        <span>Established</span>
      </div>
    </>
  );
};

export default YearSlider;
