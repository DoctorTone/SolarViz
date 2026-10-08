import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import useSolar from "../state/store";
import * as THREE from "three";
import insetExtent from "../assets/aerial_inset.json"; // from fetch_inset.py

const INSET_FEATHER_M = 100; // width of the soft transition ring at the inset border

const Terrain = () => {
  const { gl } = useThree();
  // NOTE: colorSpace is NoColorSpace here (not SRGB) because we decode sRGB
  // manually in the shader, identically for base + inset, so they always match.
  const groundTexture = useTexture("/textures/aerial_bng.png");
  const insetTexture = useTexture("/textures/aerial_inset.png");
  for (const t of [groundTexture, insetTexture]) {
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = gl.capabilities.getMaxAnisotropy();
    t.generateMipmaps = true;
    // flipY defaults true -> PNG row 0 (north) maps to v = 1, same as the base
  }

  const metaData = useSolar((state) => state.metaData);
  const heights = useSolar((state) => state.heights);
  const setRendered = useSolar((s) => s.setRendered);
  const signalled = useRef(false);

  const geometry = useMemo(() => {
    if (!metaData || !heights) return null;
    const { cols, rows, cell_size_m } = metaData;
    const width = (cols - 1) * cell_size_m;
    const depth = (rows - 1) * cell_size_m;
    const geo = new THREE.PlaneGeometry(width, depth, cols - 1, rows - 1);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, heights[i]);
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [metaData, heights]);

  // material: base aerial everywhere, high-res inset blended in over its footprint
  const material = useMemo(() => {
    if (!metaData) return null;
    const { cols, rows, cell_size_m, origin_easting, origin_northing } =
      metaData;

    // base texture covers the full DTM extent (same math as fetch_aerial.py)
    const baseEmin = origin_easting;
    const baseEmax = origin_easting + cols * cell_size_m;
    const baseNmin = origin_northing - rows * cell_size_m;
    const baseNmax = origin_northing;

    const {
      min_easting: iE0,
      max_easting: iE1,
      min_northing: iN0,
      max_northing: iN1,
    } = insetExtent as any;

    // inset rectangle expressed in base-UV space (u: west->east, v: south->north = v1 at north)
    const uMin = (iE0 - baseEmin) / (baseEmax - baseEmin);
    const uMax = (iE1 - baseEmin) / (baseEmax - baseEmin);
    const vMin = (iN0 - baseNmin) / (baseNmax - baseNmin);
    const vMax = (iN1 - baseNmin) / (baseNmax - baseNmin);

    // feather as a fraction of the inset's own size (local-uv units)
    const fx = Math.max(INSET_FEATHER_M, 1) / (iE1 - iE0);
    const fy = Math.max(INSET_FEATHER_M, 1) / (iN1 - iN0);

    const m = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      map: groundTexture, // keeps USE_MAP / vMapUv defined
    });

    m.onBeforeCompile = (shader) => {
      shader.uniforms.insetMap = { value: insetTexture };
      shader.uniforms.uInsetRect = {
        value: new THREE.Vector4(uMin, vMin, uMax, vMax),
      };
      shader.uniforms.uFeather = { value: new THREE.Vector2(fx, fy) };

      shader.fragmentShader =
        `
        uniform sampler2D insetMap;
        uniform vec4 uInsetRect;   // (uMin, vMin, uMax, vMax) in base-UV space
        uniform vec2 uFeather;     // feather in inset-local UV units
        vec3 srgbToLinear(vec3 c){
          return mix(pow((c + 0.055) / 1.055, vec3(2.4)), c / 12.92, step(c, vec3(0.04045)));
        }
        ` +
        shader.fragmentShader.replace(
          "#include <map_fragment>",
          /* glsl */ `
          #ifdef USE_MAP
            // vMapUv in three r152+. If your three is older and this errors, use vUv.
            vec4 baseCol  = texture2D( map, vMapUv );
            vec2 iuv = (vMapUv - uInsetRect.xy) / (uInsetRect.zw - uInsetRect.xy);
            vec4 insetCol = texture2D( insetMap, clamp(iuv, 0.0, 1.0) );

            // identical sRGB decode for both so they match in linear space
            baseCol.rgb  = srgbToLinear(baseCol.rgb);
            insetCol.rgb = srgbToLinear(insetCol.rgb);

            float inside = step(0.0, iuv.x) * step(iuv.x, 1.0) * step(0.0, iuv.y) * step(iuv.y, 1.0);
            float wx = smoothstep(0.0, uFeather.x, iuv.x) * (1.0 - smoothstep(1.0 - uFeather.x, 1.0, iuv.x));
            float wy = smoothstep(0.0, uFeather.y, iuv.y) * (1.0 - smoothstep(1.0 - uFeather.y, 1.0, iuv.y));
            float w = inside * wx * wy;

            vec4 sampledDiffuseColor = mix(baseCol, insetCol, w);
            diffuseColor *= sampledDiffuseColor;
          #endif
          `,
        );
    };
    m.customProgramCacheKey = () => "terrain-inset-blend";
    return m;
  }, [groundTexture, insetTexture, metaData]);

  useFrame(() => {
    if (geometry && !signalled.current) {
      signalled.current = true;
      setRendered(true);
    }
  });

  if (!geometry || !material) return null;

  return <mesh geometry={geometry} material={material} receiveShadow />;
};

export default Terrain;
