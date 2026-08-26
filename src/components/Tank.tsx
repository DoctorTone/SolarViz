import { Box } from "@react-three/drei";
import * as THREE from "three";
import useSolar from "../state/store";
import { bngToWorld } from "../Utils/utils";

const TANK_E = 508769;
const TANK_N = 360195;
const TANK_WIDTH = 8;
const TANK_HEIGHT = 5;
const TANK_DEPTH = 5;

const Tank = () => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);

  const [x, z] = bngToWorld(TANK_E, TANK_N, meta);
  const y = sampleHeight(TANK_E, TANK_N) ?? 0;

  return (
    <group position={[x, y, z]}>
      <Box
        args={[TANK_WIDTH, TANK_HEIGHT, TANK_DEPTH]}
        position={[0, TANK_HEIGHT / 2, 0]}
        rotation-y={Math.PI / 10}
      >
        <meshStandardMaterial color="#a06a6a" flatShading />
      </Box>
    </group>
  );
};

export default Tank;
