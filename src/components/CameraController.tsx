import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useSolar from "../state/store";

function hFovToVFov(hFovDeg, aspect) {
  const h = THREE.MathUtils.degToRad(hFovDeg);
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect));
}

// viewpoint definitions: BNG position, eye level AOD, and the view directions
const VIEWPOINTS = {
  7: {
    easting: 508022,
    northing: 359680,
    eyeAOD: 16.82, // 15.32 ground +1.5
    directions: [
      { bearing: 115.7 },
      { bearing: 205.7 },
      { bearing: 295.7 },
      { bearing: 25.7 },
    ],
  },
  2: {
    easting: 508665,
    northing: 360138,
    eyeAOD: 12, // 10.5 ground +1.5
    directions: [{ bearing: 88.1 }, { bearing: 178.1 }, { bearing: 268.1 }],
  },
  4: {
    easting: 508587,
    northing: 358365,
    eyeAOD: 15.17, // 13.67 +1.5,
    directions: [{ bearing: 313.7 }],
  },
};

const CAM_POS = [0, 900, 1200];

function CameraController() {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const mode = useSolar((s) => s.viewMode);
  const vpId = useSolar((s) => s.activeViewpoint);
  const dirIdx = useSolar((s) => s.activeDirection);
  const { camera, size } = useThree();

  // reusable target vectors
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const targetFov = useRef(55);
  const initialised = useRef(false);

  // convert BNG -> world (centred plane)
  const toWorld = (e, n) => {
    const halfW = (meta.cols * meta.cell_size_m) / 2;
    const halfD = (meta.rows * meta.cell_size_m) / 2;
    return [e - meta.origin_easting - halfW, meta.origin_northing - n - halfD];
  };

  useFrame(() => {
    if (!meta) return;

    // --- compute the target pose for the current mode ---
    if (mode === "overview") {
      // high vantage looking down over site centre
      const [cx, cz] = toWorld(508400, 359000); // rough site centre BNG — tune
      targetPos.current.set(cx + CAM_POS[0], CAM_POS[1], cz + CAM_POS[2]);
      targetLook.current.set(cx, 0, cz);
      targetFov.current = 55;
    } else {
      if (vpId === null) return;

      const vp = VIEWPOINTS[vpId];
      const [x, z] = toWorld(vp.easting, vp.northing);
      const groundAOD = sampleHeight(vp.easting, vp.northing) ?? 0;
      const y = vp.eyeAOD ?? groundAOD + 1.5;

      const bearing = THREE.MathUtils.degToRad(vp.directions[dirIdx].bearing);
      const d = 200;
      const lookE = vp.easting + Math.sin(bearing) * d;
      const lookN = vp.northing + Math.cos(bearing) * d;
      const [lx, lz] = toWorld(lookE, lookN);

      targetPos.current.set(x, y, z);
      targetLook.current.set(lx, y, lz); // level look
      targetFov.current = hFovToVFov(90, size.width / size.height);
    }

    // --- initialise instantly on first frame, then ease ---
    if (!initialised.current) {
      camera.position.copy(targetPos.current);
      currentLook.current.copy(targetLook.current);
      camera.fov = targetFov.current;
      camera.near = 0.5;
      camera.far = 20000;
      camera.updateProjectionMatrix();
      camera.lookAt(currentLook.current);
      initialised.current = true;
      return;
    }

    // ease position, look target, and fov toward their goals
    const k = 0.08; // 0..1 per frame; higher = snappier
    camera.position.lerp(targetPos.current, k);
    currentLook.current.lerp(targetLook.current, k);
    camera.lookAt(currentLook.current);

    const newFov = THREE.MathUtils.lerp(camera.fov, targetFov.current, k);
    if (Math.abs(newFov - camera.fov) > 0.01) {
      camera.fov = newFov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default CameraController;
