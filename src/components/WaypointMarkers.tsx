import { useMemo } from "react";
import useSolar from "../state/store";
import Marker from "./Marker";
import * as THREE from "three";

const R = 0.42; // head radius (world metres) — smaller than the old dot
const CY = R * 1.6; // tip-to-head-centre distance

const WaypointMarkers = () => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const viewpoints = useSolar((s) => s.viewpoints);
  const activeVP = useSolar((s) => s.activeViewpoint);
  const activeWP = useSolar((s) => s.activeWaypoint);
  const setWaypoint = useSolar((s) => s.setWaypoint);
  const mode = useSolar((s) => s.viewMode);
  const roamMode = useSolar((s) => s.roamMode);

  // one shared pin geometry for all markers
  const pinGeo = useMemo(() => new THREE.ShapeGeometry(makePinShape(), 24), []);

  if (!meta || mode !== "viewpoint" || roamMode !== "freeroam") return null;

  // teardrop: tip at local (0,0), head centred at (0, CY) — tip sits at the Billboard pivot
  function makePinShape() {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(R * 0.2, CY * 0.35, R, CY * 0.55, R, CY); // right side
    s.absarc(0, CY, R, 0, Math.PI, false); // arc over the top
    s.bezierCurveTo(-R, CY * 0.55, -R * 0.2, CY * 0.35, 0, 0); // left side back to tip
    return s;
  }

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
          <Marker
            key={i}
            position={[x, y, z]}
            pinGeo={pinGeo}
            onClick={() => setWaypoint(i)}
          />
        );
      })}
    </group>
  );
};

export default WaypointMarkers;
