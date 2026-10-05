import useSolar from "../state/store";
import StageControl from "./StageControl";
import { useMediaQuery } from "@mui/material";
import { panelWrap, panel } from "../css/UIStyles";
import RoamToggle from "./RoamToggle";
import ViewpointHeader from "./ViewpointHeader";
import DirectionButtons from "./DirectionButtons";
import YearSlider from "./YearSlider";
import SeasonToggle from "./SeasonToggle";
import RoamHint from "./RoamHint";

const ViewpointView = () => {
  const canRoam = useMediaQuery("(pointer: fine)");
  const roamMode = useSolar((s) => s.roamMode);
  const uiHidden = useSolar((s) => s.uiHidden);

  if (uiHidden) return null;

  return (
    <div style={panelWrap}>
      <div style={panel}>
        <ViewpointHeader />
        {canRoam && <RoamToggle />}
        {roamMode === "fixed" ? <DirectionButtons /> : <RoamHint />}
        <StageControl />
        <DirectionButtons />
        <YearSlider />
        <SeasonToggle />
      </div>
    </div>
  );
};

export default ViewpointView;
