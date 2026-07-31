import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { getScreenConfiguration } from "../Utils/utils";
import useStore from "../state/store";

const ResponsiveCamera = () => {
  const screenSize = useStore((state) => state.screenSize);
  const setScreenSize = useStore((state) => state.setScreenSize);

  const { camera } = useThree();

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const configuration = getScreenConfiguration(
      screenSize.width,
      screenSize.height
    );
    camera.position.copy(configuration);
    camera.updateProjectionMatrix();
  }, [screenSize.width, screenSize.height]);

  return null;
};

export default ResponsiveCamera;
