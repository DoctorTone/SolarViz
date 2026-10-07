import useSolar from "../state/store";
import Marker from "./Marker";

const WaypointMarkers = () => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const viewpoints = useSolar((s) => s.viewpoints);
  const activeVP = useSolar((s) => s.activeViewpoint);
  const activeWP = useSolar((s) => s.activeWaypoint);
  const setWaypoint = useSolar((s) => s.setWaypoint);
  const mode = useSolar((s) => s.viewMode);
  const roamMode = useSolar((s) => s.roamMode);

  if (!meta || mode !== "viewpoint" || roamMode !== "freeroam") return null;

  const vp = viewpoints.find((v) => v.no === activeVP);
  if (!vp?.waypoints) return null;

  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;

  return (
    <group>
      {vp.waypoints.map((wp, i) => {
        if (i === activeWP) return null; // don't show marker for where you already are
        const x = wp.easting - meta.origin_easting - halfW;
        const z = meta.origin_northing - wp.northing - halfD;
        const y = (sampleHeight(wp.easting, wp.northing) ?? 0) + 0.1;

        return (
          <Marker key={i} position={[x, y, z]} onClick={() => setWaypoint(i)} />
        );
      })}
    </group>
  );
};

export default WaypointMarkers;
