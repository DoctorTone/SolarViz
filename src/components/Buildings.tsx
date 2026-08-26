import { Box } from "@react-three/drei";
import useSolar from "../state/store";

const BARN_E = 508825;
const BARN_N = 360184;

function bngToWorld(easting, northing, meta) {
  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;
  return [
    easting - meta.origin_easting - halfW,
    meta.origin_northing - northing - halfD,
  ];
}

const Buildings = () => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);

  const [x, z] = bngToWorld(BARN_E, BARN_N, meta);
  const y = sampleHeight(BARN_E, BARN_N) ?? 0;

  return (
    <group>
      <Box args={[3, 3, 3]} position={[x, y, z]}>
        <meshStandardMaterial color="grey" />
      </Box>
    </group>
  );
};

export default Buildings;
