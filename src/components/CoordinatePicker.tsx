import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import useSolar from "../state/store";

const CoordinatePicker = ({ terrainRef }) => {
  const { camera, gl, scene } = useThree();
  const meta = useSolar((s) => s.metaData);

  useEffect(() => {
    if (!meta) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      // normalised device coords from the click
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // raycast against the terrain mesh (pass it in, or raycast whole scene)
      const target = terrainRef?.current ?? scene;
      const hits = raycaster.intersectObject(target, true);
      if (!hits.length) return;

      const p = hits[0].point; // world-space hit point

      // world XZ -> BNG easting/northing (inverse of bngToWorld)
      const halfW = (meta.cols * meta.cell_size_m) / 2;
      const halfD = (meta.rows * meta.cell_size_m) / 2;
      const easting = Math.round(p.x + halfW + meta.origin_easting);
      const northing = Math.round(meta.origin_northing - (p.z + halfD));

      // output — copy-paste ready for your data file
      console.log(`{ easting: ${easting}, northing: ${northing} },`);
      // also copy to clipboard for convenience:
      navigator.clipboard?.writeText(
        `{ easting: ${easting}, northing: ${northing} },`,
      );
    };

    gl.domElement.addEventListener("click", onClick);
    return () => gl.domElement.removeEventListener("click", onClick);
  }, [meta, camera, gl, scene, terrainRef]);

  return null;
};

export default CoordinatePicker;
