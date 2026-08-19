import { useEffect } from "react";
import Terrain from "./Terrain";
import useSolar from "../state/store";
import Markers from "./Markers";
import Grid from "./Grid";
import { hedgerows } from "../state/hedgerowData";
import HedgeRow from "./HedgeRow";
import { pvParcels } from "../state/parcelData";
import Panels from "./Panels";

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
          <Grid />
          {hedgerows.map((h) => (
            <HedgeRow key={h.id} hedge={h} />
          ))}
          <Panels parcel={pvParcels[0].boundary} />
        </>
      ) : null}
    </>
  );
};

export default Scene;
