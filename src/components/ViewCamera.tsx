import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import useSolar from "../state/store";

// Convert a horizontal FOV to the vertical FOV Three.js needs, for this aspect.
function hFovToVFov(hFovDeg, aspect) {
  const h = THREE.MathUtils.degToRad(hFovDeg);
  const v = 2 * Math.atan(Math.tan(h / 2) / aspect);
  return THREE.MathUtils.radToDeg(v);
}

const ViewCamera = ({ hFovDeg = 90 }) => {
  const meta = useSolar((s) => s.metaData);
  const { camera, size } = useThree();

  useEffect(() => {
    if (!meta) return;

    const halfW = (meta.cols * meta.cell_size_m) / 2;
    const halfD = (meta.rows * meta.cell_size_m) / 2;

    // --- position (survey grid ref + eye level AOD) ---
    // const E = 508022,
    //   N = 359680;
    // const E = 508665,
    //   N = 360138;
    const E = 508587,
      N = 358365;
    const x = E - meta.origin_easting - halfW;
    const z = meta.origin_northing - N - halfD;
    const y = 13.67 + 1.5; // eye level AOD, plus eye height

    // --- look direction (bearing 115.7° clockwise from north) ---
    const bearing = THREE.MathUtils.degToRad(313.7);
    const d = 100;
    const lookE = E + Math.sin(bearing) * d; // easting component
    const lookN = N + Math.cos(bearing) * d; // northing component
    const lx = lookE - meta.origin_easting - halfW;
    const lz = meta.origin_northing - lookN - halfD;

    // --- apply ---
    camera.position.set(x, y, z);
    camera.up.set(0, 1, 0);
    camera.lookAt(lx, y, lz); // level look (same Y)
    camera.fov = hFovToVFov(hFovDeg, size.width / size.height);
    camera.near = 0.5;
    camera.far = 20000;
    camera.updateProjectionMatrix();
  }, [meta, camera, size.width, size.height, hFovDeg]);

  return null;
};

export default ViewCamera;
