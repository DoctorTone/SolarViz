import { useEffect } from "react";
import { useGLTF, Clone } from "@react-three/drei";
import { Color } from "three";
import useSolar from "../state/store";

const Elm = () => {
  const { scene, materials } = useGLTF("/models/elm1.glb");
  const season = useSolar((s) => s.currentSeason);

  useEffect(() => {
    const leafMat = materials.elm_leaf_1Mat;
    if (leafMat) {
      leafMat.alphaTest = season === "winter" ? 0.6 : 0.15;
      leafMat.transparent = false;
      leafMat.depthWrite = true;
      leafMat.color =
        season === "winter"
          ? new Color("#9a7b4f") // brown/tan for winter
          : new Color("#8d8b8b"); // white = untinted (natural texture) for summer
      leafMat.needsUpdate = true;
    }
  }, [materials, season]);

  return (
    <group>
      <Clone object={scene} position={[-2000, 14, 320]} scale={1} />
    </group>
  );
};

export default Elm;
