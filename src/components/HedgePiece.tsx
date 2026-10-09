import { useGLTF, Clone } from "@react-three/drei";

const HedgePiece = () => {
  const { scene, nodes, materials } = useGLTF("/models/hedgeRow.glb");
  console.log("Nodes = ", nodes);
  console.log("Mats = ", materials);
  return (
    <group>
      <Clone object={scene} position={[-1990, 14, 320]} />
    </group>
  );
};

export default HedgePiece;
