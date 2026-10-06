import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaQuery } from "@mui/material";
import useSolar from "../state/store";
import { bngToWorld } from "../Utils/utils";
import FirstPersonLook from "./FirstPersonLook";

function hFovToVFov(hFovDeg: number, aspect: number) {
  const h = THREE.MathUtils.degToRad(hFovDeg);
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect));
}

const LOOK_POS_EAST = 508400;
const LOOK_POS_NORTH = 358850;
const EYE_HEIGHT = 1.6;

function CameraController() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const mode = useSolar((s) => s.viewMode);
  const roamMode = useSolar((s) => s.roamMode);
  const vpId = useSolar((s) => s.activeViewpoint);
  const activeWP = useSolar((s) => s.activeWaypoint);
  const dirIdx = useSolar((s) => s.activeDirection);
  const viewpoints = useSolar((s) => s.viewpoints);

  const { camera: defaultCamera, size } = useThree();
  const camera = defaultCamera as THREE.PerspectiveCamera;

  // Refs
  const arrived = useRef(false);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const targetFov = useRef(55);
  const initialised = useRef(false);

  // Get current viewpoint
  const vp = vpId != null ? viewpoints.find((v) => v.no === vpId) : null;

  const CAM_POS = isMobile ? [0, 900, 1200] : [0, 250, 800];

  // reset the glide latch whenever the active waypoint changes, so the camera
  // glides to the new waypoint (then latches on arrival)
  useEffect(() => {
    arrived.current = false;
  }, [activeWP, vpId, roamMode]);

  // compute the yaw FirstPersonLook should start from, based on the active
  // documented direction (so entering explore faces the right way)
  const initialYaw =
    vp?.directions?.[dirIdx]?.bearing != null
      ? THREE.MathUtils.degToRad(-vp.directions[dirIdx].bearing) // tune offset to match scene
      : 0;

  useFrame(() => {
    if (!meta) return;

    // ---------------------------------------------------------------
    // FREEROAM: glide position only; FirstPersonLook owns rotation.
    // Handled first and returns early so it never touches the shared
    // ease/lookAt block below.
    // ---------------------------------------------------------------
    if (mode === "viewpoint" && roamMode === "freeroam") {
      if (!vp) return;
      const wp = vp.waypoints?.[activeWP];
      if (!wp) return;

      const [x, z] = bngToWorld(wp.easting, wp.northing, meta);
      const y = (sampleHeight(wp.easting, wp.northing) ?? 0) + EYE_HEIGHT; // eye height
      targetPos.current.set(x, y, z);

      if (!arrived.current) {
        camera.position.lerp(targetPos.current, 0.08);
        if (camera.position.distanceTo(targetPos.current) < 0.1) {
          camera.position.copy(targetPos.current);
          arrived.current = true;
        }
      }
      // rotation handled by <FirstPersonLook />
      return;
    }

    // ---------------------------------------------------------------
    // OVERVIEW and FIXED viewpoint: compute a target pose, then ease.
    // ---------------------------------------------------------------
    if (mode === "overview") {
      // high vantage looking down over site centre
      const [cx, cz] = bngToWorld(LOOK_POS_EAST, LOOK_POS_NORTH, meta); // rough site centre BNG — tune
      targetPos.current.set(cx + CAM_POS[0], CAM_POS[1], cz + CAM_POS[2]);
      targetLook.current.set(cx, 0, cz);
      targetFov.current = 55;
    } else {
      // roamMode === fixed
      if (!vp) return null;

      const [x, z] = bngToWorld(vp.easting, vp.northing, meta);
      const y = (sampleHeight(vp.easting, vp.northing) ?? 0) + EYE_HEIGHT; // eye height

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

  return (
    <>
      {mode === "viewpoint" && roamMode === "freeroam" && (
        <FirstPersonLook
          enabled={true}
          initialYaw={initialYaw}
          key={`${vpId}-${dirIdx}`}
        />
      )}
    </>
  );
}

export default CameraController;
