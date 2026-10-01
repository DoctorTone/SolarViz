import { useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Color, InstancedMesh, Object3D } from "three";
import useSolar from "../state/store";
import { bngToWorld } from "../Utils/utils";

function rand(seed: number) {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

type Tree = {
  easting: number;
  northing: number;
  existing: boolean;
  mature_height: number;
  start_height?: number;
  years_to_mature?: number;
};

type TreesProps = {
  trees: Tree[];
  season: "summer" | "winter";
};

const Trees = ({ trees, season }: TreesProps) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const year = useSolar((s) => s.currentYear);
  const canopyRef = useRef<InstancedMesh>(null);
  const trunkRef = useRef<InstancedMesh>(null);
  const leafRef = useRef();

  const { nodes, materials } = useGLTF("/models/elm1.glb");

  const trunkGeo = nodes.Trunk.geometry;
  const leafGeo = nodes.Leaves.geometry;
  const trunkMat = materials.bark07_0Mat;
  const leafMat = materials.elm_leaf_1Mat;

  useEffect(() => {
    if (!leafMat) return;

    leafMat.alphaTest = season === "winter" ? 0.6 : 0.15;
    leafMat.transparent = false;
    leafMat.depthWrite = true;
    leafMat.color =
      season === "winter"
        ? new Color("#9a7b4f") // brown/tan for winter
        : new Color("#8d8b8b"); // white = untinted (natural texture) for summer
    leafMat.needsUpdate = true;
  }, [leafMat, season]);

  // build per-instance transforms
  const instances = useMemo(() => {
    if (!meta) return [];
    return trees.map((t, i) => {
      const [x, z] = bngToWorld(t.easting, t.northing, meta);
      const y = sampleHeight(t.easting, t.northing) ?? 0;
      const scale = (t.scale ?? 1) * (0.8 + rand(i * 3.7) * 0.4); // ±20% size variation
      const yaw = rand(i * 1.3) * Math.PI * 2; // free random rotation
      return { x, y, z, scale, yaw };
    });
  }, [trees, meta, sampleHeight]);

  const count = instances.length;

  useLayoutEffect(() => {
    if (!trunkRef.current || !leafRef.current || !count) return;
    const dummy = new Object3D();
    instances.forEach((inst, i) => {
      dummy.position.set(inst.x, inst.y, inst.z);
      dummy.rotation.set(0, inst.yaw, 0);
      dummy.scale.setScalar(inst.scale);
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(i, dummy.matrix);
      leafRef.current.setMatrixAt(i, dummy.matrix); // same transform for both
    });
    trunkRef.current.instanceMatrix.needsUpdate = true;
    leafRef.current.instanceMatrix.needsUpdate = true;
  }, [instances, count]);

  if (!count) return null;

  return (
    <group>
      <instancedMesh
        ref={trunkRef}
        args={[trunkGeo, trunkMat, count]}
        key={`t${count}`}
      />
      <instancedMesh
        ref={leafRef}
        args={[leafGeo, leafMat, count]}
        key={`l${count}`}
      />
    </group>
  );
};

export default Trees;
