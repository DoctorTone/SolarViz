import useSolar from "../state/store";
import ViewpointMarker from "./ViewpointMarker";

const ViewpointMarkers = () => {
  const viewpoints = useSolar((state) => state.viewpoints);
  const featured = viewpoints.filter((v) => [7, 2, 4].includes(v.no));

  return featured.map((vp) => <ViewpointMarker key={vp.no} vp={vp} />);
};

export default ViewpointMarkers;
