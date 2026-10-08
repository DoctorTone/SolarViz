#!/usr/bin/env python3
"""
Fetch MapTiler satellite imagery for the Springwell terrain extent and
reproject it to British National Grid (EPSG:27700), clipped to the exact
DTM footprint, ready to drape on the terrain mesh.

Fetches an NxN grid of 2048px static images (--grid N => N*N requests) and
mosaics them, trading image count for ground resolution.

DIAGNOSTIC BUILD: keeps the raw per-tile JPEGs in <out>/_tiles/ and prints
every request URL, so we can see whether the tiles are actually different.

RUN ON YOUR OWN MACHINE (needs network to api.maptiler.com + your meta).
    pip install requests pyproj rasterio numpy pillow

Usage (PowerShell):
    $env:MAPTILER_KEY="your_key_here"
    python fetch_aerial.py --meta meta.json --out ./aerial --grid 1   # start here

Outputs (in --out):
    _tiles/t_<row>_<col>.jpg   raw images straight from MapTiler  <-- inspect these
    aerial_bng.tif             reprojected to EPSG:27700, clipped to DTM extent
    aerial_bng.png             plain RGB texture for Three.js (north-up)
"""

import os, io, sys, json, argparse
import requests
import numpy as np
from pyproj import Transformer
import rasterio
from rasterio.transform import from_bounds
from rasterio.merge import merge
from rasterio.warp import reproject, Resampling
from PIL import Image

MAX_SIDE = 2048  # MapTiler static max actual px per side (no @2x)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--meta", default="meta.json")
    ap.add_argument("--out", default="./aerial")
    ap.add_argument("--style", default="satellite")
    ap.add_argument("--grid", type=int, default=1)
    ap.add_argument("--margin", type=float, default=500.0)
    args = ap.parse_args()

    key = os.environ.get("MAPTILER_KEY")
    if not key:
        sys.exit("ERROR: set MAPTILER_KEY in your environment first.")

    os.makedirs(args.out, exist_ok=True)
    tiledir = os.path.join(args.out, "_tiles")
    os.makedirs(tiledir, exist_ok=True)
    meta = json.load(open(args.meta))

    e0, n0 = meta["origin_easting"], meta["origin_northing"]
    w_m = meta["cols"] * meta["cell_size_m"]
    h_m = meta["rows"] * meta["cell_size_m"]
    E_min, E_max = e0, e0 + w_m
    N_max, N_min = n0, n0 - h_m
    print(f"DTM extent (EPSG:27700): E {E_min}-{E_max}  N {N_min}-{N_max}  ({w_m/1000:g}x{h_m/1000:g} km)")

    m = args.margin
    BE_min, BE_max = E_min - m, E_max + m
    BN_min, BN_max = N_min - m, N_max + m
    g = max(1, args.grid)
    cw, ch = (BE_max - BE_min) / g, (BN_max - BN_min) / g
    ov = max(cw, ch) * 0.01

    to_wgs  = Transformer.from_crs("EPSG:27700", "EPSG:4326", always_xy=True)
    to_merc = Transformer.from_crs("EPSG:27700", "EPSG:3857", always_xy=True)

    tile_paths = []
    n = 0
    for j in range(g):
        for i in range(g):
            n += 1
            ce_min = BE_min + i * cw - ov
            ce_max = BE_min + (i + 1) * cw + ov
            cn_min = BN_min + j * ch - ov
            cn_max = BN_min + (j + 1) * ch + ov
            corners = [(ce_min, cn_min), (ce_min, cn_max), (ce_max, cn_min), (ce_max, cn_max)]
            lons, lats = zip(*[to_wgs.transform(e, nn) for e, nn in corners])
            mxs,  mys  = zip(*[to_merc.transform(e, nn) for e, nn in corners])
            lon_min, lon_max, lat_min, lat_max = min(lons), max(lons), min(lats), max(lats)
            mx_min, mx_max, my_min, my_max     = min(mxs),  max(mxs),  min(mys),  max(mys)

            aspect = (mx_max - mx_min) / (my_max - my_min)
            if aspect >= 1:
                w, h = MAX_SIDE, int(round(MAX_SIDE / aspect))
            else:
                w, h = int(round(MAX_SIDE * aspect)), MAX_SIDE

            url = (f"https://api.maptiler.com/maps/{args.style}/static/"
                   f"{lon_min},{lat_min},{lon_max},{lat_max}/{w}x{h}.jpg"
                   f"?key={key}&padding=0&attribution=false")
            print(f"\n  tile {n}/{g*g}  row={j} col={i}  req {w}x{h}")
            print(f"    BNG  E {ce_min:.0f}-{ce_max:.0f}  N {cn_min:.0f}-{cn_max:.0f}")
            print(f"    URL  {url.replace(key, 'KEY')}")
            r = requests.get(url, timeout=120)
            if not r.ok:
                sys.exit(f"ERROR {r.status_code}: {r.text[:300]}")

            jpg_path = os.path.join(tiledir, f"t_{j}_{i}.jpg")
            with open(jpg_path, "wb") as f:
                f.write(r.content)
            arr = np.array(Image.open(io.BytesIO(r.content)).convert("RGB"))
            ah, aw = arr.shape[:2]
            print(f"    got  {aw}x{ah} px -> {jpg_path}")

            t = from_bounds(mx_min, my_min, mx_max, my_max, aw, ah)
            tif = os.path.join(tiledir, f"t_{j}_{i}.tif")
            with rasterio.open(tif, "w", driver="GTiff", height=ah, width=aw,
                               count=3, dtype="uint8", crs="EPSG:3857", transform=t) as dst:
                for b in range(3):
                    dst.write(arr[:, :, b], b + 1)
            tile_paths.append(tif)

    srcs = [rasterio.open(p) for p in tile_paths]
    mosaic, mosaic_t = merge(srcs, resampling=Resampling.bilinear)
    for s in srcs:
        s.close()

    out_px = min(g * MAX_SIDE, 8192)
    dst_t = from_bounds(E_min, N_min, E_max, N_max, out_px, out_px)
    dst = np.zeros((3, out_px, out_px), dtype="uint8")
    for b in range(3):
        reproject(source=mosaic[b], destination=dst[b],
                  src_transform=mosaic_t, src_crs="EPSG:3857",
                  dst_transform=dst_t, dst_crs="EPSG:27700",
                  resampling=Resampling.bilinear)

    hwc = np.transpose(dst, (1, 2, 0))
    with rasterio.open(os.path.join(args.out, "aerial_bng.tif"), "w", driver="GTiff",
                       height=out_px, width=out_px, count=3, dtype="uint8",
                       crs="EPSG:27700", transform=dst_t) as d:
        for b in range(3):
            d.write(hwc[:, :, b], b + 1)
    Image.fromarray(hwc, "RGB").save(os.path.join(args.out, "aerial_bng.png"))

    res = (E_max - E_min) / out_px
    print(f"\nDone. {out_px}x{out_px} px, ~{res:.2f} m/px.")
    print(f"Inspect the raw tiles in {tiledir} -- are they DIFFERENT from each other?")


if __name__ == "__main__":
    main()