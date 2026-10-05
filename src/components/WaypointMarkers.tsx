import * as THREE from "three";
import useSolar from "../state/store";

const WaypointMarkers = () => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const viewpoints = useSolar((s) => s.viewpoints);
  const activeVP = useSolar((s) => s.activeViewpoint);
  const activeWP = useSolar((s) => s.activeWaypoint);
  const setWaypoint = useSolar((s) => s.setWaypoint);
  const mode = useSolar((s) => s.viewMode);

  if (!meta || mode !== "viewpoint") return null;

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
          <mesh
            key={i}
            position={[x, y, z]}
            rotation={[-Math.PI / 2, 0, 0]} // lay flat on ground
            onClick={(e) => {
              e.stopPropagation();
              setWaypoint(i);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <ringGeometry args={[1.2, 1.8, 24]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default WaypointMarkers;
