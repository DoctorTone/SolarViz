import { Sky } from "@react-three/drei";

const DaySky = () => {
  return (
    <Sky distance={10000} sunPosition={[500, 150, 1000]} turbidity={0.1} />
  );
};

export default DaySky;
