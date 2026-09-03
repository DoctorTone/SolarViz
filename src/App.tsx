import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import DaySky from "./components/DaySky";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import UI from "./UI/UI";
import ParcelInspector from "./components/ParcelInspector";
import CameraController from "./components/CameraController";
import { pvParcels } from "./state/parcelData";

const TEST_CAMERA = false;

function App() {
  return (
    <>
      <Canvas>
        {!TEST_CAMERA && <CameraController />}
        {TEST_CAMERA && <ParcelInspector parcel={pvParcels[0].boundary} />}
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
