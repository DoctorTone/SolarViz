import { useGLTF } from "@react-three/drei";

const HedgePiece = () => {
  const { scene } = useGLTF("./models/hedge.glb");

  return <primitive object={scene} position={[-1500, 0, 0]} />;
};

export default HedgePiece;
