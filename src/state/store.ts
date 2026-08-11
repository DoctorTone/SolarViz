import { create } from "zustand";

type SolarState = {
  metaData: null;
  heights: null | Float32Array;
  viewpoints: [];
  loaded: boolean;
  loadData: () => void;
  sampleHeight: (easting: number, northing: number) => null | number;
};

const useSolar = create<SolarState>((set, get) => ({
  metaData: null,
  heights: null,
  viewpoints: [],
  loaded: false,
  loadData: async () => {
    const [meta, buffer, views] = await Promise.all([
      fetch("/data/terrain_meta.json").then((r) => r.json()),
      fetch("/data/terrain_heights.bin").then((r) => r.arrayBuffer()),
      fetch("/data/viewpoints.json").then((r) => r.json()),
    ]);
    set({
      metaData: meta,
      heights: new Float32Array(buffer),
      viewpoints: views,
      loaded: true,
    });
  },
  // Terrain height lookup: BNG easting/northing -> ground elevation (m AOD).
  // Returns null if the point is outside the loaded tile.
  sampleHeight: (easting, northing) => {
    const { metaData, heights } = get();
    if (!metaData || !heights) return null;

    const col = Math.round(
      (easting - metaData.origin_easting) / metaData.cell_size_m,
    );
    const row = Math.round(
      (metaData.origin_northing - northing) / metaData.cell_size_m,
    );

    if (col < 0 || col >= metaData.cols || row < 0 || row >= metaData.rows)
      return null;

    return heights[row * metaData.cols + col];
  },
}));

export default useSolar;
