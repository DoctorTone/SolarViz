import { Canvas } from "@react-three/fiber";
import DaySky from "./components/DaySky";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import UI from "./UI/UI";
import ParcelInspector from "./components/ParcelInspector";
import CameraController from "./components/CameraController";
import { pvParcels } from "./state/parcelData";
import LoadingScreen from "./UI/LoadingScreen";
<<<<<<< HEAD

const TEST_CAMERA = true;
=======
import useSolar from "./state/store";
import { Perf } from "r3f-perf";
>>>>>>> cd51e6643bb89a6ae0c47b74bb47c32f6b0ca2db

function App() {
  const freeCamera = useSolar((s) => s.freeCamera);

  return (
    <>
      <Canvas>
        {!freeCamera && <CameraController />}
        {freeCamera && <ParcelInspector parcel={pvParcels[0].boundary} />}
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
