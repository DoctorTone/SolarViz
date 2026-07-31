#!/usr/bin/env python3
"""
Convert an Environment Agency LIDAR Composite DTM GeoTIFF into a compact
heightfield for a Three.js / R3F terrain mesh.

Outputs:
  terrain_heights.bin   float32 little-endian, row-major, length = cols*rows
  terrain_meta.json     dimensions, BNG origin, cell size, height range, nodata

The R3F side loads the .bin as a Float32Array and builds a PlaneGeometry
of (cols x rows) vertices, displacing each by its height.

Coordinate note: EA DTM is OSGB36 / British National Grid (EPSG:27700),
metres east/north. No projection needed — BNG metres map directly to world
X/Z. origin_e / origin_n let you later place lat/lon viewpoints & panels
(convert those TO BNG) onto the same grid.
"""

import json
import struct
import sys
from pathlib import Path

import numpy as np
import rasterio
from rasterio.enums import Resampling


def convert(tif_path, out_dir=".", target_cell_m=10.0):
    tif_path = Path(tif_path)
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    with rasterio.open(tif_path) as src:
        native_cell = src.transform.a  # metres per pixel (x); usually 1 or 2
        print(f"Source: {src.width} x {src.height} px @ {native_cell}m/px")
        print(f"CRS: {src.crs}")

        # Downsample factor to reach ~target_cell_m resolution
        factor = max(1, round(target_cell_m / native_cell))
        out_w = src.width // factor
        out_h = src.height // factor
        print(f"Downsampling by {factor}x -> {out_w} x {out_h} "
              f"(~{native_cell*factor}m cells)")

        # Read with averaging resample (bilinear-ish for terrain)
        data = src.read(
            1,
            out_shape=(out_h, out_w),
            resampling=Resampling.average,
        ).astype(np.float32)

        # The transform for the *downsampled* grid
        new_transform = src.transform * src.transform.scale(
            src.width / out_w, src.height / out_h
        )
        origin_e = new_transform.c   # easting of top-left corner
        origin_n = new_transform.f   # northing of top-left corner
        cell = new_transform.a       # actual downsampled cell size (m)

        nodata = src.nodata if src.nodata is not None else -9999.0

    # Handle NODATA: replace with nearest valid via mean of valid cells.
    mask = (data == nodata) | np.isnan(data)
    valid = data[~mask]
    if valid.size == 0:
        print("ERROR: no valid height data in tile")
        sys.exit(1)
    fill = float(np.median(valid))
    data[mask] = fill
    n_nodata = int(mask.sum())

    hmin = float(data.min())
    hmax = float(data.max())
    print(f"Heights: {hmin:.1f}m to {hmax:.1f}m "
          f"(filled {n_nodata} nodata cells with {fill:.1f}m)")

    # Write raw float32 binary, row-major (top row first)
    bin_path = out_dir / "terrain_heights.bin"
    data.tofile(bin_path)  # numpy float32 little-endian on x86

    meta = {
        "cols": out_w,
        "rows": out_h,
        "cell_size_m": float(cell),
        "origin_easting": float(origin_e),   # BNG, top-left corner
        "origin_northing": float(origin_n),
        "height_min": hmin,
        "height_max": hmax,
        "nodata_fill": fill,
        "row_order": "top_to_bottom",        # row 0 = north edge
        "crs": "EPSG:27700",
    }
    meta_path = out_dir / "terrain_meta.json"
    meta_path.write_text(json.dumps(meta, indent=2))

    size_mb = bin_path.stat().st_size / 1e6
    print(f"\nWrote {bin_path} ({size_mb:.1f} MB) and {meta_path}")
    print(f"Vertices: {out_w * out_h:,}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python dtm_to_heightfield.py <dtm.tif> [target_cell_m]")
        sys.exit(1)
    tif = sys.argv[1]
    target = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0
    convert(tif, target_cell_m=target)