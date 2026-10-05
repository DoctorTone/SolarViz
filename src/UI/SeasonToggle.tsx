import { label, dirRow, dirBtnActive, dirBtn } from "../css/UIStyles";
import useSolar from "../state/store";

const SeasonToggle = () => {
  const season = useSolar((s) => s.currentSeason);
  const setSeason = useSolar((s) => s.setCurrentSeason);

  return (
    <>
      <div style={label}>Season</div>
      <div style={dirRow}>
        <button
          style={season === "summer" ? dirBtnActive : dirBtn}
          onClick={() => setSeason("summer")}
        >
          Summer
        </button>
        <button
          style={season === "winter" ? dirBtnActive : dirBtn}
          onClick={() => setSeason("winter")}
        >
          Winter (leaf-off)
        </button>
      </div>
    </>
  );
};

export default SeasonToggle;
