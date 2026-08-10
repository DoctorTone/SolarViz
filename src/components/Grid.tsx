import { Text } from "@react-three/drei";
import useSolar from "../state/store";

const LABEL_HEIGHT = 60;

const Grid = ({ spacing = 500 }) => {
  const meta = useSolar((s) => s.metaData);
  if (!meta) return null;

  const { origin_easting, origin_northing, cols, rows, cell_size_m } = meta;
  const east0 = origin_easting;
  const east1 = origin_easting + cols * cell_size_m;
  const north0 = origin_northing - rows * cell_size_m; // south edge
  const north1 = origin_northing; // north edge

  const halfW = (cols * cell_size_m) / 2;
  const halfD = (rows * cell_size_m) / 2;

  // BNG easting -> world X ; BNG northing -> world Z
  const eToX = (e) => e - origin_easting - halfW;
  const nToZ = (n) => origin_northing - n - halfD;

  const lines = [];
  const labels = [];

  // Vertical lines (constant easting)
  for (let e = Math.ceil(east0 / spacing) * spacing; e <= east1; e += spacing) {
    const x = eToX(e);
    lines.push(
      <line key={`e${e}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={
              new Float32Array([
                x,
                LABEL_HEIGHT,
                -halfD,
                x,
                LABEL_HEIGHT,
                halfD,
              ])
            }
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ffff" transparent opacity={0.5} />
      </line>,
    );
    labels.push(
      <Text
        key={`el${e}`}
        position={[x, LABEL_HEIGHT, halfD]}
        fontSize={40}
        color="#00ffff"
        anchorX="center"
      >
        {e}E
      </Text>,
    );
  }

  // Horizontal lines (constant northing)
  for (
    let n = Math.ceil(north0 / spacing) * spacing;
    n <= north1;
    n += spacing
  ) {
    const z = nToZ(n);
    lines.push(
      <line key={`n${n}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={
              new Float32Array([
                -halfW,
                LABEL_HEIGHT,
                z,
                halfW,
                LABEL_HEIGHT,
                z,
              ])
            }
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffaa00" transparent opacity={0.5} />
      </line>,
    );
    labels.push(
      <Text
        key={`nl${n}`}
        position={[-halfW, LABEL_HEIGHT, z]}
        fontSize={40}
        color="#ffaa00"
        anchorX="center"
      >
        {n}N
      </Text>,
    );
  }

  return (
    <group>
      {lines}
      {labels}
    </group>
  );
};

export default Grid;
