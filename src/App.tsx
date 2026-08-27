import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import DaySky from "./components/DaySky";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import UI from "./UI/UI";
import { pvParcels } from "./state/parcelData";
import ParcelInspector from "./components/ParcelInspector";
import ViewCamera from "./components/ViewCamera";

function App() {
  return (
    <>
      <Canvas>
        {/* <ViewCamera hFovDeg={90} /> */}
        <ParcelInspector parcel={pvParcels[0].boundary} />
        <Lights />
        <DaySky />
        <Scene />
        <Perf />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
