import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import DaySky from "./components/DaySky";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import UI from "./UI/UI";
import CameraController from "./components/CameraController";

function App() {
  return (
    <>
      <Canvas>
        <CameraController />
        <Lights />
        <DaySky />
        <Scene />
        {/* <Perf /> */}
      </Canvas>
      <UI />
    </>
  );
}

export default App;
