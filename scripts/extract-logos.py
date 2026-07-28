"""Extract horizontal logo and mark from logo-v1.png sprite sheet."""
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    raise SystemExit("Pillow required: pip install Pillow")

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "icons" / "logo-v1.png"
OUT_H = ROOT / "assets" / "icons" / "logo-horizontal.png"
OUT_M = ROOT / "assets" / "icons" / "logo-mark.png"


def is_content(rgba, bg_threshold=28):
    r, g, b, a = rgba
    if a < 16:
        return False
    # treat near-black background as empty
    return max(r, g, b) > bg_threshold or a > 240


def bbox_of_region(im, x0, y0, x1, y1, pad=8):
    region = im.crop((x0, y0, x1, y1))
    px = region.load()
    w, h = region.size
    min_x, min_y = w, h
    max_x, max_y = 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            if is_content(px[x, y]):
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if not found:
        return None
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(w - 1, max_x + pad)
    max_y = min(h - 1, max_y + pad)
    return (min_x, min_y, max_x + 1, max_y + 1)


def trim_transparent(im, pad=4):
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    min_x, min_y = w, h
    max_x, max_y = 0, 0
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 16 and max(px[x, y][:3]) > 28:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if max_x < min_x:
        return im
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(w - 1, max_x + pad)
    max_y = min(h - 1, max_y + pad)
    return im.crop((min_x, min_y, max_x + 1, max_y + 1))


def black_to_alpha(im, threshold=42):
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                px[x, y] = (0, 0, 0, 0)
    return im


def main():
    if not SRC.exists():
        SRC_ALT = ROOT / "logo-v1.png"
        if SRC_ALT.exists():
            src = SRC_ALT
        else:
            raise SystemExit(f"Missing {SRC}")
    else:
        src = SRC

    im = Image.open(src).convert("RGBA")
    W, H = im.size
    print(f"Source: {W}x{H}")

    # Top band: horizontal lockup (full width, upper half as search area)
    top_y1 = int(H * 0.52)
    bb = bbox_of_region(im, 0, 0, W, top_y1, pad=12)
    if not bb:
        raise SystemExit("Could not detect horizontal logo")
    hx0, hy0, hx1, hy1 = bb
    horizontal = im.crop((hx0, hy0, hx1, hy1))
    horizontal = trim_transparent(horizontal, pad=6)
    horizontal = black_to_alpha(horizontal)
    OUT_H.parent.mkdir(parents=True, exist_ok=True)
    horizontal.save(OUT_H, optimize=True)
    print(f"Saved {OUT_H.name}: {horizontal.size[0]}x{horizontal.size[1]}")

    # Bottom-right quadrant: icon only
    mx0 = W // 2
    my0 = top_y1
    bb_m = bbox_of_region(im, mx0, my0, W, H, pad=10)
    if not bb_m:
        # fallback: right half bottom
        bb_m = bbox_of_region(im, int(W * 0.55), int(H * 0.45), W, H, pad=10)
    if not bb_m:
        raise SystemExit("Could not detect logo mark")
    lx, ly, rx, ry = bb_m
    mark = im.crop((mx0 + lx, my0 + ly, mx0 + rx, my0 + ry))
    mark = trim_transparent(mark, pad=8)
    mark = black_to_alpha(mark)
    mark.save(OUT_M, optimize=True)
    print(f"Saved {OUT_M.name}: {mark.size[0]}x{mark.size[1]}")


if __name__ == "__main__":
    main()
