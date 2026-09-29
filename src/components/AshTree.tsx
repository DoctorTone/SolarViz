import { useGLTF } from "@react-three/drei";

const AshTree = () => {
  const { scene } = useGLTF("/models/ashTree.glb");

  return <primitive object={scene} position={[-2100, 14, 295]} scale={2.5} />;
};

export default AshTree;
