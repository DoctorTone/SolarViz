import { useMemo, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import useSolar from "../state/store";

const ParcelInspector = ({ parcel }) => {
  const meta = useSolar((s) => s.metaData);
  const sampleHeight = useSolar((s) => s.sampleHeight);
  const { camera } = useThree();

  // compute target once meta + parcel are ready
  const target = useMemo(() => {
    if (!meta) return null;
    const halfW = (meta.cols * meta.cell_size_m) / 2;
    const halfD = (meta.rows * meta.cell_size_m) / 2;
    const cx = parcel.reduce((s, p) => s + p[0], 0) / parcel.length;
    const cn = parcel.reduce((s, p) => s + p[1], 0) / parcel.length;
    const px = cx - meta.origin_easting - halfW;
    const pz = meta.origin_northing - cn - halfD;
    const py = (sampleHeight(cx, cn) ?? 0) + 1.5;
    return [px, py, pz];
  }, [meta, parcel, sampleHeight]);

  // position the camera once, when target first becomes available
  useEffect(() => {
    if (!target) return;
    camera.position.set(target[0] + 250, target[1] + 150, target[2] + 250);
    camera.far = 20000;
    camera.updateProjectionMatrix();
  }, [target, camera]);

  if (!target) return null;
  return (
    <OrbitControls
      makeDefault
      target={[target[0], target[1], target[2]]}
      enablePan
      enableZoom
    />
  );
};

export default ParcelInspector;
