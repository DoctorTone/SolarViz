import { useMemo, useEffect, useState } from "react";
import * as THREE from "three";

const Terrain = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/terrain_meta.json").then((r) => r.json()),
      fetch("/data/terrain_heights.bin").then((r) => r.arrayBuffer()),
    ]).then(([meta, buf]) => {
      setData({ meta, heights: new Float32Array(buf) });
    });
  }, []);

  const geometry = useMemo(() => {
    if (!data) return null;
    const { cols, rows, cell_size_m } = data.meta;
    const heights = data.heights;

    // Plane sized in real metres: (cols-1)*cell wide, (rows-1)*cell deep
    const width = (cols - 1) * cell_size_m;
    const depth = (rows - 1) * cell_size_m;

    const geo = new THREE.PlaneGeometry(width, depth, cols - 1, rows - 1);
    geo.rotateX(-Math.PI / 2); // lay flat: plane XY -> world XZ, +Y up

    // Displace each vertex by its height.
    // PlaneGeometry vertices are row-major starting top-left, matching
    // our row_order "top_to_bottom". After rotateX, Y is height.
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, heights[i]);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    return geo;
  }, [data]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color="#6b7a4f"
        roughness={0.95}
        metalness={0}
        flatShading={false}
      />
    </mesh>
  );
};

export default Terrain;
