import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import useSolar from "../state/store";

function bngToWorld(e, n, meta) {
  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;
  return [e - meta.origin_easting - halfW, meta.origin_northing - n - halfD];
}

function rand(seed) {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

const Trees = ({ trees, season }) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const year = useSolar((s) => s.currentYear);
  const canopyRef = useRef(null);
  const trunkRef = useRef(null);

  const currentTrees = useMemo(() => {
    if (!meta) return [];
    return trees.map((p, i) => {
      const [x, z] = bngToWorld(p.easting, p.northing, meta);
      const groundY = sampleHeight(p.easting, p.northing) ?? 0;

      // height depends on existing vs growing
      let h;
      if (p.existing) {
        h = p.mature_height; // fixed, always full
      } else {
        const span = p.years_to_mature ?? 15;
        const t = Math.min(1, Math.max(0, year / span));
        h = p.start_height + (p.mature_height - p.start_height) * t;
      }

      // per-tree variation on top of that
      const hv = h * (0.85 + rand(i * 7.3) * 0.3);
      const canopyR = hv * (0.28 + rand(i * 3.9) * 0.12);
      const shade = 0.8 + rand(i * 5.1) * 0.4;
      const lean = (rand(i * 2.2) - 0.5) * 0.15;
      return {
        x,
        z,
        groundY,
        h: hv,
        canopyR,
        shade,
        lean,
        existing: p.existing,
      };
    });
  }, [trees, meta, sampleHeight, year]);

  const count = currentTrees.length;

  useLayoutEffect(() => {
    if (!canopyRef.current || !trunkRef.current || !count) return;
    const dummy = new THREE.Object3D();
    const isWinter = season === "winter";
    const base = new THREE.Color(isWinter ? "#5a5238" : "#2f5424");
    const trunkCol = new THREE.Color("#3d2f22");
    const col = new THREE.Color();

    currentTrees.forEach((t, i) => {
      // canopy: squashed sphere-blob sitting atop the trunk
      const canopyY = t.groundY + t.h * 0.76;
      dummy.position.set(t.x, canopyY, t.z);
      dummy.scale.set(t.canopyR * 0.7, t.canopyR * 1.8, t.canopyR * 0.7);
      dummy.updateMatrix();
      canopyRef.current.setMatrixAt(i, dummy.matrix);
      col.copy(base).multiplyScalar(t.shade);
      canopyRef.current.setColorAt(i, col);

      // trunk: thin cylinder from ground to canopy base
      const trunkH = t.h * 0.25;
      dummy.position.set(t.x, t.groundY + trunkH / 2, t.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(t.h * 0.04, trunkH, t.h * 0.04);
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(i, dummy.matrix);
      trunkRef.current.setColorAt(i, trunkCol);
    });
    canopyRef.current.instanceMatrix.needsUpdate = true;
    trunkRef.current.instanceMatrix.needsUpdate = true;
    if (canopyRef.current.instanceColor)
      canopyRef.current.instanceColor.needsUpdate = true;
    if (trunkRef.current.instanceColor)
      trunkRef.current.instanceColor.needsUpdate = true;
  }, [trees, count, season]);

  if (!count) return null;
  const isWinter = season === "winter";

  return (
    <group>
      <instancedMesh
        ref={canopyRef}
        args={[undefined, undefined, count]}
        key={`c${count}`}
      >
        <sphereGeometry args={[1, 8, 7]} />
        <meshStandardMaterial
          roughness={0.9}
          flatShading
          transparent={isWinter}
          opacity={isWinter ? 0.6 : 1.0}
        />
      </instancedMesh>
      <instancedMesh
        ref={trunkRef}
        args={[undefined, undefined, count]}
        key={`t${count}`}
      >
        <cylinderGeometry args={[1, 1.2, 1, 6]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
    </group>
  );
};

export default Trees;
