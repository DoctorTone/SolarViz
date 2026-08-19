import { Canvas } from "@react-three/fiber";
import DaySky from "./components/DaySky";
import Lights from "./components/Lights";
import Scene from "./components/Scene";
import UI from "./UI/UI";
import { pvParcels } from "./state/parcelData";
import ParcelInspector from "./components/ParcelInspector";

function App() {
  return (
    <>
      <Canvas camera={{ fov: 40, near: 0.1, far: 20000 }}>
        <ParcelInspector parcel={pvParcels[0].boundary} />
        <Lights />
        <DaySky />
        <Scene />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
