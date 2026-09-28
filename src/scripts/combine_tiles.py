#!/usr/bin/env python3
"""
Combine four adjacent BNG (EPSG:27700) LIDAR DTM tiles into one mosaic
heightfield for the R3F terrain.

Assumes a 2x2 grid of equally-sized, equal-resolution tiles that abut exactly
(5 km apart in a standard EA composite). Auto-sorts the four tiles into
quadrants by their origin coordinates, so you can't place one wrong.

Inputs: four directories (or files), each containing a tile's
  terrain_heights.bin  and  terrain_meta.json
produced by dtm_to_heightfield.py.

Output: combined terrain_heights.bin + terrain_meta.json.

Run:
  python combine_tiles.py tileA tileB tileC tileD  [out_dir]
where each tileX is a directory holding that tile's .bin + meta.json.
"""

import json
import sys
from pathlib import Path
import numpy as np


def load_tile(d):
    d = Path(d)
    meta = json.loads((d / "terrain_meta.json").read_text())
    heights = np.fromfile(d / "terrain_heights.bin", dtype=np.float32)
    heights = heights.reshape(meta["rows"], meta["cols"])
    return {"heights": heights, "meta": meta}


def combine(tile_dirs, out_dir="."):
    tiles = [load_tile(d) for d in tile_dirs]
    if len(tiles) != 4:
        print(f"ERROR: need exactly 4 tiles, got {len(tiles)}")
        sys.exit(1)

    # sanity: all same dims and cell size
    R = tiles[0]["meta"]["rows"]
    C = tiles[0]["meta"]["cols"]
    cell = tiles[0]["meta"]["cell_size_m"]
    for t in tiles:
        m = t["meta"]
        if m["rows"] != R or m["cols"] != C:
            print("ERROR: tiles have different dimensions — not a uniform grid")
            sys.exit(1)
        if abs(m["cell_size_m"] - cell) > 1e-6:
            print("ERROR: tiles have different cell sizes")
            sys.exit(1)

    # origin_easting = WEST edge of tile; origin_northing = NORTH edge (top row).
    easts = sorted(set(t["meta"]["origin_easting"] for t in tiles))
    norths = sorted(set(t["meta"]["origin_northing"] for t in tiles))
    if len(easts) != 2 or len(norths) != 2:
        print("ERROR: the four origins don't form a 2x2 grid.")
        print("  eastings:", easts, " northings:", norths)
        print("  Check the tiles are the four adjacent squares.")
        sys.exit(1)

    west_e, east_e = easts        # lower easting = west column
    south_n, north_n = norths     # higher northing = north row (top)

    # expected spacing = one tile width/height in metres
    tile_w = C * cell
    tile_h = R * cell
    if abs((east_e - west_e) - tile_w) > 1.0:
        print(f"WARNING: easting gap {east_e - west_e}m != tile width {tile_w}m — tiles may not abut in E")
    if abs((north_n - south_n) - tile_h) > 1.0:
        print(f"WARNING: northing gap {north_n - south_n}m != tile height {tile_h}m — tiles may not abut in N")

    def quadrant(t):
        e = t["meta"]["origin_easting"]
        n = t["meta"]["origin_northing"]
        row = 0 if n == north_n else 1   # top row = northern tiles
        col = 0 if e == west_e else 1    # left col = western tiles
        return row, col

    combined = np.zeros((2 * R, 2 * C), dtype=np.float32)
    placed = {}
    for t in tiles:
        row, col = quadrant(t)
        placed[(row, col)] = t["meta"]
        combined[row*R:(row+1)*R, col*C:(col+1)*C] = t["heights"]

    if len(placed) != 4:
        print("ERROR: two tiles resolved to the same quadrant — origins not distinct")
        sys.exit(1)

    labels = {(0,0): "NW", (0,1): "NE", (1,0): "SW", (1,1): "SE"}
    print("Placed tiles:")
    for (r, c), m in sorted(placed.items()):
        print(f"  {labels[(r,c)]}: origin ({m['origin_easting']:.0f}E, {m['origin_northing']:.0f}N)")

    hmin = float(combined.min())
    hmax = float(combined.max())

    out_meta = {
        "cols": 2 * C,
        "rows": 2 * R,
        "cell_size_m": float(cell),
        "origin_easting": float(west_e),    # western edge of whole mosaic
        "origin_northing": float(north_n),  # northern edge of whole mosaic
        "height_min": hmin,
        "height_max": hmax,
        "row_order": "top_to_bottom",
        "crs": "EPSG:27700",
    }

    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    combined.tofile(out_dir / "terrain_heights.bin")
    (out_dir / "terrain_meta.json").write_text(json.dumps(out_meta, indent=2))

    size_mb = (out_dir / "terrain_heights.bin").stat().st_size / 1e6
    print(f"\nCombined mosaic: {2*C} x {2*R} vertices ({size_mb:.1f} MB)")
    print(f"Extent: {west_e:.0f}-{east_e + tile_w:.0f}E, "
          f"{south_n:.0f}-{north_n:.0f}N")
    print(f"Heights: {hmin:.1f}m to {hmax:.1f}m")
    print(f"Origin (top-left): {west_e:.0f}E, {north_n:.0f}N")


if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python combine_tiles.py <tileA> <tileB> <tileC> <tileD> [out_dir]")
        print("  each tile = a directory containing terrain_heights.bin + terrain_meta.json")
        sys.exit(1)
    dirs = sys.argv[1:5]
    out = sys.argv[5] if len(sys.argv) > 5 else "combined"
    combine(dirs, out)