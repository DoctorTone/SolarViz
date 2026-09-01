import { Billboard, Text } from "@react-three/drei";
import { useState } from "react";
import useSolar from "../state/store";

const ViewpointMarker = ({ vp }) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const enter = useSolar((s) => s.enterViewpoint);
  const mode = useSolar((s) => s.viewMode);
  const [hovered, setHovered] = useState(false);

  if (!meta || mode !== "overview") return null; // only show in overview

  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;
  const x = vp.easting - meta.origin_easting - halfW;
  const z = meta.origin_northing - vp.northing - halfD;
  const groundY = sampleHeight(vp.easting, vp.northing) ?? 0;

  // marker floats above the ground so it's readable over terrain/hedges
  const markerY = groundY + 60;

  return (
    <group position={[x, markerY, z]}>
      {/* Billboarded number label */}
      <Billboard>
        <Text
          fontSize={40}
          color="#ffffff"
          outlineWidth={3}
          outlineColor="#1a3a1a"
          anchorX="center"
          anchorY="middle"
        >
          VP{vp.no}
        </Text>
      </Billboard>

      {/* Clickable filled triangle pointing down at the location */}
      <mesh
        position={[0, -35, 0]}
        rotation={[Math.PI, 0, 0]} /* point tip downward */
        onClick={(e) => {
          e.stopPropagation();
          enter(vp.no);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* cone with 3 radial segments = a pyramid/triangle marker */}
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#d43e4a" : "orange"} />
      </mesh>
    </group>
  );
};

export default ViewpointMarker;
