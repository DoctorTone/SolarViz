import { exploreBar, exitBtn, hint } from "../css/UIStyles";
import SeasonToggle from "./SeasonToggle";
import YearSlider from "./YearSlider";
import useSolar from "../state/store";

const ExplorePanel = () => {
  const setRoamMode = useSolar((s) => s.setRoamMode);

  return (
    <div style={exploreBar}>
      <button style={exitBtn} onClick={() => setRoamMode("fixed")}>
        ← Assessed views
      </button>
      <SeasonToggle />
      <YearSlider />
      <span style={hint}>Click a marker to move · drag to look</span>
    </div>
  );
};

export default ExplorePanel;
