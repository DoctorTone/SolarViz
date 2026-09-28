import useSolar from "../state/store";
import ViewpointOverview from "./ViewpointOverview";
import ViewpointView from "./ViewpointView";

export default function ViewpointUI() {
  const mode = useSolar((s) => s.viewMode);

  return <>{mode === "overview" ? <ViewpointOverview /> : <ViewpointView />}</>;
}
