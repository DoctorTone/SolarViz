import { useGLTF } from "@react-three/drei";

const Model = () => {
  const { scene } = useGLTF("./models/suzanne.gltf");

  return <primitive object={scene} />;
};

export default Model;
