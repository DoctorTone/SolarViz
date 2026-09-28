import { useMemo } from "react";
import * as THREE from "three";
import useSolar from "../state/store";
import { bngToWorld } from "../Utils/utils";

const TILT = THREE.MathUtils.degToRad(13); // south-facing tilt

// point-in-polygon (ray cast) on BNG coords
function inside(e: number, n: number, poly: number[][]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ei, ni] = poly[i],
      [ej, nj] = poly[j];
    if (ni > n !== nj > n && e < ((ej - ei) * (n - ni)) / (nj - ni) + ei)
      c = !c;
  }
  return c;
}

const Panels = ({ parcel }: { parcel: number[][] }) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);

  const { instances, count } = useMemo(() => {
    if (!meta) return { instances: [], count: 0 };

    const ROW_PITCH = 12.2; // metres between rows (N-S spacing)
    const PANEL_STEP = 0 + 29.98; // metres between panels along a row (E-W)

    // bounding box of the parcel in BNG
    const es = parcel.map((p) => p[0]),
      ns = parcel.map((p) => p[1]);
    const eMin = Math.min(...es),
      eMax = Math.max(...es);
    const nMin = Math.min(...ns),
      nMax = Math.max(...ns);

    const insts: { x: number; y: number; z: number }[] = [];
    // rows run E-W (constant northing), stepping north-south
    for (let n = nMin; n <= nMax; n += ROW_PITCH) {
      for (let e = eMin; e <= eMax; e += PANEL_STEP) {
        if (!inside(e, n, parcel)) continue;
        const [x, z] = bngToWorld(e, n, meta);
        const y = sampleHeight(e, n) ?? 0;
        insts.push({ x, y, z });
      }
    }
    return { instances: insts, count: insts.length };
  }, [parcel, meta, sampleHeight]);

  const meshRef = useMemo(() => new THREE.Object3D(), []);

  const onRef = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    instances.forEach((inst, i) => {
      meshRef.position.set(inst.x, inst.y + 1.5, inst.z); // panel centre ~1.5m
      meshRef.rotation.set(TILT, 0, 0); // tilt south
      meshRef.updateMatrix();
      mesh.setMatrixAt(i, meshRef.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  if (!count) return null;

  return (
    <instancedMesh ref={onRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[29.98, 0.1, 9.4]} /> {/* panel: 3.5m wide, 2m deep */}
      <meshStandardMaterial color="#1a2b4a" metalness={0.3} roughness={0.4} />
    </instancedMesh>
  );
};

export default Panels;
