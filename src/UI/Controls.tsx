import { useControls } from "leva";
import useSolar from "../state/store";

const Controls = () => {
  const currentYear = useSolar((s) => s.currentYear);
  const setCurrentYear = useSolar((s) => s.setCurrentYear);

  useControls({
    year: {
      value: currentYear,
      min: 0,
      max: 10,
      step: 0.5,
      onChange: (value) => {
        setCurrentYear(value);
      },
    },
  });

  return null;
};

export default Controls;
