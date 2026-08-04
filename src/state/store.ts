import { create } from "zustand";

type SolarState = {
  metaData: null;
  heights: null | Float32Array;
  viewpoints: [];
  loaded: boolean;
  loadData: () => void;
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
}));

export default useSolar;
