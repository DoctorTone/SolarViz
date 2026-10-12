import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";

const PIN_COLOR = "#e23b2e"; // strong red — distinct against green; try "#f4a52b" amber or your brand colour
const R = 0.42; // head radius (world metres) — smaller than the old dot
const CY = R * 1.6; // tip-to-head-centre distance
const TIP_LIFT = 0.35; // how high the tip floats above the ground point
const CLICK_RADIUS = 2.5; // invisible click target

const Marker = ({
  position,
  pinGeo,
  onClick,
}: {
  position: [number, number, number];
  pinGeo: THREE.ShapeGeometry;
  onClick: () => void;
}) => {
  const bobRef = useRef<THREE.Group>(null); // wrapper that bobs vertically (local space)
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (bobRef.current)
      bobRef.current.position.y = TIP_LIFT + Math.sin(t * 2) * 0.08;
    if (ringRef.current) {
      const p = 1 + Math.sin(t * 2.5) * 0.15;
      ringRef.current.scale.set(p, p, 1);
    }
  });

  const over = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    document.body.style.cursor = "auto";
  };
  const click = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  // everything is LOCAL to this outer group, which sits at the waypoint
  return (
    <group position={position}>
      {/* large invisible click target (flat on ground) */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={click}
        onPointerOver={over}
        onPointerOut={out}
      >
        <circleGeometry args={[CLICK_RADIUS, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* visible flat ground ring (the position anchor) */}
      <mesh
        ref={ringRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.45, 0.62, 32]} />
        <meshBasicMaterial
          color={PIN_COLOR}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* bobbing billboarded pin — tip at the pivot so it points at the spot */}
      <group ref={bobRef} position={[0, TIP_LIFT, 0]}>
        <Billboard>
          {/* coloured teardrop */}
          <mesh
            geometry={pinGeo}
            renderOrder={1}
            onClick={click}
            onPointerOver={over}
            onPointerOut={out}
          >
            <meshBasicMaterial
              color={PIN_COLOR}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          {/* white eye */}
          <mesh position={[0, CY, 0.002]} renderOrder={2}>
            <circleGeometry args={[R * 0.4, 24]} />
            <meshBasicMaterial
              color="#ffffff"
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </Billboard>
      </group>
    </group>
  );
};

export default Marker;
