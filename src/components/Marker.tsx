import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";

const Marker = ({ position, onClick }) => {
  const bobRef = useRef<THREE.Group>(null); // wrapper that bobs vertically (local space)
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // floating indicator: gentle vertical bob
    if (bobRef.current) {
      bobRef.current.position.y = 2.2 + Math.sin(t * 2) * 0.25;
    }
    // ground ring: gentle in-plane pulse
    if (ringRef.current) {
      const pulse = 1 + Math.sin(t * 2.5) * 0.15;
      ringRef.current.scale.set(pulse, pulse, 1);
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
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={click}
        onPointerOver={over}
        onPointerOut={out}
      >
        <circleGeometry args={[3, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* visible flat ground ring (the position anchor) */}
      <mesh
        ref={ringRef}
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.2, 1.8, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* bob wrapper (local vertical offset) -> Billboard (faces camera, children at origin) */}
      <group ref={bobRef} position={[0, 2.2, 0]}>
        <Billboard>
          {/* green dot */}
          <mesh onClick={click} onPointerOver={over} onPointerOut={out}>
            <circleGeometry args={[0.6, 24]} />
            <meshBasicMaterial color="#2a7d2a" transparent opacity={0.95} />
          </mesh>
          {/* white outline ring for contrast against any background */}
          <mesh position={[0, 0, -0.01]}>
            <ringGeometry args={[0.6, 0.85, 24]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      </group>
    </group>
  );
};

export default Marker;
