import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { trackOnce } from "../analytics/track";

const LoaderTracker = () => {
  const { active, progress } = useProgress();

  useEffect(() => {
    if (!active && progress >= 100) trackOnce("loader-complete");
  }, [active, progress]);

  return null;
};

export default LoaderTracker;
