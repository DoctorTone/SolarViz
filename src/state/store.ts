import { create } from "zustand";

type SolarState = {
  metaData: null;
  heights: null | Float32Array;
  viewpoints: [];
  loaded: boolean;
  currentYear: number;
  setCurrentYear: (year: number) => void;
  currentSeason: "summer" | "winter";
  setCurrentSeason: (season: "summer" | "winter") => void;
  loadData: () => void;
  sampleHeight: (easting: number, northing: number) => null | number;
  viewPoint: number[];
  setViewpoint: (viewPoint: number[]) => void;
  viewMode: "overview" | "viewpoint";
  activeViewpoint: null | number; // vp id when in viewpoint mod
  activeDirection: number;
  enterViewpoint: (id: number) => void;
  exitToOverview: () => void;
  setDirection: (i: number) => void;
  stage: "baseline" | "built" | "grown";
  setStage: (stage: "baseline" | "built" | "grown") => void;
  showPanels: boolean;
  togglePanels: () => void;
  developmentVisible: boolean;
};

const useSolar = create<SolarState>((set, get) => ({
  metaData: null,
  heights: null,
  viewpoints: [],
  viewPoint: [0, 0, 0],
  setViewpoint: (viewpoint) => set({ viewPoint: [...viewpoint] }),
  loaded: false,
  currentYear: 0,
  setCurrentYear: (year) => set({ currentYear: year }),
  currentSeason: "summer",
  setCurrentSeason: (season) => set({ currentSeason: season }),
  viewMode: "overview",
  activeViewpoint: null,
  activeDirection: 0,
  developmentVisible: true,
  enterViewpoint: (id) =>
    set({
      viewMode: "viewpoint",
      activeViewpoint: id,
      activeDirection: 0,
      stage: "built",
      developmentVisible: true,
      currentYear: 1,
    }),
  exitToOverview: () => set({ viewMode: "overview", activeViewpoint: null }),
  setDirection: (i) => set({ activeDirection: i }),
  stage: "baseline",
  setStage: (stage) => {
    const map = {
      baseline: {
        developmentVisible: false,
        showPanels: false,
        currentYear: 0,
      },
      built: { developmentVisible: true, showPanels: true, currentYear: 1 },
      grown: { developmentVisible: true, showPanels: true, currentYear: 10 },
    };
    set(map[stage] ? { stage, ...map[stage] } : { stage });
  },
  showPanels: false,
  togglePanels: () => set((s) => ({ showPanels: !s.showPanels })),
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
