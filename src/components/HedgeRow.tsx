import { useMemo, useRef, useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import useSolar from "../state/store";
import type { hedgerows } from "../state/hedgerowData";
import { bngToWorld } from "../Utils/utils";

const MIN_HEIGHT = 0.15;
const MODEL_REF = 3.5;

function rand(seed: number) {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

type Hedgerow = (typeof hedgerows)[number];

const HedgeRow = ({ hedge }: { hedge: Hedgerow }) => {
  const developmentVisible = useSolar((s) => s.developmentVisible);
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const year = useSolar((s) => s.currentYear); // 0..10
  const season = useSolar((s) => s.currentSeason); // 'summer' | 'winter'
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // load the hedge GLB — grab its geometry + material for instancing
  const { nodes, materials } = useGLTF("/models/hedgePiece.glb");
  const hedgeGeo = nodes.Object_2.geometry;
  const hedgeMat = materials.hedgetextured;
  hedgeGeo.computeBoundingBox();
  hedgeGeo.translate(0, -hedgeGeo.boundingBox.min.y, 0); // shift base to y=0

  const SEGMENT_LENGTH = 10; // metres each hedge piece covers along the line — match your model

  const {
    augments_existing,
    start_height = 1.5,
    mature_height = 3.5,
    points,
  } = hedge;

  const t = Math.min(1, Math.max(0, year / 10));
  let height,
    render = true;
  if (augments_existing) {
    height = developmentVisible
      ? start_height + (mature_height - start_height) * t
      : start_height;
  } else {
    if (!developmentVisible) {
      render = false;
      height = 0;
    } else height = start_height + (mature_height - start_height) * t;
  }
  const yScale = height / MODEL_REF; // model base = mature, so scale is fraction

  // build the per-segment transforms along the polyline
  const segments = useMemo(() => {
    if (!meta || !render) return [];
    const out = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [ax, az] = bngToWorld(points[i][0], points[i][1], meta);
      const [bx, bz] = bngToWorld(points[i + 1][0], points[i + 1][1], meta);
      const dx = bx - ax,
        dz = bz - az;
      const segLen = Math.hypot(dx, dz) || 1;
      const steps = Math.max(1, Math.round(segLen / SEGMENT_LENGTH));
      const angle = Math.atan2(dx, dz); // rotation to align hedge with line direction

      for (let s = 0; s < steps; s++) {
        const f = (s + 0.5) / steps; // centre of each sub-segment
        const px = ax + dx * f;
        const pz = az + dz * f;
        // sample ground at this point (convert back to BNG for sampleHeight)
        const e = points[i][0] + (points[i + 1][0] - points[i][0]) * f;
        const n = points[i][1] + (points[i + 1][1] - points[i][1]) * f;
        const py = sampleHeight(e, n) ?? 0;
        out.push({ px, py, pz, angle });
      }
    }
    return out;
  }, [meta, sampleHeight, points, render]);

  const count = segments.length;

  useLayoutEffect(() => {
    if (!meshRef.current || !count) return;
    const dummy = new THREE.Object3D();
    segments.forEach((seg, i) => {
      dummy.position.set(seg.px, seg.py, seg.pz);
      dummy.rotation.set(0, seg.angle + Math.PI / 2, 0);
      dummy.scale.set(1, yScale, yScale); // base scale = mature; Y-scale for growth
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [segments, count, yScale]);

  if (!render || !count || height < 0.15) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[hedgeGeo, hedgeMat, count]}
      key={count}
    />
  );
};

export default HedgeRow;
