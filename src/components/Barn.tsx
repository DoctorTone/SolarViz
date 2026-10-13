import { useMemo } from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import useSolar from "../state/store";
import { bngToWorld } from "../Utils/utils";

const BARN_E = 508825;
const BARN_N = 360183;
const BARN_WIDTH = 12;
const BARN_HEIGHT = 7;

const Barn = () => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);

  if (!meta) return null;

  const [x, z] = bngToWorld(BARN_E, BARN_N, meta);
  const y = sampleHeight(BARN_E, BARN_N) ?? 0;

  const barnX = 1;
  const wallTopY = 6.75;
  const barnZ = 0;
  const barnYaw = 0.31;

  const roof = useMemo(() => {
    const W = 7; // barn width (gable span)
    const H = 6; // roof rise (ridge height above the walls) — controls the pitch
    const L = 12.5; // barn length (ridge runs this way)

    const s = new THREE.Shape();
    s.moveTo(-W / 2, 0);
    s.lineTo(W / 2, 0);
    s.lineTo(0, H); // apex / ridge
    s.closePath();

    const g = new THREE.ExtrudeGeometry(s, { depth: L, bevelEnabled: false });
    g.translate(0, 0, -L / 2); // centre the length so it sits symmetrically
    return g;
  }, []);

  return (
    <group position={[x, y, z]}>
      <Box
        args={[BARN_WIDTH, BARN_HEIGHT, 6]}
        rotation-y={1.9}
        position={[1, BARN_HEIGHT / 2, 0]}
      >
        <meshStandardMaterial color="grey" />
      </Box>
      <mesh
        geometry={roof}
        position={[barnX, wallTopY, barnZ]}
        rotation={[0, barnYaw, 0]}
      >
        <meshStandardMaterial color="#666464" roughness={1} />
      </mesh>
    </group>
  );
};

export default Barn;
