import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import useSolar from "../state/store";

const MIN_HEIGHT = 0.15;

// Convert BNG easting/northing to world X/Z on the centred terrain plane.
function bngToWorld(easting, northing, meta) {
  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;
  const x = easting - meta.origin_easting - halfW;
  const z = meta.origin_northing - northing - halfD;
  return [x, z];
}

function rand(seed) {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

const HedgeRow = ({ hedge }) => {
  const developmentVisible = useSolar((s) => s.developmentVisible);
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const year = useSolar((s) => s.currentYear); // 0..10
  const season = useSolar((s) => s.currentSeason); // 'summer' | 'winter'
  const ref = useRef(null);

  const {
    augments_existing,
    start_height = 1.5,
    mature_height = 3.5,
    points,
  } = hedge;

  // Decide this hedge's current height AND whether it renders at all:
  let height;
  let render = true;

  if (augments_existing) {
    // Existing hedge being strengthened: ALWAYS renders (it's part of baseline).
    // At baseline/year 0 it sits at its existing (start) height.
    // When development present, it grows toward mature with the year.
    if (developmentVisible) {
      const t = Math.min(1, Math.max(0, year / 10));
      height = start_height + (mature_height - start_height) * t;
    } else {
      height = start_height; // baseline: existing height only
    }
  } else {
    // Brand-new mitigation hedge: part of the scheme.
    // Does NOT exist in baseline — hide entirely when development not shown.
    if (!developmentVisible) {
      render = false;
    } else {
      const t = Math.min(1, Math.max(0, year / 10));
      height = start_height + (mature_height - start_height) * t; // start_height ~0
    }
  }

  const blobs = useMemo(() => {
    if (!render || height < 0.15) return [];
    const STEP = 0.7,
      WIDTH = 1.4,
      DENSITY = 2.2;
    const out = [];
    let seed = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const [ax, az] = bngToWorld(points[i][0], points[i][1], meta);
      const [bx, bz] = bngToWorld(points[i + 1][0], points[i + 1][1], meta);
      const ay = sampleHeight(points[i][0], points[i][1]) ?? 0;
      const by = sampleHeight(points[i + 1][0], points[i + 1][1]) ?? 0;
      const dx = bx - ax,
        dz = bz - az;
      const segLen = Math.hypot(dx, dz) || 1;
      const steps = Math.max(1, Math.floor(segLen / STEP));

      for (let s = 0; s <= steps; s++) {
        const f = s / steps;
        const cx = ax + dx * f,
          cz = az + dz * f;
        const groundY = ay + (by - ay) * f;
        const nBlobs = Math.max(2, Math.round(height * DENSITY));
        for (let k = 0; k < nBlobs; k++) {
          seed++;
          const r = 0.55 + rand(seed * 3.1) * 0.35;
          const jx = (rand(seed * 1.7) - 0.5) * WIDTH;
          const jz = (rand(seed * 2.3) - 0.5) * WIDTH;
          const jy = Math.pow(rand(seed * 4.5), 0.85) * height;
          const shade = 0.8 + rand(seed * 5.9) * 0.4; // per-blob colour variation
          out.push({
            x: cx + jx,
            y: groundY + r * 0.6 + jy,
            z: cz + jz,
            r,
            shade,
          });
        }
      }
    }
    return out;
  }, [hedge, meta, sampleHeight, height, render]);

  const count = blobs.length;

  // Build the per-instance matrices and colours whenever blobs change
  useLayoutEffect(() => {
    if (!ref.current || !count) return;
    const dummy = new THREE.Object3D();
    const isWinter = season === "winter";
    const base = new THREE.Color(isWinter ? "#6b6a45" : "#33532a");
    const col = new THREE.Color();

    blobs.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.set(b.r * 1.25, b.r * 0.85, b.r * 1.25);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);

      col.copy(base).multiplyScalar(b.shade);
      ref.current.setColorAt(i, col);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [blobs, count, season]);

  if (!count) return null;

  // winter: more transparent (leaf-off, gappy), summer: denser
  const isWinter = season === "winter";

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, count]}
      key={count} /* remount if count changes */
    >
      <sphereGeometry args={[1, 8, 6]} />{" "}
      {/* unit sphere, scaled per-instance */}
      <meshStandardMaterial
        roughness={0.9}
        flatShading
        transparent={isWinter}
        opacity={isWinter ? 0.7 : 1.0}
      />
    </instancedMesh>
  );
};

export default HedgeRow;
