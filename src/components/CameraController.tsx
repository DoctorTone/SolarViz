import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaQuery } from "@mui/material";
import useSolar from "../state/store";
import { bngToWorld } from "../Utils/utils";

function hFovToVFov(hFovDeg: number, aspect: number) {
  const h = THREE.MathUtils.degToRad(hFovDeg);
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect));
}

const LOOK_POS_EAST = 508400;
const LOOK_POS_NORTH = 358850;

function CameraController() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const mode = useSolar((s) => s.viewMode);
  const vpId = useSolar((s) => s.activeViewpoint);
  const dirIdx = useSolar((s) => s.activeDirection);
  const viewpoints = useSolar((s) => s.viewpoints);
  const { camera: defaultCamera, size } = useThree();
  // The scene uses a perspective camera, so fov is available
  const camera = defaultCamera as THREE.PerspectiveCamera;

  // reusable target vectors
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const targetFov = useRef(55);
  const initialised = useRef(false);

  // Get current viewpoint
  const vp = vpId != null ? viewpoints.find((v) => v.no === vpId) : null;
  const CAM_POS = isMobile ? [0, 900, 1200] : [0, 250, 800];

  useFrame(() => {
    if (!meta) return;

    // --- compute the target pose for the current mode ---
    if (mode === "overview") {
      // high vantage looking down over site centre
      const [cx, cz] = bngToWorld(LOOK_POS_EAST, LOOK_POS_NORTH, meta); // rough site centre BNG — tune
      targetPos.current.set(cx + CAM_POS[0], CAM_POS[1], cz + CAM_POS[2]);
      targetLook.current.set(cx, 0, cz);
      targetFov.current = 55;
    } else {
      if (!vp) return null;

      const [x, z] = bngToWorld(vp.easting, vp.northing, meta);
      const groundAOD = sampleHeight(vp.easting, vp.northing) ?? 0;
      const y = vp.eyeAOD ?? groundAOD + 1.5;

      const direction = vp.directions?.[dirIdx];
      if (!direction) return;
      const bearing = THREE.MathUtils.degToRad(direction.bearing);
      const d = 200;
      const lookE = vp.easting + Math.sin(bearing) * d;
      const lookN = vp.northing + Math.cos(bearing) * d;
      const [lx, lz] = bngToWorld(lookE, lookN, meta);

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
