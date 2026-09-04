import useSolar from "../state/store";
import MobileViewpointBar from "./MobileViewpointBar";
import MobileOverviewPanel from "./MobileOverviewPanel";

const MobileViewpointUI = () => {
  const mode = useSolar((s) => s.viewMode);

  return (
    <>
      {mode === "overview" ? <MobileOverviewPanel /> : <MobileViewpointBar />}
    </>
  );
};

export default MobileViewpointUI;
