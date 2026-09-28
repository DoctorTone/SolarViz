import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import useSolar from "../state/store";

const FirstFrameSignal = () => {
  const done = useRef(false);
  const setRendered = useSolar((s) => s.setRendered); // new store flag
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      setRendered(true); // scene has drawn at least one frame
    }
  });
  return null;
};

export default FirstFrameSignal;
