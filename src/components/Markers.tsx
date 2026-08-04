import useSolar from "../state/store";
import { bngToWorld } from "../Utils/utils";

const Markers = () => {
  const viewpoints = useSolar((state) => state.viewpoints);
  const metaData = useSolar((state) => state.metaData);
  const heights = useSolar((state) => state.heights);

  return (
    <>
      {viewpoints.map((vp) => {
        const p = bngToWorld(vp.easting, vp.northing, metaData, heights);
        return (
          <mesh key={vp.no} position={[p.worldX, p.worldY + 4, p.worldZ]}>
            <sphereGeometry args={[12, 16, 16]} />
            <meshStandardMaterial color="#ff3333" />
          </mesh>
        );
      })}
    </>
  );
};

export default Markers;
