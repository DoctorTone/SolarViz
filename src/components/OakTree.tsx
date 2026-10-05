import { useGLTF } from "@react-three/drei";

const OakTree = () => {
  const { scene } = useGLTF("/models/oakTree.glb");

  return <primitive object={scene} position={[-2100, 14, 325]} scale={1.5} />;
};

export default OakTree;
