import { useMemo } from "react";
import * as THREE from "three";
import useSolar from "../state/store";

function bngToWorld(easting, northing, meta) {
  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;
  return [
    easting - meta.origin_easting - halfW,
    meta.origin_northing - northing - halfD,
  ];
}

// point-in-polygon (ray cast) on BNG coords
function inside(e, n, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ei, ni] = poly[i],
      [ej, nj] = poly[j];
    if (ni > n !== nj > n && e < ((ej - ei) * (n - ni)) / (nj - ni) + ei)
      c = !c;
  }
  return c;
}

const Panels = ({ parcel }) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);

  const { instances, count } = useMemo(() => {
    if (!meta) return { instances: [], count: 0 };

    const ROW_PITCH = 6; // metres between rows (N-S spacing)
    const PANEL_STEP = 4; // metres between panels along a row (E-W)
    const TILT = THREE.MathUtils.degToRad(28); // south-facing tilt

    // bounding box of the parcel in BNG
    const es = parcel.map((p) => p[0]),
      ns = parcel.map((p) => p[1]);
    const eMin = Math.min(...es),
      eMax = Math.max(...es);
    const nMin = Math.min(...ns),
      nMax = Math.max(...ns);

    const insts = [];
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

  const onRef = (mesh) => {
    if (!mesh) return;
    instances.forEach((inst, i) => {
      meshRef.position.set(inst.x, inst.y + 0.5, inst.z); // panel centre ~1.5m
      meshRef.rotation.set(THREE.MathUtils.degToRad(28), 0, 0); // tilt south
      meshRef.updateMatrix();
      mesh.setMatrixAt(i, meshRef.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  if (!count) return null;

  return (
    <instancedMesh ref={onRef} args={[null, null, count]}>
      <boxGeometry args={[3.5, 0.1, 2]} /> {/* panel: 3.5m wide, 2m deep */}
      <meshStandardMaterial color="#1a2b4a" metalness={0.3} roughness={0.4} />
    </instancedMesh>
  );
};

export default Panels;
