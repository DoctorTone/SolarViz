import { useGLTF, Clone } from "@react-three/drei";

const HedgePiece = () => {
  const { scene, nodes, materials } = useGLTF("/models/hedgePiece.glb");
  console.log("Nodes = ", nodes);
  console.log("Mats = ", materials);
  return (
    <group>
      <Clone object={scene} position={[-1980, 14, 300]} />
      <Clone object={scene} position={[-1990, 14, 300]} />
    </group>
  );
};

export default HedgePiece;
