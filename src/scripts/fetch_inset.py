#!/usr/bin/env python3
"""
Fetch a HIGH-RES satellite inset over the viewpoint area using MapTiler XYZ
raster tiles (satellite-v4), reproject to British National Grid (EPSG:27700),
and clip to a chosen BNG box. This is the sharp patch that overlays the soft
10km base texture around the exploration/free-roam area.

XYZ tiles sit on a shared global grid, so they mosaic seamlessly (unlike the
bounded-static approach). Tile pixel size (256/512) doesn't matter here: each
tile's geographic extent comes from standard z/x/y math regardless.

RUN ON YOUR OWN MACHINE.
    pip install requests pyproj rasterio numpy pillow

Usage (PowerShell):
    $env:MAPTILER_KEY="your_key_here"
    python fetch_inset.py --z 17 --aoi 507000 358000 509500 360500 --out ./aerial

Outputs (in --out):
    aerial_inset_bng.tif   georeferenced EPSG:27700 (open in QGIS to check)
    aerial_inset.png       the inset texture
    aerial_inset.json      its exact BNG extent + size (feed this to the app to place the patch)
    --feather N            optional: fade the outer N metres of the inset to transparent (RGBA PNG),
                           so the sharp patch blends into the soft base instead of showing a hard edge
"""

import os, io, sys, json, math, argparse
import requests
import numpy as np
from pyproj import Transformer
import rasterio
from rasterio.transform import from_bounds
from rasterio.warp import reproject, Resampling
from PIL import Image

MERC = 20037508.342789244  # half-circumference of Web Mercator (m)


