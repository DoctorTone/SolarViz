import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import DaySky from "./components/DaySky";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import UI from "./UI/UI";
import ParcelInspector from "./components/ParcelInspector";
import CameraController from "./components/CameraController";
import { pvParcels } from "./state/parcelData";
import LoadingScreen from "./UI/LoadingScreen";
import useSolar from "./state/store";
import type * as THREE from "three";
import LoaderTracker from "./UI/LoaderTracker";
// import { Perf } from "r3f-perf";

// coarse low-memory signal; only true when the device actually reports < 3GB
const LOW_MEMORY =
  typeof navigator !== "undefined" &&
  (navigator as any).deviceMemory &&
  (navigator as any).deviceMemory < 3;

function DeviceFallback({
  mode,
  onPrimary,
}: {
  mode: "gated" | "lost";
  onPrimary: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#0f1115",
        color: "#e8eaed",
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 420 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 10px" }}>
          Best viewed on a desktop
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            opacity: 0.8,
            margin: "0 0 22px",
          }}
        >
          This interactive 3D model is graphics-intensive and needs more memory
          than this device can provide. For the full experience, open it on a
          desktop or laptop with a recent browser.
        </p>
        <button
          onClick={onPrimary}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            borderRadius: 8,
            border: "1px solid #3a3f47",
            background: "#1b1f27",
            color: "#e8eaed",
            cursor: "pointer",
          }}
        >
          {mode === "lost" ? "Try again" : "Continue anyway"}
        </button>
      </div>
    </div>
  );
}

function App() {
  const freeCamera = useSolar((s) => s.freeCamera);
  const [override, setOverride] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    const canvas = gl.domElement;
    canvas.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault(); // REQUIRED — lets the browser try to restore instead of dying silently
        setContextLost(true);
      },
      false,
    );
  }, []);

  if (contextLost)
    return (
      <DeviceFallback mode="lost" onPrimary={() => window.location.reload()} />
    );

  if (LOW_MEMORY && !override) {
    return <DeviceFallback mode="gated" onPrimary={() => setOverride(true)} />;
  }

  return (
    <>
      <Canvas
        dpr={[1, 1.5]} // cap pixel density — don't render at full retina on mobile>
        gl={{
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={handleCreated}
      >
        {!freeCamera && <CameraController />}
        {freeCamera && <ParcelInspector parcel={pvParcels[0].boundary} />}
        <Lights />
        <DaySky />
        <Scene />
        {/* <Perf /> */}
      </Canvas>
      <UI />
      <LoaderTracker />
      <LoadingScreen />
    </>
  );
}

export default App;
