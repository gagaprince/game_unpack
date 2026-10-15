"""Global, cross-bundle asset index keyed by decompressed uuid.

The same asset can appear in several bundles (with a path in one and only
inside a typed pack in another).  Rows belonging to one source asset
(image / texture / spriteFrame share a base uuid) are merged.
"""
import os

from .uuid import decompress_uuid
from . import images

IMAGE_KINDS = {"cc.ImageAsset", "cc.Texture2D", "cc.SpriteFrame"}
SKIP_KINDS = {
    "cc.EffectAsset", "cc.Material", "cc.SpriteAtlas", "cc.RenderPipeline",
    "cc.ForwardPipeline",
}


class Entry:
    def __init__(self, base_uuid):
        self.uuid = base_uuid
        self.rows = []                 # (bundle_name, AssetRow)
        self.kind = None               # resolved cc type
        self.path = ""                 # source-relative path without ext
        self.name = ""
        self.section = None            # (root, resolved, source_bundle)
        self.native = None             # native file path
        self.native_ext = None
        self.sf_data = None            # SpriteFrame custom payload
        self.texture_source = None

    def add_row(self, bundle_name, row):
        self.rows.append((bundle_name, row))
        if row.path and not self.path:
            # strip sub-asset suffixes produced by bundle paths triples
            p = row.path
            for suffix in ("/spriteFrame", "/texture", "/spriteframe"):
                if p.endswith(suffix):
                    p = p[: -len(suffix)]
            self.path = p
        if not self.name:
            self.name = os.path.basename(row.path.rstrip("/")) if row.path else ""

    @property
    def is_image(self):
        return self.kind in IMAGE_KINDS


def _safe_section(bundle, idx):
    try:
        return bundle.section_for(idx)
    except Exception:
        return None, None, None


def build_index(game):
    entries = {}

    def entry(uuid):
        u = decompress_uuid(uuid.split("@")[0])
        e = entries.get(u)
        if e is None:
            e = Entry(u)
            entries[u] = e
        return e

    for bname, b in game.items():
        for row in b.rows:
            e = entry(row.uuid)
            e.add_row(bname, row)

    # resolve kinds / section payloads / native files (cross-bundle)
    for e in entries.values():
        root_by_kind = {}
        for bname, row in e.rows:
            b = game[bname]
            if row.type:
                root_by_kind[row.type] = (bname, row)
            if not e.native:
                # native lookup in any bundle by this row's compressed uuid
                for other in game.values():
                    p = other.disk_file(row, "native")
                    if p and os.path.exists(p):
                        e.native = p
                        e.native_ext = os.path.splitext(p)[1]
                        break
        # pick representative section payload per kind
        for t, (bname, row) in root_by_kind.items():
            root, resolved, _src = _safe_section(game[bname], row.idx)
            if root is None:
                continue
            if isinstance(root, dict) and root.get("__custom__") == "cc.SpriteFrame":
                e.sf_data = root.get("data")
                ts = root.get("_textureSource")
                if isinstance(ts, dict):
                    e.texture_source = decompress_uuid(ts["__uuid__"].split("@")[0])
            if t not in ("cc.Texture2D",):
                e.section = (root, resolved, bname)
        # blank-type rows: infer from section
        if not e.kind:
            for bname, row in e.rows:
                root, resolved, _src = _safe_section(game[bname], row.idx)
                if isinstance(root, dict):
                    t = root.get("__type__") or root.get("__custom__")
                    if t:
                        e.kind = t
                        e.section = (root, resolved, bname)
                        if t == "cc.SpriteFrame":
                            e.sf_data = root.get("data")
                            ts = root.get("_textureSource")
                            if isinstance(ts, dict):
                                e.texture_source = decompress_uuid(ts["__uuid__"].split("@")[0])
                        break
            if not e.kind:
                # explicit kinds first
                for t in root_by_kind:
                    if t not in ("cc.Texture2D",):
                        e.kind = t
                        break
        if not e.kind and root_by_kind:
            e.kind = next(iter(root_by_kind))
        if e.kind in IMAGE_KINDS and not e.name and e.sf_data:
            e.name = e.sf_data.get("name") or ""

    # resolve native bitmap for cropped-only frames from the atlas entry
    for e in entries.values():
        if e.kind == "cc.SpriteFrame" and not e.native and e.texture_source:
            atlas = entries.get(e.texture_source)
            if atlas and atlas.native and atlas.native_ext in (".png", ".jpg", ".jpeg"):
                pass  # writer does the crop; nothing to store here

    return entries
