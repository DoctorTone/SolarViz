import { PerspectiveCamera } from "@react-three/drei";
import useSolar from "../state/store";

const ViewpointCamera = ({ parcel }) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const setViewpoint = useSolar((s) => s.setViewpoint);
  if (!meta) return null;

  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;

  // parcel centroid in BNG
  const cx = parcel.reduce((s, p) => s + p[0], 0) / parcel.length;
  const cn = parcel.reduce((s, p) => s + p[1], 0) / parcel.length;

  // -> world
  const px = cx - meta.origin_easting - halfW;
  const pz = meta.origin_northing - cn - halfD;
  const py = (sampleHeight(cx, cn) ?? 0) + 1.5;
  setViewpoint([px, py, pz]);

  return (
    <PerspectiveCamera
      makeDefault
      position={[px, py, pz]}
      fov={40} // ~50mm-equivalent
      far={20000}
    />
  );
};

export default ViewpointCamera;
