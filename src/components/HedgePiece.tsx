import { useGLTF, Clone } from "@react-three/drei";

const HedgePiece = () => {
  const { scene } = useGLTF("/models/hedgePiece.glb");
  return (
    <group>
      <Clone object={scene} position={[-1980, 14, 300]} />
      <Clone object={scene} position={[-1990, 14, 300]} />
    </group>
  );
};

export default HedgePiece;
