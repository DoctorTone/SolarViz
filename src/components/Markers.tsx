import useSolar from "../state/store";
import { bngMarkersToWorld } from "../Utils/utils";
import { Text } from "@react-three/drei";

const Markers = () => {
  const viewpoints = useSolar((state) => state.viewpoints);
  const metaData = useSolar((state) => state.metaData);
  const heights = useSolar((state) => state.heights);

  return (
    <>
      {viewpoints.map((vp) => {
        const p = bngMarkersToWorld(vp.easting, vp.northing, metaData, heights);
        return (
          <>
            <mesh key={vp.no} position={[p.worldX, p.worldY + 4, p.worldZ]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#ff3333" />
            </mesh>
            <Text
              key={`Label${vp.no}`}
              position={[p.worldX, p.worldY + 60, p.worldZ]}
              fontSize={40}
              color="#000000"
              anchorX="center"
            >
              {vp.no}
            </Text>
          </>
        );
      })}
    </>
  );
};

export default Markers;
