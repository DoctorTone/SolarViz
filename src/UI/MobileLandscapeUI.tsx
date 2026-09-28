import useSolar from "../state/store";
import MobileLandscapeOverview from "./MobileLandscapeOverview";
import MobileLandscapeViewpoint from "./MobileLandscapeViewpoint";

const MobileLandscapeUI = () => {
  const mode = useSolar((s) => s.viewMode);

  return (
    <>
      {mode === "overview" ? (
        <MobileLandscapeOverview />
      ) : (
        <MobileLandscapeViewpoint />
      )}
    </>
  );
};

export default MobileLandscapeUI;
