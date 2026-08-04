import { useEffect } from "react";
import Terrain from "./Terrain";
import useSolar from "../state/store";
import Markers from "./Markers";

const Scene = () => {
  const loadData = useSolar((state) => state.loadData);
  const loaded = useSolar((state) => state.loaded);

  useEffect(() => {
    if (!loaded) {
      loadData();
    }
  }, [loaded]);

  return (
    <>
      {loaded ? (
        <>
          <Terrain />
          <Markers />
        </>
      ) : null}
    </>
  );
};

export default Scene;
