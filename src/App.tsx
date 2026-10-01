import { Canvas } from "@react-three/fiber";
import DaySky from "./components/DaySky";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import UI from "./UI/UI";
import ParcelInspector from "./components/ParcelInspector";
import CameraController from "./components/CameraController";
import { pvParcels } from "./state/parcelData";
import LoadingScreen from "./UI/LoadingScreen";
import { Perf } from "r3f-perf";

const TEST_CAMERA = true;

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
      <LoadingScreen />
    </>
  );
}

export default App;
