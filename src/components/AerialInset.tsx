import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import useSolar from "../state/store";

// Shape of aerial_inset.json (import the file and pass it straight in)
export type InsetExtent = {
  min_easting: number;
  min_northing: number;
  max_easting: number;
  max_northing: number;
};

type Props = {
  url: string; // path to aerial_inset.png (RGB, or RGBA if you used --feather)
  extent: InsetExtent; // the aerial_inset.json object
  segments?: number; // grid resolution; 256 ~= your 10m DTM over a 2.5km box
  feathered?: boolean; // true if the PNG has a feathered alpha edge (--feather)
  yOffset?: number; // tiny lift if you ever still see z-fight; polygonOffset usually suffices
};

/**
 * High-res aerial inset draped over the exploration area, sitting on top of the
 * low-res base terrain texture. Renders in all modes (overview + free-roam).
 *
 * Wrap in <Suspense> (useTexture suspends):
 *   import insetExtent from "../assets/aerial_inset.json";
 *   <Suspense fallback={null}>
 *     <AerialInset url="/aerial_inset.png" extent={insetExtent} />
 *   </Suspense>
 */
const AerialInset = ({
  url,
  extent,
  segments = 256,
  feathered = false,
  yOffset = 0,
}: Props) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const texture = useTexture(url);
  const { gl } = useThree();

  // texture setup: match the base (sRGB) + anisotropy for grazing-angle sharpness
  useEffect(() => {
    if (!texture) return;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.generateMipmaps = true;
    // flipY defaults to true, which matches the north-up PNG (row 0 = north -> v = 1).
    // If the inset comes out N/S-flipped vs your base, set texture.flipY = false here.
    texture.needsUpdate = true;
  }, [texture, gl]);

  const geometry = useMemo(() => {
    if (!meta) return null;
    const {
      min_easting: minE,
      min_northing: minN,
      max_easting: maxE,
      max_northing: maxN,
    } = extent;
    const halfW = (meta.cols * meta.cell_size_m) / 2;
    const halfD = (meta.rows * meta.cell_size_m) / 2;
    const segs = segments;
    const n = segs + 1;

    const positions = new Float32Array(n * n * 3);
    const uvs = new Float32Array(n * n * 2);

    for (let j = 0; j < n; j++) {
      const tv = j / segs; // 0 at south (minN) -> 1 at north (maxN)
      const N = minN + tv * (maxN - minN);
      for (let i = 0; i < n; i++) {
        const tu = i / segs; // 0 at west (minE) -> 1 at east (maxE)
        const E = minE + tu * (maxE - minE);
        const x = E - meta.origin_easting - halfW; // same world convention as the rest of the app
        const z = meta.origin_northing - N - halfD; // north = -z
        const y = (sampleHeight(E, N) ?? 0) + yOffset; // hug the real terrain
        const vi = j * n + i;
        positions[vi * 3] = x;
        positions[vi * 3 + 1] = y;
        positions[vi * 3 + 2] = z;
        uvs[vi * 2] = tu;
        uvs[vi * 2 + 1] = tv; // flipY=true maps v=1 to the north row of the PNG
      }
    }

    const indices: number[] = [];
    for (let j = 0; j < segs; j++) {
      for (let i = 0; i < segs; i++) {
        const a = j * n + i;
        const b = a + 1;
        const c = (j + 1) * n + i;
        const d = c + 1;
        indices.push(a, b, c, b, d, c); // winding chosen so normals point +Y (up)
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [meta, sampleHeight, extent, segments, yOffset]);

  // dispose old geometry on rebuild
  useEffect(() => () => geometry?.dispose(), [geometry]);

  if (!meta || !geometry) return null;

  return (
    <mesh geometry={geometry} renderOrder={1}>
      <meshStandardMaterial
        map={texture}
        roughness={1}
        metalness={0}
        transparent={feathered}
        depthWrite={!feathered}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
};

export default AerialInset;
