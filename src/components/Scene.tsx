import { useEffect, Suspense } from "react";
import Terrain from "./Terrain";
import useSolar from "../state/store";
import ViewpointMarkers from "./ViewpointMarkers";
import Grid from "./Grid";
import { hedgerows } from "../state/hedgerowData";
import HedgeRow from "./HedgeRow";
import { pvParcels } from "../state/parcelData";
import Panels from "./Panels";
import { treeData } from "../state/treeData";
import Trees from "./Trees";
import Buildings from "./Buildings";
// import Elm from "./Elm";
import CoordinatePicker from "./CoordinatePicker";
import WaypointMarkers from "./WaypointMarkers";
import AerialInset from "./AerialInset";
import InsetExtent from "../assets/aerial_inset.json";
import HedgePiece from "./HedgePiece";

const Scene = () => {
  const loadData = useSolar((state) => state.loadData);
  const loaded = useSolar((state) => state.loaded);
  const season = useSolar((state) => state.currentSeason);
  const developmentVisible = useSolar((s) => s.developmentVisible);

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
          <Suspense fallback={null}>
            <AerialInset
              url="/textures/aerial_inset.png"
              extent={InsetExtent}
            />
          </Suspense>
          <ViewpointMarkers />
          {/* <Grid /> */}
          {hedgerows.map((h) => (
            <HedgeRow key={h.id} hedge={h} />
          ))}
          {developmentVisible &&
            pvParcels.map((p) => <Panels key={p.id} parcel={p.boundary} />)}
          <Trees trees={treeData} season={season} />
          <Buildings />
          {/* <Elm /> */}
          <CoordinatePicker terrainRef={null} />
          {/* <HedgePiece /> */}
          <WaypointMarkers />
        </>
      ) : null}
    </>
  );
};

export default Scene;
