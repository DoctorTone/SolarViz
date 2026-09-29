import { useGLTF } from "@react-three/drei";

const FirTree = () => {
  const { scene } = useGLTF("/models/firTree.glb");

  return <primitive object={scene} position={[-1790, 14, 250]} scale={1.3} />;
};

export default FirTree;
