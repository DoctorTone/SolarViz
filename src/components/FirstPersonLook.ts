import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import useSolar from "../state/store";

const FirstPersonLook = ({ enabled, initialYaw = 0 }) => {
  const { camera, gl } = useThree();
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  // yaw/pitch track the camera's look angles
  const yaw = useRef(0);
  const pitch = useRef(0);

  useEffect(() => {
    yaw.current = initialYaw;
    pitch.current = 0;
  }, [initialYaw]);

  useEffect(() => {
    if (!enabled) return;
    const el = gl.domElement;

    const onDown = (e) => {
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => {
      dragging.current = false;
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.003;
      yaw.current -= dx * sensitivity;
      pitch.current -= dy * sensitivity;
      // clamp pitch so you can't flip upside down
      pitch.current = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, pitch.current),
      );
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled, gl]);

  // sync camera rotation from yaw/pitch each frame
  useFrame(() => {
    if (!enabled) return;
    camera.rotation.order = "YXZ"; // yaw then pitch, avoids roll
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
    camera.rotation.z = 0;
  });

  return null;
};

export default FirstPersonLook;
