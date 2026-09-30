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
          : new Color("#ffffff"); // white = untinted (natural texture) for summer
      leafMat.needsUpdate = true;
    }
  }, [materials, season]);

  return (
    <group>
      <Clone object={scene} position={[-2100, 14, 320]} scale={2} />
      <Clone object={scene} position={[-2100, 14, 322]} scale={2.5} />
      <Clone object={scene} position={[-2100, 14, 324]} scale={1.87} />
      <Clone object={scene} position={[-2100, 14, 326]} scale={2} />
      <Clone object={scene} position={[-2100, 14, 328]} scale={2.5} />
    </group>
  );
};

export default Elm;
