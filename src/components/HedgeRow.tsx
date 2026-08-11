import { useMemo } from "react";
import * as THREE from "three";
import useSolar from "../state/store";

// Convert BNG easting/northing to world X/Z on the centred terrain plane.
function bngToWorld(easting, northing, meta) {
  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;
  const x = easting - meta.origin_easting - halfW;
  const z = meta.origin_northing - northing - halfD;
  return [x, z];
}

const HedgeRow = ({ hedge }) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const year = useSolar((s) => s.currentYear); // 0..10
  const season = useSolar((s) => s.currentSeason); // 'summer' | 'winter'

  const geometry = useMemo(() => {
    if (!meta) return null;

    const { points, start_height = 1.5, mature_height = 3.5 } = hedge;

    // Growth: lerp from existing height to mature over years 0..10
    const t = Math.min(1, Math.max(0, year / 10));
    const height = start_height + (mature_height - start_height) * t;

    const HALF_WIDTH = 1.5; // hedge is ~3m thick

    const positions = [];
    const indices = [];
    let vi = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const [ax, az] = bngToWorld(points[i][0], points[i][1], meta);
      const [bx, bz] = bngToWorld(points[i + 1][0], points[i + 1][1], meta);
      const ay = sampleHeight(points[i][0], points[i][1]) ?? 0;
      const by = sampleHeight(points[i + 1][0], points[i + 1][1]) ?? 0;

      // Perpendicular to the segment (in XZ plane), for hedge thickness
      const dx = bx - ax,
        dz = bz - az;
      const len = Math.hypot(dx, dz) || 1;
      const px = (-dz / len) * HALF_WIDTH;
      const pz = (dx / len) * HALF_WIDTH;

      // 8 vertices per segment: a box from a->b, base at terrain, up to height
      // bottom: a-left, a-right, b-left, b-right ; top: same +height
      const aL = [ax + px, ay, az + pz];
      const aR = [ax - px, ay, az - pz];
      const bL = [bx + px, by, bz + pz];
      const bR = [bx - px, by, bz - pz];
      const aLt = [aL[0], ay + height, aL[2]];
      const aRt = [aR[0], ay + height, aR[2]];
      const bLt = [bL[0], by + height, bL[2]];
      const bRt = [bR[0], by + height, bR[2]];

      [aL, aR, bL, bR, aLt, aRt, bLt, bRt].forEach((v) => positions.push(...v));

      // faces (two tris each): left side, right side, top
      const o = vi;
      // left side (aL,bL,bLt,aLt) = o+0,o+2,o+6,o+4
      indices.push(o + 0, o + 2, o + 6, o + 0, o + 6, o + 4);
      // right side (aR,aRt,bRt,bR)
      indices.push(o + 1, o + 5, o + 7, o + 1, o + 7, o + 3);
      // top (aLt,bLt,bRt,aRt)
      indices.push(o + 4, o + 6, o + 7, o + 4, o + 7, o + 5);
      vi += 8;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [hedge, meta, sampleHeight, year]);

  if (!geometry) return null;

  // Winter = sparser/browner, summer = fuller/greener
  const color = season === "winter" ? "#6b6b4a" : "#3a5f2a";
  const opacity = season === "winter" ? 0.75 : 1.0;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        transparent={season === "winter"}
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default HedgeRow;
