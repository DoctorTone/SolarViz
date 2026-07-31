import { Sky } from "@react-three/drei";

const DaySky = () => {
  return (
    <Sky distance={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
  );
};

export default DaySky;