def lonlat_to_tile(lon, lat, z):
    n = 2 ** z
    x = (lon + 180.0) / 360.0 * n
    lr = math.radians(lat)
    y = (1.0 - math.log(math.tan(lr) + 1.0 / math.cos(lr)) / math.pi) / 2.0 * n
    return x, y


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="./aerial")
    ap.add_argument("--z", type=int, default=17, help="XYZ zoom for the inset")
    ap.add_argument("--aoi", type=float, nargs=4, metavar=("minE", "minN", "maxE", "maxN"),
                    default=[507000, 358000, 509500, 360500],
                    help="inset area in BNG eastings/northings")
    ap.add_argument("--map", default="satellite",
                    help="MapTiler map id (same one that worked for static)")
    ap.add_argument("--meta", help="terrain meta JSON (needed for --match)")
    ap.add_argument("--match", help="base PNG (e.g. ./aerial/aerial_bng.png): "
                    "rebalance the inset's brightness/colour to match the base over the overlap")
    ap.add_argument("--retina", action="store_true",
                    help="request @2x tiles (512px, ~2x sharper, same tile count)")
    ap.add_argument("--feather", type=float, default=0.0,
                    help="metres of edge fade to transparent (0 = hard edge, opaque)")
    args = ap.parse_args()

    key = os.environ.get("MAPTILER_KEY")
    if not key:
        sys.exit("ERROR: set MAPTILER_KEY first.")
    os.makedirs(args.out, exist_ok=True)

    Emin, Nmin, Emax, Nmax = args.aoi
    to_wgs = Transformer.from_crs("EPSG:27700", "EPSG:4326", always_xy=True)
    # BNG box corners -> WGS84; take min/max (over-covers the rotated box)
    corners = [(Emin, Nmin), (Emin, Nmax), (Emax, Nmin), (Emax, Nmax)]
    lons, lats = zip(*[to_wgs.transform(e, n) for e, n in corners])
    lon_min, lon_max, lat_min, lat_max = min(lons), max(lons), min(lats), max(lats)

    z = args.z
    xa, ya = lonlat_to_tile(lon_min, lat_max, z)   # NW
    xb, yb = lonlat_to_tile(lon_max, lat_min, z)   # SE
    x0, x1 = int(math.floor(xa)) - 1, int(math.floor(xb)) + 1   # +1 tile margin
    y0, y1 = int(math.floor(ya)) - 1, int(math.floor(yb)) + 1
    nx, ny = x1 - x0 + 1, y1 - y0 + 1
    total = nx * ny
    print(f"AOI BNG: E {Emin:.0f}-{Emax:.0f} N {Nmin:.0f}-{Nmax:.0f}")
    print(f"z{z}: tiles x {x0}-{x1} y {y0}-{y1}  => {nx}x{ny} = {total} tiles")
    if total > 1200:
        sys.exit(f"Refusing {total} tiles — shrink the AOI or lower --z.")

    # fetch + assemble
    sess = requests.Session()
    canvas = None
    tw = th = None
    scale = "@2x" if args.retina else ""
    for yi in range(y0, y1 + 1):
        for xi in range(x0, x1 + 1):
            url = f"https://api.maptiler.com/maps/{args.map}/256/{z}/{xi}/{yi}{scale}.jpg?key={key}"
            r = sess.get(url, timeout=60)
            if r.status_code == 204 or not r.content:
                tile = None
            elif not r.ok:
                sys.exit(f"ERROR {r.status_code} on {z}/{xi}/{yi}: {r.text[:200]}")
            else:
                tile = np.array(Image.open(io.BytesIO(r.content)).convert("RGB"))
            if tile is not None and tw is None:
                th, tw = tile.shape[:2]
                canvas = np.zeros((ny * th, nx * tw, 3), dtype="uint8")
            if tile is not None:
                r0, c0 = (yi - y0) * th, (xi - x0) * tw
                canvas[r0:r0 + th, c0:c0 + tw] = tile
        done = (yi - y0 + 1) * nx
        print(f"  {done}/{total}", end="\r", flush=True)
    print()
    if canvas is None:
        sys.exit("No tiles returned.")

    # assembled image mercator extent from the tile grid
    n = 2 ** z
    mx0 = x0 / n * 2 * MERC - MERC
    mx1 = (x1 + 1) / n * 2 * MERC - MERC
    my0 = MERC - (y1 + 1) / n * 2 * MERC   # south
    my1 = MERC - y0 / n * 2 * MERC         # north
    src_t = from_bounds(mx0, my0, mx1, my1, canvas.shape[1], canvas.shape[0])

    # output size: preserve native resolution over the clipped AOI
    lat_mid = (lat_min + lat_max) / 2
    mpp = (mx1 - mx0) / canvas.shape[1] * math.cos(math.radians(lat_mid))  # ground m/px
    out_w = min(8192, max(256, int(round((Emax - Emin) / mpp))))
    out_h = min(8192, max(256, int(round((Nmax - Nmin) / mpp))))
    print(f"native ~{mpp:.2f} m/px -> output {out_w}x{out_h}")

    dst_t = from_bounds(Emin, Nmin, Emax, Nmax, out_w, out_h)
    dst = np.zeros((3, out_h, out_w), dtype="uint8")
    for b in range(3):
        reproject(source=canvas[:, :, b], destination=dst[b],
                  src_transform=src_t, src_crs="EPSG:3857",
                  dst_transform=dst_t, dst_crs="EPSG:27700",
                  resampling=Resampling.bilinear)
    hwc = np.transpose(dst, (1, 2, 0))

    # colour-match the inset to the base over their overlap (fixes the brightness jump)
    if args.match:
        if not args.meta:
            sys.exit("--match needs --meta to locate the base extent.")
        mm = json.load(open(args.meta))
        bE0, bN0 = mm["origin_easting"], mm["origin_northing"]
        bW = mm["cols"] * mm["cell_size_m"]
        bH = mm["rows"] * mm["cell_size_m"]
        bEmin, bEmax, bNmin, bNmax = bE0, bE0 + bW, bN0 - bH, bN0
        base = np.asarray(Image.open(args.match).convert("RGB"))
        BH, BW = base.shape[:2]
        c0 = max(0, int((Emin - bEmin) / (bEmax - bEmin) * BW))
        c1 = min(BW, int(math.ceil((Emax - bEmin) / (bEmax - bEmin) * BW)))
        r0 = max(0, int((bNmax - Nmax) / (bNmax - bNmin) * BH))   # row 0 = north
        r1 = min(BH, int(math.ceil((bNmax - Nmin) / (bNmax - bNmin) * BH)))
        crop = base[r0:r1, c0:c1].reshape(-1, 3).astype(float)
        if crop.size:
            gain = crop.mean(0) / np.maximum(hwc.reshape(-1, 3).astype(float).mean(0), 1e-6)
            print(f"colour-match gain (R,G,B): {gain.round(3)}")
            hwc = np.clip(hwc.astype(float) * gain, 0, 255).astype("uint8")
        else:
            print("WARN: base/inset overlap empty — skipping colour match")

    with rasterio.open(os.path.join(args.out, "aerial_inset_bng.tif"), "w", driver="GTiff",
                       height=out_h, width=out_w, count=3, dtype="uint8",
                       crs="EPSG:27700", transform=dst_t) as d:
        for b in range(3):
            d.write(hwc[:, :, b], b + 1)

    if args.feather > 0:
        fx = int(round(args.feather / (Emax - Emin) * out_w))
        fy = int(round(args.feather / (Nmax - Nmin) * out_h))
        ax = np.ones(out_w); ay = np.ones(out_h)
        if fx > 0:
            ramp = np.linspace(0, 1, fx)
            ax[:fx] = ramp; ax[-fx:] = ramp[::-1]
        if fy > 0:
            ramp = np.linspace(0, 1, fy)
            ay[:fy] = ramp; ay[-fy:] = ramp[::-1]
        alpha = (np.outer(ay, ax) * 255).astype("uint8")
        Image.fromarray(np.dstack([hwc, alpha]), "RGBA").save(os.path.join(args.out, "aerial_inset.png"))
        print(f"feathered {args.feather:.0f} m edge -> RGBA")
    else:
        Image.fromarray(hwc, "RGB").save(os.path.join(args.out, "aerial_inset.png"))

    extent = {"crs": "EPSG:27700", "min_easting": Emin, "min_northing": Nmin,
              "max_easting": Emax, "max_northing": Nmax,
              "width_px": out_w, "height_px": out_h, "ground_mpp": round(mpp, 3),
              "row0_is_north": True}
    json.dump(extent, open(os.path.join(args.out, "aerial_inset.json"), "w"), indent=2)
    print("Done. Check aerial_inset_bng.tif in QGIS; place aerial_inset.png using aerial_inset.json.")


if __name__ == "__main__":
    main()