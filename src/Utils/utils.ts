import { RESOLUTIONS, CONFIGURATIONS } from "../state/Config";
import useSolar from "../state/store";

export const getScreenConfiguration = (width: number, height: number) => {
  // Small screens
  if (width <= RESOLUTIONS.SMALL) {
    return CONFIGURATIONS["small"];
  }

  // Phone in landscape
  if (width <= RESOLUTIONS.MEDIUM && width > height) {
    return CONFIGURATIONS["landscape"];
  }

  if (width <= RESOLUTIONS.LARGE && width > height) {
    return CONFIGURATIONS["large"];
  }

  // if (width <= RESOLUTIONS.LARGE) {
  //   return CONFIGURATIONS["large"];
  // }

  // if (width <= RESOLUTIONS.X_LARGE) {
  //   return CONFIGURATIONS[CONFIG_TYPE.TABLET];
  // }

  if (width >= RESOLUTIONS.X_LARGE) {
    return CONFIGURATIONS["extraLarge"];
  }

  return CONFIGURATIONS["small"];
};

// BNG easting/northing -> world position on the centred terrain plane
export const bngMarkersToWorld = (easting, northing, meta, heights) => {
  const { origin_easting, origin_northing, cols, rows, cell_size_m } = meta;

  const col = (easting - origin_easting) / cell_size_m; // 0..cols-1
  const row = (origin_northing - northing) / cell_size_m; // 0..rows-1 (north=row0)

  // world X/Z: plane centred, so shift by half-extent
  const worldX = col * cell_size_m - ((cols - 1) * cell_size_m) / 2;
  const worldZ = row * cell_size_m - ((rows - 1) * cell_size_m) / 2;

  // sample terrain height (nearest cell; bilinear later if needed)
  const ci = Math.round(col),
    ri = Math.round(row);
  let worldY = 0;
  if (ci >= 0 && ci < cols && ri >= 0 && ri < rows) {
    worldY = heights[ri * cols + ci];
  }
  return {
    worldX,
    worldY,
    worldZ,
    inTile: ci >= 0 && ci < cols && ri >= 0 && ri < rows,
  };
};

export function bngToWorld(e, n, meta) {
  const halfW = (meta.cols * meta.cell_size_m) / 2;
  const halfD = (meta.rows * meta.cell_size_m) / 2;
  return [e - meta.origin_easting - halfW, meta.origin_northing - n - halfD];
}
