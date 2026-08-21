import { useMemo } from "react";
import * as THREE from "three";
import useSolar from "../state/store";
import { makeHedgeTexture } from "../Utils/utils";

const MIN_HEIGHT = 0.15;
// module-level singleton so every hedge shares one texture
let HEDGE_TEX = null;

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
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const year = useSolar((s) => s.currentYear); // 0..10
  const season = useSolar((s) => s.currentSeason); // 'summer' | 'winter'

  const { start_height = 1.5, mature_height = 3.5, points } = hedge;
  const t = Math.min(1, Math.max(0, year / 10));
  const height = start_height + (mature_height - start_height) * t;

  const blobs = useMemo(() => {
    if (!meta || height < 0.15) return [];

    const STEP = 0.7; // metres between sphere clusters along the hedge
    const WIDTH = 1.4; // hedge thickness across
    const DENSITY = 2.2; // blobs per vertical metre per step (higher = denser)
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
        const cx = ax + dx * f;
        const cz = az + dz * f;
        const groundY = ay + (by - ay) * f;

        // number of blobs at this position scales with hedge height (volume fill)
        const nBlobs = Math.max(2, Math.round(height * DENSITY));

        for (let k = 0; k < nBlobs; k++) {
          seed++;
          const r = 0.55 + rand(seed * 3.1) * 0.35; // 0.55-0.9m radius
          const jx = (rand(seed * 1.7) - 0.5) * WIDTH; // across width
          const jz = (rand(seed * 2.3) - 0.5) * WIDTH;
          // random height through the whole body, biased slightly so base fills
          const jy = Math.pow(rand(seed * 4.5), 0.85) * height;
          out.push({
            pos: [cx + jx, groundY + r * 0.6 + jy, cz + jz], // base sits on ground
            r,
          });
        }
      }
    }
    return out;
  }, [hedge, meta, sampleHeight, height]);

  if (!blobs.length) return null;

  // winter: more transparent (leaf-off, gappy), summer: denser
  const isWinter = season === "winter";
  const color = isWinter ? "#6b6a45" : "#33532a";
  const opacity = isWinter ? 0.7 : 1.0;

  return (
    <group>
      {blobs.map((b, i) => (
        <mesh key={i} position={b.pos} scale={[1.25, 0.85, 1.25]}>
          <sphereGeometry args={[b.r, 8, 6]} />
          <meshStandardMaterial
            color={color}
            roughness={0.9}
            transparent={isWinter}
            opacity={opacity}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
};

export default HedgeRow;
