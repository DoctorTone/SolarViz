import { useControls } from "leva";

const Controls = () => {
  const { myValue } = useControls({ myValue: 10 });
  return null;
};

export default Controls;
