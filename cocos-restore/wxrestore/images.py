"""Extract source images: copy standalone native bitmaps or crop atlas frames.

Atlas geometry verified empirically against 33 standalone fruit frames:
- rect origin is top-left
- non-rotated: crop (x, y, w, h)
- rotated:     atlas region is (x, y, x+h, y+w), rotate 90 degrees CCW
Mean RMS after crop ~3 (sub-pixel trim rounding), max ~10.
The trimmed patch is padded into the originalSize canvas using `offset`,
so re-imported full-frame sprites look identical.
"""
import struct


def image_size(path):
    with open(path, "rb") as f:
        head = f.read(32)
    if head[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", head[16:24])
    if head[:2] == b"\xff\xd8":
        with open(path, "rb") as f:
            f.read(2)
            while True:
                b = f.read(2)
                if not b:
                    return None
                if b[0] != 0xFF:
                    continue
                m = b[1]
                if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC):
                    f.read(3)
                    h, w = struct.unpack(">HH", f.read(4))
                    return w, h
                ln = struct.unpack(">H", f.read(2))[0]
                f.read(ln - 2)
    return None


def crop_frame(sf_data, atlas_path):
    from PIL import Image
    rect = sf_data["rect"]
    x, y, w, h = int(rect["x"]), int(rect["y"]), int(rect["width"]), int(rect["height"])
    atlas = Image.open(atlas_path).convert("RGBA")
    if sf_data.get("rotated"):
        patch = atlas.crop((x, y, x + h, y + w)).rotate(90, expand=True)
    else:
        patch = atlas.crop((x, y, x + w, y + h))
    osize = sf_data.get("originalSize") or {"width": w, "height": h}
    off = sf_data.get("offset") or {"x": 0, "y": 0}
    ow, oh = int(round(osize["width"])), int(round(osize["height"]))
    if patch.size == (ow, oh):
        return patch
    canvas = Image.new("RGBA", (ow, oh), (0, 0, 0, 0))
    left = int(round((ow - w) / 2 + off["x"]))
    top = int(round((oh - h) / 2 - off["y"]))
    canvas.paste(patch, (left, top), patch)
    return canvas
