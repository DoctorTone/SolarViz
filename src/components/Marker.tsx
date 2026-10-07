import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const Marker = ({ position, onClick }) => {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
      meshRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <ringGeometry args={[1.2, 1.8, 24]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Marker;
