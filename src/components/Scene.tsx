import { useEffect } from "react";
import Terrain from "./Terrain";
import useSolar from "../state/store";
import Markers from "./Markers";
import Grid from "./Grid";
import { hedgerows } from "../state/hedgerowData";
import HedgeRow from "./HedgeRow";
import { pvParcels } from "../state/parcelData";
import Panels from "./Panels";
import { treeData } from "../state/treeData";
import Trees from "./Trees";
import Buildings from "./Buildings";

const Scene = () => {
  const loadData = useSolar((state) => state.loadData);
  const loaded = useSolar((state) => state.loaded);
  const season = useSolar((state) => state.currentSeason);

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
          {pvParcels.map((p) => (
            <Panels key={p.id} parcel={p.boundary} />
          ))}
          <Trees trees={treeData} season={season} />
          <Buildings />
        </>
      ) : null}
    </>
  );
};

export default Scene;
