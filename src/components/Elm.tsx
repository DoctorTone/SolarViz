import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

const Elm = () => {
  const { scene, nodes, materials } = useGLTF("/models/elm1.glb");
  // DEBUG
  console.log("Mats = ", materials);

  useEffect(() => {
    const leafMat = materials.elm_leaf_1Mat;
    if (leafMat) {
      leafMat.alphaTest = 0.5; // the clip threshold — this is what you tune
      leafMat.transparent = false; // IMPORTANT: false = alpha CLIP (hard cutoff)
      leafMat.depthWrite = true;
      leafMat.needsUpdate = true;
    }
  }, [materials]);

  return <primitive object={scene} position={[-2100, 14, 330]} scale={2} />;
};

export default Elm;
