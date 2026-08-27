import { Box } from "@react-three/drei";
import * as THREE from "three";
import useSolar from "../state/store";
import { bngToWorld } from "../Utils/utils";

const BARN_E = 508825;
const BARN_N = 360175;
const BARN_WIDTH = 12;
const BARN_HEIGHT = 7;

const Barn = () => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);

  const [x, z] = bngToWorld(BARN_E, BARN_N, meta);
  const y = sampleHeight(BARN_E, BARN_N) ?? 0;

  return (
    <group position={[x, y, z]}>
      <Box
        args={[BARN_WIDTH, BARN_HEIGHT, 6]}
        rotation-y={1.7}
        position={[1, BARN_HEIGHT / 2, 0]}
      >
        <meshStandardMaterial color="grey" />
      </Box>
      <mesh
        position={[-1.5, 9.75, 0.475]}
        rotation={[Math.PI / 12, 1.7, 0, "YXZ"]}
      >
        <planeGeometry args={[BARN_WIDTH, 7]} />
        <meshStandardMaterial
          color="#646160"
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>
    </group>
  );
};

export default Barn;
